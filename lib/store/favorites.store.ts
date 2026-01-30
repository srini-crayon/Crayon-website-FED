import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { wishlistService, Wishlist } from '../api/wishlist.service'
import { useAuthStore } from './auth.store'

interface FavoritesState {
    favorites: string[] // Array of agent IDs
    activeWishlistId: string | null
    isLoading: boolean
    isSynced: boolean
    addFavorite: (agentId: string) => Promise<void>
    removeFavorite: (agentId: string) => Promise<void>
    toggleFavorite: (agentId: string) => Promise<void>
    isFavorite: (agentId: string) => boolean
    clearFavorites: () => void
    loadFromServer: () => Promise<void>
    syncWithServer: () => Promise<void>
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],
            activeWishlistId: null,
            isLoading: false,
            isSynced: false,

            addFavorite: async (agentId: string) => {
                const { favorites, activeWishlistId } = get()
                if (favorites.includes(agentId)) {
                    console.log('Agent already in favorites:', agentId)
                    return
                }

                console.log('Adding favorite:', agentId)
                // Optimistic update (always works with localStorage)
                set({ favorites: [...favorites, agentId] })

                // Check if user is authenticated
                const isAuthenticated = useAuthStore.getState().isAuthenticated
                console.log('Is authenticated:', isAuthenticated)
                if (isAuthenticated) {
                    try {
                        let wishlistId = activeWishlistId
                        console.log('Current wishlist ID:', wishlistId)

                        // Get or create default wishlist if none exists
                        if (!wishlistId) {
                            const wishlist = await wishlistService.getOrCreateDefaultWishlist()
                            wishlistId = wishlist.id
                            set({ activeWishlistId: wishlistId })
                            console.log('Got/created wishlist:', wishlistId)
                        }

                        // Add agent to wishlist
                        console.log('Calling addAgent API:', wishlistId, agentId)
                        const result = await wishlistService.addAgent(wishlistId, agentId)
                        console.log('addAgent result:', result)
                    } catch (error: any) {
                        console.error('Error in addFavorite:', error)
                        // If API returns 404, just use localStorage (backend not available)
                        if (error?.status === 404 || error?.message?.includes('Not Found')) {
                            console.warn('Wishlist API not available, using localStorage only')
                            return // Keep the localStorage update, don't revert
                        }
                        console.error('Error adding agent to wishlist:', error)
                        // Revert on other errors
                        set({ favorites: favorites.filter(id => id !== agentId) })
                    }
                }
            },

            removeFavorite: async (agentId: string) => {
                const { favorites, activeWishlistId } = get()

                // Optimistic update (always works with localStorage)
                set({ favorites: favorites.filter(id => id !== agentId) })

                const isAuthenticated = useAuthStore.getState().isAuthenticated
                if (isAuthenticated && activeWishlistId) {
                    try {
                        await wishlistService.removeAgent(activeWishlistId, agentId)
                    } catch (error: any) {
                        // If API returns 404, just use localStorage
                        if (error?.status === 404 || error?.message?.includes('Not Found')) {
                            console.warn('Wishlist API not available, using localStorage only')
                            return
                        }
                        console.error('Error removing agent from wishlist:', error)
                        // Revert on other errors
                        set({ favorites: [...favorites] })
                    }
                }
            },

            toggleFavorite: async (agentId: string) => {
                const { favorites, addFavorite, removeFavorite } = get()
                if (favorites.includes(agentId)) {
                    await removeFavorite(agentId)
                } else {
                    await addFavorite(agentId)
                }
            },

            isFavorite: (agentId: string) => {
                return get().favorites.includes(agentId)
            },

            clearFavorites: () => {
                set({ favorites: [], activeWishlistId: null, isSynced: false })
            },

            loadFromServer: async () => {
                const isAuthenticated = useAuthStore.getState().isAuthenticated
                if (!isAuthenticated) return

                set({ isLoading: true })
                try {
                    const wishlist = await wishlistService.getOrCreateDefaultWishlist()
                    set({
                        favorites: wishlist.agents || [],
                        activeWishlistId: wishlist.id,
                        isSynced: true,
                        isLoading: false,
                    })
                } catch (error: any) {
                    // If API returns 404, keep using localStorage favorites
                    if (error?.status === 404 || error?.message?.includes('Not Found')) {
                        console.warn('Wishlist API not available, using localStorage only')
                    } else {
                        console.error('Error loading wishlist from server:', error)
                    }
                    set({ isLoading: false })
                }
            },

            syncWithServer: async () => {
                const { favorites, activeWishlistId } = get()
                const isAuthenticated = useAuthStore.getState().isAuthenticated

                if (!isAuthenticated) return

                set({ isLoading: true })
                try {
                    let wishlistId = activeWishlistId

                    // Create wishlist if doesn't exist
                    if (!wishlistId) {
                        const wishlist = await wishlistService.getOrCreateDefaultWishlist()
                        wishlistId = wishlist.id
                        set({ activeWishlistId: wishlistId })
                    }

                    // Sync local favorites to server
                    const serverWishlist = await wishlistService.getWishlist(wishlistId)
                    const serverAgents = serverWishlist.agents || []

                    // Add new local favorites to server
                    for (const agentId of favorites) {
                        if (!serverAgents.includes(agentId)) {
                            await wishlistService.addAgent(wishlistId, agentId)
                        }
                    }

                    set({ isSynced: true, isLoading: false })
                } catch (error) {
                    console.error('Error syncing with server:', error)
                    set({ isLoading: false })
                }
            },
        }),
        {
            name: 'agent-favorites', // localStorage key
            partialize: (state) => ({
                favorites: state.favorites,
                activeWishlistId: state.activeWishlistId,
            }),
        }
    )
)

