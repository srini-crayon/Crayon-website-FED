import { endpoints } from './config'
import { apiClient } from './client'

// Types
export interface Wishlist {
    id: string
    name: string
    description?: string
    agents: string[] // Array of agent IDs
    isPublic?: boolean // Public wishlists are accessible to all admins and via URL
    slug?: string // Custom slug for public wishlist URLs
    created_by?: string // Email of the user who created the wishlist
    created_at?: string
    updated_at?: string
}

// Helper function to generate a slug from a name
export function generateSlug(name: string, id: string, includeIdSuffix: boolean = true): string {
    // Convert to lowercase, replace spaces and special chars with hyphens
    const baseSlug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    
    // If slug is empty, use a portion of the ID
    if (!baseSlug) {
        return id.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 20)
    }
    
    // Append ID suffix only if requested (for auto-generated slugs to ensure uniqueness)
    if (includeIdSuffix) {
        return `${baseSlug}-${id.substring(id.length - 8)}`
    }
    
    return baseSlug
}

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

export interface CreateWishlistRequest {
    name: string
    description?: string
    isPublic?: boolean
    slug?: string
}

export interface UpdateWishlistRequest {
    name?: string
    description?: string
    isPublic?: boolean
    slug?: string
}

export interface AddAgentRequest {
    agent_id: string
}

class WishlistService {
    /**
     * Get all wishlists for current user
     */
    async getWishlists(): Promise<Wishlist[]> {
        const response = await apiClient.get<any>(endpoints.wishlists.list)
        console.log('Raw wishlists response:', response)
        // Handle different response formats
        const rawList = Array.isArray(response) ? response : (response.wishlists || response.data || [])
        return rawList.map(normalizeWishlist)
    }

    /**
     * Create a new wishlist
     */
    async createWishlist(data: CreateWishlistRequest): Promise<Wishlist> {
        console.log('📤 Creating wishlist with data:', data)
        try {
            const response = await apiClient.post<any>(endpoints.wishlists.create, data)
            console.log('✅ Raw create wishlist response:', response)
            
            // Check if response has error
            if (response?.detail && typeof response.detail === 'string' && response.detail.includes('Failed')) {
                throw {
                    status: 400,
                    message: response.detail,
                    data: response
                }
            }
            
            return normalizeWishlist(response)
        } catch (error: any) {
            console.error('❌ Error in createWishlist service:', error)
            // Re-throw with more context
            throw {
                ...error,
                message: error?.data?.detail || error?.message || error?.detail || 'Failed to create wishlist'
            }
        }
    }

    /**
     * Get a specific wishlist by ID
     */
    async getWishlist(id: string, requiresAuth: boolean = true): Promise<Wishlist> {
        try {
            console.log(`📡 Fetching wishlist: ${id}, requiresAuth: ${requiresAuth}`);
            const response = await apiClient.get<any>(endpoints.wishlists.get(id), { requiresAuth })
            console.log('✅ Raw getWishlist response:', response)
            // Handle nested wishlist object in response
            const rawWishlist = response.wishlist || response
            const normalized = normalizeWishlist(rawWishlist)
            console.log('✅ Normalized wishlist:', normalized)
            return normalized
        } catch (error: any) {
            console.error('❌ Error fetching wishlist:', error)
            console.error('Error details:', {
                status: error?.status,
                message: error?.message,
                data: error?.data
            })
            throw error
        }
    }

    /**
     * Get a public wishlist by slug (no auth required)
     * Uses the dedicated public endpoint that returns full agent details
     */
    async getPublicWishlist(slug: string): Promise<Wishlist | null> {
        try {
            console.log(`🔍 Fetching public wishlist with slug: ${slug}`);
            
            // First try the dedicated public endpoint (returns full agent objects)
            try {
                console.log('📡 Trying public endpoint: /api/wishlists/public/{slug}');
                // Use proxy route: /api/proxy/wishlists/public/{slug}
                const proxyEndpoint = `/api/proxy/wishlists/public/${slug}`;
                const response = await apiClient.get<any>(proxyEndpoint, { requiresAuth: false });
                console.log('✅ Public endpoint response:', response);
                
                // The public endpoint returns full agent objects, not just IDs
                const normalized = normalizeWishlist(response);
                
                // Handle agents - could be array of IDs or array of full objects
                if (Array.isArray(response.agents)) {
                    // If agents are full objects, extract IDs
                    normalized.agents = response.agents.map((agent: any) => {
                        if (typeof agent === 'string') {
                            return agent; // Already an ID
                        } else if (agent && agent.agent_id) {
                            return agent.agent_id; // Extract ID from object
                        }
                        return agent;
                    });
                }
                
                console.log('✅ Normalized public wishlist:', normalized);
                return normalized;
            } catch (publicError: any) {
                console.log('⚠️ Public endpoint failed, trying fallback:', publicError);
                
                // Fallback: Try regular endpoint (for backward compatibility)
                const wishlist = await this.getWishlist(slug, false); // No auth required
                console.log(`📦 Received wishlist from fallback:`, wishlist);
                
                // Only return if it's public
                if (wishlist && wishlist.isPublic) {
                    console.log('✅ Wishlist is public, returning:', wishlist);
                    return wishlist;
                } else {
                    console.log('⚠️ Wishlist found but is not public. isPublic:', wishlist?.isPublic);
                }
            }
            
            return null;
        } catch (error: any) {
            // Log error details for debugging
            console.error('❌ Error fetching public wishlist:', error);
            console.error('Error details:', {
                status: error?.status,
                statusCode: error?.statusCode,
                message: error?.message,
                data: error?.data,
                detail: error?.detail
            });
            
            // If it's a 404, the wishlist doesn't exist
            if (error?.status === 404 || error?.statusCode === 404) {
                console.log('⚠️ Wishlist not found (404)');
            } else if (error?.status === 403 || error?.statusCode === 403) {
                console.log('⚠️ Access denied (403) - wishlist might be private');
            } else if (error?.status === 401 || error?.statusCode === 401) {
                console.log('⚠️ Unauthorized (401) - but this should work without auth for public wishlists');
            }
            
            return null;
        }
    }

    /**
     * Update a wishlist
     */
    async updateWishlist(id: string, data: UpdateWishlistRequest): Promise<Wishlist> {
        // Convert camelCase to snake_case for backend compatibility
        const backendData: any = {}
        if (data.name !== undefined) backendData.name = data.name
        if (data.description !== undefined) backendData.description = data.description
        // Ensure is_public is sent as boolean true/false (not string)
        // Some backends might expect string "true"/"false" or "TRUE"/"FALSE", but boolean is standard
        if (data.isPublic !== undefined) {
            backendData.is_public = data.isPublic === true // Explicitly convert to boolean
        }
        if (data.slug !== undefined) backendData.slug = data.slug
        
        console.log('📤 Updating wishlist:', id, 'with data:', backendData)
        console.log('📤 is_public type:', typeof backendData.is_public, 'value:', backendData.is_public)
        const response = await apiClient.put<any>(endpoints.wishlists.update(id), backendData)
        console.log('✅ Update wishlist response:', response)
        
        // Verify the response has the correct is_public value
        if (data.isPublic !== undefined) {
            const normalized = normalizeWishlist(response)
            console.log('✅ Normalized response isPublic:', normalized.isPublic, 'expected:', data.isPublic)
            if (normalized.isPublic !== data.isPublic) {
                console.warn('⚠️ Warning: Response isPublic does not match request. Response:', normalized.isPublic, 'Request:', data.isPublic)
            }
        }
        
        return normalizeWishlist(response)
    }

    /**
     * Delete a wishlist
     */
    async deleteWishlist(id: string): Promise<void> {
        await apiClient.delete(endpoints.wishlists.delete(id))
    }

    /**
     * Add an agent to a wishlist
     */
    async addAgent(wishlistId: string, agentId: string): Promise<Wishlist> {
        return apiClient.post<Wishlist>(endpoints.wishlists.addAgent(wishlistId), { agent_id: agentId })
    }

    /**
     * Remove an agent from a wishlist
     */
    async removeAgent(wishlistId: string, agentId: string): Promise<Wishlist> {
        return apiClient.delete<Wishlist>(endpoints.wishlists.removeAgent(wishlistId, agentId))
    }

    /**
     * Get or create default wishlist for favorites
     * This is a convenience method that ensures a default wishlist exists
     */
    async getOrCreateDefaultWishlist(): Promise<Wishlist> {
        try {
            const wishlists = await this.getWishlists()
            console.log('Fetched wishlists:', wishlists)

            // Find existing default wishlist
            const defaultWishlist = wishlists.find(w => w.name === 'Favorites' || w.name === 'Default')
            if (defaultWishlist && defaultWishlist.id) {
                console.log('Found default wishlist, fetching full details...')
                // Fetch full wishlist details including agents array (already normalized by getWishlist)
                const fullWishlist = await this.getWishlist(defaultWishlist.id)
                console.log('Full wishlist with agents:', fullWishlist)
                return fullWishlist
            }

            // Create new default wishlist
            console.log('Creating new default wishlist...')
            const newWishlist = await this.createWishlist({
                name: 'Favorites',
                description: 'My favorite agents'
            })
            console.log('Created wishlist:', newWishlist)

            // Validate the response has an ID
            if (!newWishlist || !newWishlist.id) {
                throw new Error('Created wishlist is missing ID')
            }

            return newWishlist
        } catch (error) {
            console.error('Error getting/creating default wishlist:', error)
            throw error
        }
    }
}

export const wishlistService = new WishlistService()
