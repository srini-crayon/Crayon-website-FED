"use client";

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistService, Wishlist, generateSlug } from '../api/wishlist.service'
import { useAuthStore } from './auth.store'
import { apiClient } from '../api/client'

// Helper to normalize wishlist from API (handle different field names)
function normalizeWishlist(raw: any): Wishlist {
    // Handle agents - can be array of strings OR array of objects with agent_id
    let agentIds: string[] = []
    const rawAgents = raw.agents || raw.agent_ids || []
    if (Array.isArray(rawAgents)) {
        agentIds = rawAgents.map((a: any) => {
            // If it's an object with agent_id, extract it
            if (typeof a === 'object' && a !== null && a.agent_id) {
                return a.agent_id
            }
            // Otherwise assume it's already a string ID
            return String(a)
        })
    }

    return {
        id: raw.id || raw.wishlist_id || raw._id,
        name: raw.name || raw.wishlist_name || 'Favorites',
        description: raw.description,
        agents: agentIds,
        isPublic: raw.isPublic || raw.is_public || false,
        slug: raw.slug || raw.slug_name,
        created_by: raw.created_by || raw.createdBy || raw.user_email || raw.userEmail,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
    }
}

// Check if using local auth (bypass API)
// DISABLED: Always use API-based auth and storage
const isLocalAuth = () => {
    return false; // Always use API, never use localStorage
}

// Local storage key for wishlists
const LOCAL_WISHLISTS_KEY = 'local-wishlists'

interface WishlistsState {
    // All wishlists for the user
    wishlists: Wishlist[]
    // Currently selected wishlist for filtering
    selectedWishlistId: string | null
    // Default wishlist ID (for quick favorites)
    defaultWishlistId: string | null
    // Set of all favorited agent IDs (across all wishlists)
    allFavoritedAgentIds: Set<string>
    // Loading states
    isLoading: boolean
    isCreating: boolean
    // Modal state
    isPickerOpen: boolean
    pickerAgentId: string | null

    // Actions
    loadAllWishlists: () => Promise<void>
    createWishlist: (name: string, description?: string) => Promise<Wishlist | null>
    deleteWishlist: (id: string) => Promise<void>
    renameWishlist: (id: string, name: string) => Promise<void>
    addToWishlist: (wishlistId: string, agentId: string) => Promise<void>
    removeFromWishlist: (wishlistId: string, agentId: string) => Promise<void>
    isInWishlist: (wishlistId: string, agentId: string) => boolean
    isInAnyWishlist: (agentId: string) => boolean
    getWishlistsForAgent: (agentId: string) => Wishlist[]

    // Quick toggle (adds to default wishlist)
    toggleQuickFavorite: (agentId: string) => Promise<void>

    // Modal actions
    openPicker: (agentId: string) => void
    closePicker: () => void

    // Select wishlist for viewing
    selectWishlist: (id: string | null) => void

    // Public wishlist management
    togglePublic: (id: string, isPublic: boolean) => Promise<void>
    getPublicWishlist: (id: string) => Promise<Wishlist | null>
}

export const useWishlistsStore = create<WishlistsState>()(
    persist(
        (set, get) => ({
            wishlists: [],
            selectedWishlistId: null,
            defaultWishlistId: null,
            allFavoritedAgentIds: new Set(),
            isLoading: false,
            isCreating: false,
            isPickerOpen: false,
            pickerAgentId: null,

            loadAllWishlists: async () => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated
                const user = useAuthStore.getState().user
                
                console.log('🔍 loadAllWishlists: Starting...');
                console.log('🔍 loadAllWishlists: isAuthenticated =', isAuthenticated);
                console.log('🔍 loadAllWishlists: user =', user);
                console.log('🔍 loadAllWishlists: isLocalAuth() =', isLocalAuth());
                
                set({ isLoading: true })
                
                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        console.log('🔍 loadAllWishlists: Using local auth, checking localStorage...');
                        console.log('🔍 loadAllWishlists: LOCAL_WISHLISTS_KEY =', LOCAL_WISHLISTS_KEY);
                        const stored = localStorage.getItem(LOCAL_WISHLISTS_KEY)
                        console.log('🔍 loadAllWishlists: Raw stored value =', stored ? 'exists (' + stored.length + ' chars)' : 'null');
                        let localWishlists: Wishlist[] = stored ? JSON.parse(stored) : []
                        console.log('🔍 loadAllWishlists: Parsed wishlists count =', localWishlists.length);
                        console.log('🔍 loadAllWishlists: Wishlists =', localWishlists);
                        
                        // If admin, also load all public wishlists from other admins
                        if (user?.role === 'admin') {
                            const publicStored = localStorage.getItem('local-public-wishlists')
                            const publicWishlists: Wishlist[] = publicStored ? JSON.parse(publicStored) : []
                            
                            // Merge public wishlists (avoid duplicates)
                            const existingIds = new Set(localWishlists.map(w => w.id))
                            publicWishlists.forEach(publicWl => {
                                if (!existingIds.has(publicWl.id)) {
                                    localWishlists.push(publicWl)
                                }
                            })
                        }
                        
                        // Build set of all favorited agent IDs
                        const allAgentIds = new Set<string>()
                        localWishlists.forEach(wl => {
                            wl.agents.forEach(id => allAgentIds.add(id))
                        })

                        // Find or set default wishlist
                        let defaultId = get().defaultWishlistId
                        if (!defaultId && localWishlists.length > 0) {
                            const defaultWl = localWishlists.find(w => w.name === 'Favorites' || w.name === 'Default')
                            defaultId = defaultWl?.id || localWishlists[0]?.id || null
                        }

                        console.log('🔍 loadAllWishlists: Setting state with', localWishlists.length, 'wishlists');
                        set({
                            wishlists: localWishlists,
                            defaultWishlistId: defaultId,
                            allFavoritedAgentIds: allAgentIds,
                            isLoading: false
                        })
                        console.log('🔍 loadAllWishlists: State updated, wishlists =', localWishlists);
                        return
                    } catch (error) {
                        console.error('Error loading local wishlists:', error)
                        set({ isLoading: false, wishlists: [], allFavoritedAgentIds: new Set() })
                        return
                    }
                }

                // Normal API call - only if authenticated
                if (!isAuthenticated) {
                    set({ isLoading: false })
                    return
                }

                // Normal API call
                try {
                    const wishlists = await wishlistService.getWishlists().catch((error) => {
                        console.warn('Error fetching wishlists from API:', error);
                        throw error;
                    });

                    // Fetch full details for each wishlist to get agents
                    let fullWishlists = await Promise.all(
                        wishlists.map(wl => wishlistService.getWishlist(wl.id).catch((error) => {
                            console.warn(`Error fetching wishlist ${wl.id}:`, error);
                            return wl; // Return the basic wishlist if details fetch fails
                        }))
                    )

                    // If admin, also fetch all public wishlists from other admins
                    if (user?.role === 'admin') {
                        try {
                            // Try to fetch public wishlists (assuming API supports it)
                            // If the API doesn't support this endpoint, it will fail gracefully
                            const publicWishlistsResponse = await apiClient.get<any>('/api/wishlists/public').catch(() => null)
                            if (publicWishlistsResponse) {
                                const publicWishlists = Array.isArray(publicWishlistsResponse) 
                                    ? publicWishlistsResponse.map(normalizeWishlist)
                                    : (publicWishlistsResponse.wishlists || []).map(normalizeWishlist)
                                
                                // Fetch full details for public wishlists
                                const fullPublicWishlists = await Promise.all(
                                    publicWishlists.map(wl => wishlistService.getWishlist(wl.id).catch(() => wl))
                                )
                                
                                // Merge public wishlists (avoid duplicates)
                                const existingIds = new Set(fullWishlists.map(w => w.id))
                                fullPublicWishlists.forEach(publicWl => {
                                    if (!existingIds.has(publicWl.id)) {
                                        fullWishlists.push(publicWl)
                                    }
                                })
                            }
                        } catch (error) {
                            // API might not support public wishlists endpoint yet - that's okay
                            console.log('Public wishlists endpoint not available, continuing with user wishlists only')
                        }
                    }

                    // Build set of all favorited agent IDs
                    const allAgentIds = new Set<string>()
                    fullWishlists.forEach(wl => {
                        wl.agents.forEach(id => allAgentIds.add(id))
                    })

                    // Find or set default wishlist
                    let defaultId = get().defaultWishlistId
                    if (!defaultId) {
                        const defaultWl = fullWishlists.find(w => w.name === 'Favorites' || w.name === 'Default')
                        defaultId = defaultWl?.id || null
                    }

                    set({
                        wishlists: fullWishlists,
                        defaultWishlistId: defaultId,
                        allFavoritedAgentIds: allAgentIds,
                        isLoading: false
                    })
                } catch (error: any) {
                    // Handle errors gracefully - don't show as unhandled error
                    const errorMessage = error?.message || error?.data?.detail || 'Unknown error';
                    const statusCode = error?.status || error?.statusCode;
                    
                    if (statusCode === 401 || statusCode === 403) {
                        // Authentication/authorization error - user might not be logged in
                        console.log('Authentication required to load wishlists');
                    } else if (statusCode === 404) {
                        // No wishlists found - that's okay
                        console.log('No wishlists found');
                    } else if (statusCode === 500) {
                        console.warn('Server error loading wishlists. Continuing without wishlist data.');
                    } else {
                        console.warn('Error loading wishlists from API:', errorMessage);
                    }
                    
                    // Reset to empty state on error - don't break the app
                    set({ 
                        isLoading: false,
                        wishlists: [],
                        allFavoritedAgentIds: new Set()
                    })
                }
            },

            createWishlist: async (name: string, description?: string, isPublic: boolean = false, customSlug?: string) => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated
                console.log('🔍 createWishlist: Called with name =', name, 'isPublic =', isPublic, 'customSlug =', customSlug);
                console.log('🔍 createWishlist: isAuthenticated =', isAuthenticated);
                if (!isAuthenticated) {
                    console.log('❌ createWishlist: Not authenticated, returning null');
                    return null
                }

                set({ isCreating: true })
                
                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        console.log('🔍 createWishlist: Using local auth');
                        const currentUser = useAuthStore.getState().user
                        const wishlistId = `local-wl-${Date.now()}`
                        // Use custom slug if provided (as-is), otherwise generate from name with ID suffix (only for public)
                        const slug = isPublic 
                            ? (customSlug || generateSlug(name, wishlistId, true))
                            : undefined
                        console.log('🔍 createWishlist: Generated slug =', slug);
                        const newWishlist: Wishlist = {
                            id: wishlistId,
                            name,
                            description,
                            agents: [],
                            isPublic: isPublic,
                            slug: slug,
                            created_by: currentUser?.email || 'Unknown',
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        }
                        console.log('🔍 createWishlist: New wishlist =', newWishlist);

                        const { wishlists, defaultWishlistId } = get()
                        console.log('🔍 createWishlist: Current wishlists in state =', wishlists.length);
                        const updatedWishlists = [...wishlists, newWishlist]
                        const newDefaultId = defaultWishlistId || newWishlist.id

                        // Save to localStorage
                        console.log('🔍 createWishlist: Saving to localStorage key =', LOCAL_WISHLISTS_KEY);
                        console.log('🔍 createWishlist: Saving', updatedWishlists.length, 'wishlists');
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(updatedWishlists))
                        console.log('✅ createWishlist: Saved to localStorage');
                        
                        // Also save public wishlists separately for easy access
                        if (isPublic) {
                            console.log('🔍 createWishlist: Saving to local-public-wishlists');
                            const publicWishlists = JSON.parse(localStorage.getItem('local-public-wishlists') || '[]')
                            publicWishlists.push(newWishlist)
                            localStorage.setItem('local-public-wishlists', JSON.stringify(publicWishlists))
                            console.log('✅ createWishlist: Saved to local-public-wishlists, total =', publicWishlists.length);
                        }

                        set({
                            wishlists: updatedWishlists,
                            defaultWishlistId: newDefaultId,
                            isCreating: false
                        })
                        console.log('✅ createWishlist: State updated, returning new wishlist');

                        return newWishlist
                    } catch (error) {
                        console.error('Error creating local wishlist:', error)
                        set({ isCreating: false })
                        return null
                    }
                }

                // Normal API call
                try {
                    const slug = isPublic && customSlug ? customSlug : undefined
                    const requestData = { name, description, isPublic, slug }
                    console.log('🔍 createWishlist: Sending request data:', requestData)
                    
                    const newWishlist = await wishlistService.createWishlist(requestData)
                    console.log('✅ createWishlist: Successfully created wishlist:', newWishlist)

                    // If this is the first wishlist, make it default
                    const { wishlists, defaultWishlistId } = get()
                    const newDefaultId = defaultWishlistId || newWishlist.id

                    set({
                        wishlists: [...wishlists, newWishlist],
                        defaultWishlistId: newDefaultId,
                        isCreating: false
                    })

                    return newWishlist
                } catch (error: any) {
                    console.error('❌ Error creating wishlist:', error)
                    console.error('Error details:', {
                        status: error?.status,
                        message: error?.message,
                        data: error?.data,
                        detail: error?.data?.detail || error?.detail
                    })
                    
                    // Extract error message for user feedback
                    const errorMessage = error?.data?.detail || error?.message || error?.detail || 'Failed to create wishlist'
                    console.error('User-facing error message:', errorMessage)
                    
                    set({ isCreating: false })
                    
                    // Throw error with user-friendly message so UI can display it
                    throw new Error(errorMessage)
                }
            },

            deleteWishlist: async (id: string) => {
                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        const { wishlists, defaultWishlistId, selectedWishlistId } = get()
                        const updatedWishlists = wishlists.filter(w => w.id !== id)

                        // Rebuild all agent IDs
                        const allAgentIds = new Set<string>()
                        updatedWishlists.forEach(wl => {
                            wl.agents.forEach(agentId => allAgentIds.add(agentId))
                        })

                        // Save to localStorage
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(updatedWishlists))
                        
                        // Also remove from public wishlists if it was public
                        const publicWishlists = JSON.parse(localStorage.getItem('local-public-wishlists') || '[]')
                        const filteredPublic = publicWishlists.filter((w: Wishlist) => w.id !== id)
                        localStorage.setItem('local-public-wishlists', JSON.stringify(filteredPublic))

                        set({
                            wishlists: updatedWishlists,
                            allFavoritedAgentIds: allAgentIds,
                            defaultWishlistId: defaultWishlistId === id ? (updatedWishlists[0]?.id || null) : defaultWishlistId,
                            selectedWishlistId: selectedWishlistId === id ? null : selectedWishlistId
                        })
                    } catch (error) {
                        console.error('Error deleting local wishlist:', error)
                    }
                    return
                }

                // Normal API call
                try {
                    await wishlistService.deleteWishlist(id)

                    const { wishlists, defaultWishlistId, selectedWishlistId } = get()
                    const updatedWishlists = wishlists.filter(w => w.id !== id)

                    // Rebuild all agent IDs
                    const allAgentIds = new Set<string>()
                    updatedWishlists.forEach(wl => {
                        wl.agents.forEach(agentId => allAgentIds.add(agentId))
                    })

                    set({
                        wishlists: updatedWishlists,
                        allFavoritedAgentIds: allAgentIds,
                        defaultWishlistId: defaultWishlistId === id ? (updatedWishlists[0]?.id || null) : defaultWishlistId,
                        selectedWishlistId: selectedWishlistId === id ? null : selectedWishlistId
                    })
                } catch (error) {
                    console.error('Error deleting wishlist:', error)
                }
            },

            renameWishlist: async (id: string, name: string) => {
                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        const { wishlists } = get()
                        const updatedWishlists = wishlists.map(w => {
                            if (w.id === id) {
                                const updated = { ...w, name, updated_at: new Date().toISOString() }
                                // Regenerate slug if it's a public wishlist
                                if (w.isPublic && !updated.slug) {
                                    updated.slug = generateSlug(name, id)
                                }
                                return updated
                            }
                            return w
                        })

                        // Save to localStorage
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(updatedWishlists))
                        
                        // Update public wishlists if this is a public wishlist
                        const wishlist = wishlists.find(w => w.id === id)
                        if (wishlist?.isPublic) {
                            const publicWishlists = JSON.parse(localStorage.getItem('local-public-wishlists') || '[]')
                            const updatedPublic = publicWishlists.map((w: Wishlist) => {
                                if (w.id === id) {
                                    const updated = { ...w, name, updated_at: new Date().toISOString() }
                                    // Regenerate slug if it doesn't exist
                                    if (!updated.slug) {
                                        updated.slug = generateSlug(name, id)
                                    }
                                    return updated
                                }
                                return w
                            })
                            localStorage.setItem('local-public-wishlists', JSON.stringify(updatedPublic))
                        }

                        set({ wishlists: updatedWishlists })
                    } catch (error) {
                        console.error('Error renaming local wishlist:', error)
                    }
                    return
                }

                // Normal API call
                try {
                    await wishlistService.updateWishlist(id, { name })

                    set(state => ({
                        wishlists: state.wishlists.map(w =>
                            w.id === id ? { ...w, name } : w
                        )
                    }))
                } catch (error) {
                    console.error('Error renaming wishlist:', error)
                }
            },

            togglePublic: async (id: string, isPublic: boolean, customSlug?: string) => {
                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        const { wishlists } = get()
                        const updatedWishlists = wishlists.map(w =>
                            w.id === id ? { ...w, isPublic, updated_at: new Date().toISOString() } : w
                        )

                        // Save to localStorage
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(updatedWishlists))
                        
                        // Update public wishlists
                        const publicWishlists = JSON.parse(localStorage.getItem('local-public-wishlists') || '[]')
                        if (isPublic) {
                            // Add to public wishlists if not already there
                            const wishlist = updatedWishlists.find(w => w.id === id)
                            if (wishlist) {
                                // Generate slug if it doesn't exist
                                if (!wishlist.slug) {
                                    wishlist.slug = generateSlug(wishlist.name, wishlist.id)
                                }
                                if (!publicWishlists.find((w: Wishlist) => w.id === id)) {
                                    publicWishlists.push(wishlist)
                                    localStorage.setItem('local-public-wishlists', JSON.stringify(publicWishlists))
                                } else {
                                    // Update existing public wishlist
                                    const index = publicWishlists.findIndex((w: Wishlist) => w.id === id)
                                    if (index !== -1) {
                                        publicWishlists[index] = wishlist
                                        localStorage.setItem('local-public-wishlists', JSON.stringify(publicWishlists))
                                    }
                                }
                            }
                        } else {
                            // Remove from public wishlists
                            const filteredPublic = publicWishlists.filter((w: Wishlist) => w.id !== id)
                            localStorage.setItem('local-public-wishlists', JSON.stringify(filteredPublic))
                        }

                        set({ wishlists: updatedWishlists })
                    } catch (error) {
                        console.error('Error toggling public status:', error)
                    }
                    return
                }

                // Normal API call - Backend requires both is_public and slug for public wishlists
                try {
                    const { wishlists } = get()
                    const wishlist = wishlists.find(w => w.id === id)
                    
                    if (!wishlist) {
                        console.error('❌ Wishlist not found:', id)
                        throw new Error('Wishlist not found')
                    }
                    
                    console.log('🔄 Toggling wishlist public status:', id, 'isPublic:', isPublic)
                    console.log('📋 Current wishlist:', { name: wishlist.name, slug: wishlist.slug, isPublic: wishlist.isPublic })
                    
                    // Prepare update data
                    const updateData: { isPublic: boolean; slug?: string } = { isPublic }
                    
                    // If making public, ensure slug exists - BACKEND REQUIRES BOTH is_public=true AND slug
                    if (isPublic) {
                        let finalSlug: string | undefined
                        
                        if (customSlug && customSlug.trim()) {
                            // Use provided custom slug
                            finalSlug = customSlug.trim()
                                .toLowerCase()
                                .replace(/[^\w\s-]/g, '')
                                .replace(/[\s_-]+/g, '-')
                                .replace(/^-+|-+$/g, '')
                            console.log('📝 Using custom slug:', finalSlug)
                        } else if (wishlist.slug && wishlist.slug.trim()) {
                            // Use existing slug
                            finalSlug = wishlist.slug
                            console.log('📝 Using existing slug:', finalSlug)
                        } else if (wishlist.name && wishlist.name.trim()) {
                            // Generate slug from name
                            finalSlug = generateSlug(wishlist.name, id, true)
                            console.log('📝 Generated slug for public wishlist:', finalSlug)
                        } else {
                            console.error('⚠️ Cannot make wishlist public without name or slug')
                            console.error('Wishlist data:', wishlist)
                            throw new Error('Wishlist must have a name to be made public')
                        }
                        
                        // CRITICAL: Always include slug when making public
                        if (!finalSlug || !finalSlug.trim()) {
                            console.error('❌ Slug is empty after processing!')
                            throw new Error('Failed to generate or retrieve slug for public wishlist')
                        }
                        
                        updateData.slug = finalSlug
                        console.log('✅ Final update data for public wishlist:', updateData)
                    } else {
                        // If making private, we don't need to send slug (backend will handle it)
                        console.log('📤 Making wishlist private, not sending slug')
                    }
                    
                    console.log('📤 Updating wishlist with data:', JSON.stringify(updateData, null, 2))
                    const updatedWishlist = await wishlistService.updateWishlist(id, updateData)
                    console.log('✅ Wishlist public status updated:', updatedWishlist)
                    console.log('✅ Updated wishlist isPublic:', updatedWishlist.isPublic, 'slug:', updatedWishlist.slug)

                    // Verify the update was successful
                    if (isPublic && !updatedWishlist.isPublic) {
                        console.error('❌ Warning: Wishlist update returned isPublic=false but we requested true!')
                        console.error('Response:', updatedWishlist)
                    }
                    
                    if (isPublic && !updatedWishlist.slug) {
                        console.error('❌ Warning: Wishlist update returned no slug but we sent one!')
                        console.error('Response:', updatedWishlist)
                    }

                    set(state => ({
                        wishlists: state.wishlists.map(w =>
                            w.id === id ? { 
                                ...w, 
                                isPublic: updatedWishlist.isPublic !== undefined ? updatedWishlist.isPublic : isPublic,
                                slug: updatedWishlist.slug || w.slug || updateData.slug
                            } : w
                        )
                    }))
                    
                    // Reload wishlists to ensure we have the latest data from the backend
                    console.log('🔄 Reloading wishlists to sync with backend...')
                    await get().loadAllWishlists()
                    console.log('✅ Wishlists reloaded')
                } catch (error: any) {
                    console.error('❌ Error toggling public status:', error)
                    console.error('Error details:', {
                        status: error?.status,
                        statusCode: error?.statusCode,
                        message: error?.message,
                        data: error?.data,
                        detail: error?.detail
                    })
                    // Re-throw to allow UI to handle the error
                    throw error
                }
            },

            getPublicWishlist: async (idOrSlug: string): Promise<Wishlist | null> => {
                // Always use API for public wishlists (no localStorage)
                try {
                    // Use the public wishlist method which doesn't require auth
                    return await wishlistService.getPublicWishlist(idOrSlug)
                } catch (error) {
                    // Silently fail - wishlist might not exist or might be private
                    console.log('Error fetching public wishlist from API:', error)
                    return null
                }
            },

            addToWishlist: async (wishlistId: string, agentId: string) => {
                // Optimistic update
                set(state => {
                    const updatedWishlists = state.wishlists.map(w =>
                        w.id === wishlistId && !w.agents.includes(agentId)
                            ? { ...w, agents: [...w.agents, agentId], updated_at: new Date().toISOString() }
                            : w
                    )
                    const allAgentIds = new Set(state.allFavoritedAgentIds)
                    allAgentIds.add(agentId)
                    return { wishlists: updatedWishlists, allFavoritedAgentIds: allAgentIds }
                })

                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        const { wishlists } = get()
                        // Save to localStorage
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(wishlists))
                    } catch (error) {
                        console.error('Error saving local wishlist:', error)
                        // Revert on error
                        get().loadAllWishlists()
                    }
                    return
                }

                // Normal API call
                try {
                    await wishlistService.addAgent(wishlistId, agentId)
                } catch (error) {
                    console.error('Error adding to wishlist:', error)
                    // Revert on error
                    get().loadAllWishlists()
                }
            },

            removeFromWishlist: async (wishlistId: string, agentId: string) => {
                // Optimistic update
                set(state => {
                    const updatedWishlists = state.wishlists.map(w =>
                        w.id === wishlistId
                            ? { ...w, agents: w.agents.filter(id => id !== agentId), updated_at: new Date().toISOString() }
                            : w
                    )
                    // Rebuild all agent IDs
                    const allAgentIds = new Set<string>()
                    updatedWishlists.forEach(wl => {
                        wl.agents.forEach(id => allAgentIds.add(id))
                    })
                    return { wishlists: updatedWishlists, allFavoritedAgentIds: allAgentIds }
                })

                // Use local storage if using local auth
                if (isLocalAuth()) {
                    try {
                        const { wishlists } = get()
                        // Save to localStorage
                        localStorage.setItem(LOCAL_WISHLISTS_KEY, JSON.stringify(wishlists))
                    } catch (error) {
                        console.error('Error saving local wishlist:', error)
                        // Revert on error
                        get().loadAllWishlists()
                    }
                    return
                }

                // Normal API call
                try {
                    await wishlistService.removeAgent(wishlistId, agentId)
                } catch (error) {
                    console.error('Error removing from wishlist:', error)
                    // Revert on error
                    get().loadAllWishlists()
                }
            },

            isInWishlist: (wishlistId: string, agentId: string) => {
                const wishlist = get().wishlists.find(w => w.id === wishlistId)
                return wishlist?.agents.includes(agentId) || false
            },

            isInAnyWishlist: (agentId: string) => {
                return get().allFavoritedAgentIds.has(agentId)
            },

            getWishlistsForAgent: (agentId: string) => {
                return get().wishlists.filter(w => w.agents.includes(agentId))
            },

            toggleQuickFavorite: async (agentId: string) => {
                const { defaultWishlistId, isInAnyWishlist, createWishlist, addToWishlist, removeFromWishlist, wishlists } = get()

                // Check if in any wishlist
                if (isInAnyWishlist(agentId)) {
                    // Remove from all wishlists
                    const wishlistsWithAgent = wishlists.filter(w => w.agents.includes(agentId))
                    for (const wl of wishlistsWithAgent) {
                        await removeFromWishlist(wl.id, agentId)
                    }
                } else {
                    // Add to default wishlist
                    let targetWishlistId = defaultWishlistId

                    if (!targetWishlistId) {
                        // Create default wishlist
                        const newWl = await createWishlist('Favorites', 'My favorite agents')
                        if (newWl) {
                            targetWishlistId = newWl.id
                            set({ defaultWishlistId: newWl.id })
                        }
                    }

                    if (targetWishlistId) {
                        await addToWishlist(targetWishlistId, agentId)
                    }
                }
            },

            openPicker: (agentId: string) => {
                set({ isPickerOpen: true, pickerAgentId: agentId })
            },

            closePicker: () => {
                set({ isPickerOpen: false, pickerAgentId: null })
            },

            selectWishlist: (id: string | null) => {
                set({ selectedWishlistId: id })
            },
        }),
        {
            name: 'wishlists-store',
            partialize: (state) => ({
                defaultWishlistId: state.defaultWishlistId,
            }),
        }
    )
)

// Keep the old useFavoritesStore for backwards compatibility
// This is a thin wrapper that uses the new store
export const useFavoritesStore = () => {
    const store = useWishlistsStore()
    return {
        favorites: Array.from(store.allFavoritedAgentIds),
        toggleFavorite: store.toggleQuickFavorite,
        isFavorite: store.isInAnyWishlist,
        loadFromServer: store.loadAllWishlists,
    }
}
