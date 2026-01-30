"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { Heart, Globe, Search } from "lucide-react";
import { useWishlistsStore } from "../../../../lib/store/wishlists.store";
import { AgentCard } from "../../../../components/agent-card";
import { AgentCardSkeleton } from "../../../../components/agent-card-skeleton";
import { Skeleton } from "../../../../components/ui/skeleton";

// Using skeleton loaders instead of circular loaders

// Type for agent data
interface Agent {
    id: string;
    title: string;
    description: string;
    badges: { label: string; variant: "default" }[];
    tags: string[];
    assetType: string;
    demoPreview?: string;
    valueProposition?: string;
    capabilities?: string[];
}

export default function PublicWishlistLandingPage() {
    const params = useParams();
    // Extract slug directly - useParams() in client components returns a plain object
    const slug = (params?.slug as string) || '';

    const getPublicWishlist = useWishlistsStore((state) => state.getPublicWishlist);
    // Use ref to store stable reference to prevent re-renders
    const getPublicWishlistRef = useRef(getPublicWishlist);
    useEffect(() => {
        getPublicWishlistRef.current = getPublicWishlist;
    }, [getPublicWishlist]);

    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoadingAgents, setIsLoadingAgents] = useState(true);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);
    const [wishlist, setWishlist] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [selectedCapability, setSelectedCapability] = useState<string>("All");
    const [allAgentsData, setAllAgentsData] = useState<Agent[]>([]);

    // Load wishlist by slug - memoized to prevent infinite loops
    const loadWishlist = useCallback(async () => {
        setIsLoadingWishlist(true);
        console.log('🔍 [LOAD_WISHLIST] Starting to load public wishlist with slug:', slug);
        
        // Try multiple methods to fetch the wishlist
        let publicWishlist = null;
        
        // Method 1: Try using the store method
        try {
            console.log('📡 [LOAD_WISHLIST] Method 1: Attempting to fetch via store method...');
            publicWishlist = await getPublicWishlistRef.current(slug);
            if (publicWishlist) {
                console.log('✅ [LOAD_WISHLIST] Method 1 SUCCESS: Found public wishlist via store:', publicWishlist);
                console.log('📋 [LOAD_WISHLIST] Wishlist agents:', publicWishlist.agents);
                setWishlist(publicWishlist);
                setIsLoadingWishlist(false);
                return;
            } else {
                console.log('⚠️ [LOAD_WISHLIST] Method 1: Store method returned null/undefined');
            }
        } catch (error) {
            console.error('❌ [LOAD_WISHLIST] Method 1 FAILED:', error);
        }
        
        // Method 2: Try via Next.js API proxy to public endpoint (preferred method)
        try {
            console.log('📡 [LOAD_WISHLIST] Method 2: Attempting via Next.js API proxy to public endpoint...');
            console.log('📡 [LOAD_WISHLIST] Fetching: /api/proxy/wishlists/public/' + slug);
            const response = await fetch(`/api/proxy/wishlists/public/${slug}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                // No Authorization header - public wishlist should work without auth
            });
            
            console.log('📡 [LOAD_WISHLIST] Method 2: Public endpoint response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📡 [LOAD_WISHLIST] Method 2: Public endpoint response data:', data);
                console.log('📋 [LOAD_WISHLIST] Method 2: Response agents:', data.agents);
                
                // The public endpoint returns full agent objects, extract IDs
                let agentIds: string[] = [];
                if (Array.isArray(data.agents)) {
                    agentIds = data.agents.map((agent: any) => {
                        if (typeof agent === 'string') {
                            return agent; // Already an ID
                        } else if (agent && agent.agent_id) {
                            return agent.agent_id; // Extract ID from object
                        }
                        return agent;
                    });
                }
                
                // Normalize the response
                const normalizedWishlist = {
                    id: data.id || data.wishlist_id || data._id,
                    name: data.name || data.wishlist_name || 'Unnamed',
                    description: data.description || '',
                    agents: agentIds, // Use extracted agent IDs
                    isPublic: data.is_public || data.isPublic || true, // Public endpoint only returns public wishlists
                    slug: data.slug || data.slug_name || slug,
                    created_by: data.created_by || data.createdBy || data.user_email || data.userEmail || 'Unknown',
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };
                
                console.log('✅ [LOAD_WISHLIST] Method 2 SUCCESS: Found public wishlist via public endpoint:', normalizedWishlist);
                console.log('📋 [LOAD_WISHLIST] Method 2: Normalized wishlist agents:', normalizedWishlist.agents);
                setWishlist(normalizedWishlist);
                setIsLoadingWishlist(false);
                return;
            } else {
                const errorText = await response.text();
                console.error('❌ [LOAD_WISHLIST] Method 2 FAILED: Public endpoint returned error:', response.status, errorText);
            }
        } catch (error) {
            console.error('❌ [LOAD_WISHLIST] Method 2 EXCEPTION: Direct API call to public endpoint failed:', error);
        }
        
        // Method 3: Try fallback to regular endpoint (for backward compatibility)
        try {
            console.log('📡 [LOAD_WISHLIST] Method 3: Attempting fallback to regular endpoint...');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://agents-store.onrender.com';
            const endpoint = `${apiUrl}/api/wishlists/${slug}`;
            console.log('📡 [LOAD_WISHLIST] Method 3: Fetching:', endpoint);
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            
            console.log('📡 [LOAD_WISHLIST] Method 3: Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('📡 [LOAD_WISHLIST] Method 3: Fallback endpoint response:', data);
                console.log('📋 [LOAD_WISHLIST] Method 3: Response agents:', data.agents);
                
                // Handle agents - could be IDs or objects
                let agentIds: string[] = [];
                if (Array.isArray(data.agents)) {
                    agentIds = data.agents.map((agent: any) => {
                        if (typeof agent === 'string') {
                            return agent;
                        } else if (agent && agent.agent_id) {
                            return agent.agent_id;
                        }
                        return agent;
                    });
                }
                
                const normalizedWishlist = {
                    id: data.id || data.wishlist_id || data._id,
                    name: data.name || data.wishlist_name || 'Unnamed',
                    description: data.description || '',
                    agents: agentIds,
                    isPublic: data.is_public || data.isPublic || false,
                    slug: data.slug || data.slug_name || slug,
                    created_by: data.created_by || data.createdBy || data.user_email || data.userEmail || 'Unknown',
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                };
                
                // Only use if it's public
                if (normalizedWishlist.isPublic) {
                    console.log('✅ [LOAD_WISHLIST] Method 3 SUCCESS: Found public wishlist via fallback:', normalizedWishlist);
                    console.log('📋 [LOAD_WISHLIST] Method 3: Normalized wishlist agents:', normalizedWishlist.agents);
                    setWishlist(normalizedWishlist);
                    setIsLoadingWishlist(false);
                    return;
                } else {
                    console.log('⚠️ [LOAD_WISHLIST] Method 3: Wishlist found but is not public');
                }
            } else {
                const errorText = await response.text();
                console.error('❌ [LOAD_WISHLIST] Method 3 FAILED: Response error:', response.status, errorText);
            }
        } catch (error) {
            console.error('❌ [LOAD_WISHLIST] Method 3 EXCEPTION: Fallback API call failed:', error);
        }
        
        console.error('❌ [LOAD_WISHLIST] ALL METHODS FAILED: Wishlist not found with slug:', slug);
        console.log('💡 [LOAD_WISHLIST] Possible reasons:');
        console.log('   1. Backend API not implemented yet');
        console.log('   2. Wishlist doesn\'t exist');
        console.log('   3. Wishlist is not public');
        console.log('   4. Slug is incorrect');
        console.log('   5. Network/CORS issue');
        
        // If we get here, wishlist not found - set wishlist to null explicitly
        setWishlist(null);
        setAllAgentsData([]); // Clear any agents to prevent showing "browser agents"
        setAgents([]);
        setIsLoadingWishlist(false);
    }, [slug]);

    // Load wishlist when slug changes
    useEffect(() => {
        if (slug) {
            loadWishlist();
        } else {
            setIsLoadingWishlist(false);
        }
    }, [slug, loadWishlist]);

    // Fetch agent details when wishlist is loaded
    useEffect(() => {
        if (!wishlist) {
            console.log('⏸️ [FETCH_AGENTS] Skipping - wishlist is null');
            return;
        }

        console.log('🚀 [FETCH_AGENTS] Starting to fetch agents for wishlist:', wishlist.id);
        console.log('📋 [FETCH_AGENTS] Wishlist agents array:', wishlist.agents);

        const fetchAgents = async () => {
            setIsLoadingAgents(true);
            try {
                // Extract agent IDs from wishlist
                const agentIds: string[] = [];
                
                if (Array.isArray(wishlist.agents)) {
                    console.log('📋 [FETCH_AGENTS] Wishlist.agents is an array with length:', wishlist.agents.length);
                    wishlist.agents.forEach((agent: any, index: number) => {
                        console.log(`📋 [FETCH_AGENTS] Processing agent[${index}]:`, agent, 'Type:', typeof agent);
                        if (typeof agent === 'string') {
                            // Already an ID
                            agentIds.push(agent);
                            console.log(`✅ [FETCH_AGENTS] Added string ID: ${agent}`);
                        } else if (agent && typeof agent === 'object') {
                            // Full object, extract ID
                            const id = agent.agent_id || agent.id || agent;
                            if (id && typeof id === 'string') {
                                agentIds.push(id);
                                console.log(`✅ [FETCH_AGENTS] Added object ID: ${id}`);
                            } else {
                                console.warn(`⚠️ [FETCH_AGENTS] Could not extract ID from agent object:`, agent);
                            }
                        } else {
                            console.warn(`⚠️ [FETCH_AGENTS] Unexpected agent type:`, typeof agent, agent);
                        }
                    });
                } else {
                    console.warn('⚠️ [FETCH_AGENTS] wishlist.agents is not an array:', wishlist.agents);
                }
                
                console.log('🔍 [FETCH_AGENTS] Extracted agent IDs:', agentIds);
                
                // If agents array is empty, nothing to fetch
                if (agentIds.length === 0) {
                    console.log('📭 [FETCH_AGENTS] No agents in wishlist - setting empty arrays');
                    setAllAgentsData([]);
                    setAgents([]);
                    setIsLoadingAgents(false);
                    return;
                }

                // Check if first item is already a full object (from public endpoint response)
                const firstAgent = wishlist.agents?.[0];
                const hasFullObjects = typeof firstAgent === 'object' && firstAgent !== null && firstAgent.agent_id;
                console.log('🔍 [FETCH_AGENTS] Has full objects?', hasFullObjects, 'First agent:', firstAgent);

                let allAgents: Agent[] = [];

                if (hasFullObjects) {
                    // Agents are already full objects from public endpoint
                    console.log('✅ [FETCH_AGENTS] Using full agent objects from wishlist response');
                    allAgents = (wishlist.agents as any[]).map((a: any) => ({
                        id: a.agent_id || a.id,
                        title: a.agent_name || a.name || "Unknown Agent",
                        description: a.description || "",
                        badges: [{ label: a.by_capability || a.capability || "Agent", variant: "default" as const }],
                        tags: a.tags ? (typeof a.tags === 'string' ? a.tags.split(",").map((t: string) => t.trim()) : a.tags) : [],
                        assetType: a.asset_type || "Agent",
                        demoPreview: a.demo_preview || a.demoPreview,
                        valueProposition: a.by_value || a.valueProposition || "",
                        capabilities: a.by_capability ? (typeof a.by_capability === 'string' ? a.by_capability.split(",").map((c: string) => c.trim()).filter(Boolean) : a.by_capability) : [],
                    })).filter((a) => a.id); // Filter out any invalid entries
                } else {
                    // Agents are just IDs, fetch individual agent details
                    console.log('📡 [FETCH_AGENTS] Fetching individual agent details for IDs:', agentIds);
                    
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://agents-store.onrender.com';
                    console.log('📡 [FETCH_AGENTS] Using API URL:', apiUrl);
                    
                    // Fetch each agent individually by ID
                    const agentPromises = agentIds.map(async (agentId: string, index: number) => {
                        try {
                            const endpoint = `${apiUrl}/api/agents/${agentId}`;
                            console.log(`📡 [FETCH_AGENTS] [${index + 1}/${agentIds.length}] Fetching agent: ${agentId} from ${endpoint}`);
                            const res = await fetch(endpoint, {
                                cache: "no-store"
                            });
                            
                            console.log(`📡 [FETCH_AGENTS] [${index + 1}/${agentIds.length}] Response status for ${agentId}:`, res.status);
                            
                            if (!res.ok) {
                                console.warn(`⚠️ [FETCH_AGENTS] Failed to fetch agent ${agentId}: ${res.status}`);
                                return null;
                            }
                            
                            const data = await res.json();
                            const agentData = data.agent || data;
                            
                            if (!agentData || !agentData.agent_id) {
                                console.warn(`⚠️ [FETCH_AGENTS] Invalid agent data for ${agentId}:`, agentData);
                                return null;
                            }
                            
                            console.log(`✅ [FETCH_AGENTS] Successfully fetched agent ${agentId}:`, agentData.agent_name);
                            
                            // Check if agent is approved (optional, based on your requirements)
                            // For public wishlists, we might want to show all agents regardless of approval
                            
                            return {
                                id: agentData.agent_id,
                                title: agentData.agent_name || "Unknown Agent",
                                description: agentData.description || "",
                                badges: [{ label: agentData.by_capability || "Agent", variant: "default" as const }],
                                tags: agentData.tags ? agentData.tags.split(",").map((t: string) => t.trim()) : [],
                                assetType: agentData.asset_type || "Agent",
                                demoPreview: agentData.demo_preview,
                                valueProposition: agentData.by_value || "",
                                capabilities: agentData.by_capability ? agentData.by_capability.split(",").map((c: string) => c.trim()).filter(Boolean) : [],
                            } as Agent;
                        } catch (error) {
                            console.error(`❌ [FETCH_AGENTS] Error fetching agent ${agentId}:`, error);
                            return null;
                        }
                    });
                    
                    // Wait for all agent fetches to complete
                    console.log('⏳ [FETCH_AGENTS] Waiting for all agent fetches to complete...');
                    const fetchedAgents = await Promise.all(agentPromises);
                    
                    // Filter out null values (failed fetches)
                    allAgents = fetchedAgents.filter((agent): agent is Agent => agent !== null);
                    
                    console.log(`✅ [FETCH_AGENTS] Successfully fetched ${allAgents.length} out of ${agentIds.length} agents`);
                }

                console.log(`✅ [FETCH_AGENTS] Final result: Loaded ${allAgents.length} agents for wishlist`);
                console.log(`📋 [FETCH_AGENTS] Agent IDs:`, allAgents.map(a => a.id));
                setAllAgentsData(allAgents);
                setAgents(allAgents);
            } catch (error) {
                console.error("❌ [FETCH_AGENTS] Error fetching agents:", error);
                setAllAgentsData([]);
                setAgents([]);
            } finally {
                setIsLoadingAgents(false);
                console.log('🏁 [FETCH_AGENTS] Finished fetching agents');
            }
        };

        fetchAgents();
    }, [wishlist]);

    // Get all unique capabilities from agents
    const allCapabilities = Array.from(new Set(allAgentsData.map(a => a.valueProposition).filter(Boolean))).sort();

    // Calculate counts for each capability
    const capabilityCounts = allCapabilities.reduce((acc, cap) => {
        acc[cap] = allAgentsData.filter(a => a.valueProposition === cap).length;
        return acc;
    }, {} as Record<string, number>);

    // Filter agents based on search and selected capability
    const filteredAgents = useMemo(() => {
        return allAgentsData.filter((agent) => {
            // Search filter
            if (search) {
                const q = search.toLowerCase();
                const matchesSearch = 
                    agent.title.toLowerCase().includes(q) ||
                    agent.description.toLowerCase().includes(q) ||
                    agent.tags.some(tag => tag.toLowerCase().includes(q));
                if (!matchesSearch) return false;
            }

            // Capability filter
            if (selectedCapability !== "All") {
                return agent.valueProposition === selectedCapability;
            }

            return true;
        });
    }, [allAgentsData, search, selectedCapability]);

    // Show loading state
    if (isLoadingWishlist) {
        return (
            <div className="w-full min-h-screen bg-white">
                {/* Header Section Skeleton */}
                <section className="relative py-6">
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            width: '100%',
                            height: '180px',
                            background: 'radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)',
                            zIndex: -1,
                        }}
                    />
                    <div className="w-full px-8 md:px-12 lg:px-16 mx-auto" style={{ maxWidth: "1407px" }}>
                        <div className="flex flex-col items-center justify-center w-full mb-8" style={{ textAlign: "center" }}>
                            <Skeleton 
                                style={{
                                    width: "300px",
                                    height: "54px",
                                    marginBottom: "8px",
                                }}
                            />
                            <Skeleton 
                                style={{
                                    width: "200px",
                                    height: "20px",
                                    marginTop: "8px",
                                }}
                            />
                        </div>
                    </div>
                </section>

                {/* Search and Filter Section Skeleton */}
                <section className="relative py-4" style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                        <div className="w-full mb-6" style={{ borderBottom: "1px solid #E5E7EB" }}>
                            <div className="flex items-center justify-between" style={{ gap: "16px" }}>
                                <div className="flex" style={{ gap: "16px" }}>
                                    <Skeleton style={{ width: "60px", height: "40px" }} />
                                    <Skeleton style={{ width: "100px", height: "40px" }} />
                                    <Skeleton style={{ width: "120px", height: "40px" }} />
                                </div>
                                <Skeleton style={{ width: "300px", height: "40px", borderRadius: "8px" }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Agents Grid Skeleton */}
                <section className="relative pt-1 pb-12">
                    <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                        <div 
                            style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {[...Array(6)].map((_, index) => (
                                <AgentCardSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    // Check if wishlist exists
    if (!wishlist) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins, sans-serif",
                    padding: "40px 20px",
                }}
            >
                <Heart size={48} color="#d1d5db" />
                <p style={{ marginTop: "16px", fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                    Wishlist not found
                </p>
                <p style={{ marginTop: "8px", color: "#6b7280", textAlign: "center" }}>
                    This wishlist doesn't exist or is not publicly available.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Header Section with Gradient */}
            <section className="relative py-6">
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        width: '100%',
                        height: '180px',
                        background: 'radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)',
                        zIndex: -1,
                    }}
                />
                <div className="w-full px-8 md:px-12 lg:px-16 mx-auto" style={{ maxWidth: "1407px" }}>
                    {/* Centered Title and Subtitle */}
                    <div className="flex flex-col items-center justify-center w-full mb-8" style={{ textAlign: "center" }}>
                        <h1
                            className="mb-2"
                            style={{
                                color: 'var(--Interface-Color-Primary-900, #091917)',
                                fontFamily: 'Poppins, sans-serif',
                                fontSize: '52px',
                                fontStyle: 'normal',
                                fontWeight: 500,
                                lineHeight: '54px',
                            }}
                        >
                            {wishlist?.name || "Loading..."}
                        </h1>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                            <p
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    color: "#6b7280",
                                }}
                            >
                                by {(() => {
                                    const creator = wishlist?.created_by || "Unknown";
                                    // Extract username from email (part before @)
                                    const username = creator.includes('@') ? creator.split('@')[0] : creator;
                                    return username;
                                })()} | {wishlist?.agents.length || 0} agent{wishlist?.agents.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="relative py-4" style={{ backgroundColor: "#FFFFFF" }}>
                <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                    {/* Capability Tabs with Search */}
                    <div className="w-full mb-6" style={{ borderBottom: "1px solid #E5E7EB" }}>
                        <div className="flex items-center justify-between" style={{ gap: "16px" }}>
                            <div className="relative flex-1" style={{ overflowX: "auto", overflowY: "hidden" }}>
                                <div className="flex" style={{ minWidth: "fit-content" }}>
                                    {/* All option */}
                                    <button
                                        onClick={() => setSelectedCapability("All")}
                                        className="relative pb-2 px-4"
                                        style={{
                                            fontFamily: "Poppins",
                                            fontSize: "14px",
                                            fontWeight: selectedCapability === "All" ? 600 : 500,
                                            color: selectedCapability === "All" ? "#000" : "#344054",
                                            paddingBottom: "12px",
                                            whiteSpace: "nowrap",
                                            cursor: "pointer",
                                            display: "inline-block",
                                            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            borderBottom: selectedCapability === "All" ? "2px solid #000" : "2px solid transparent",
                                        }}
                                    >
                                        All ({allAgentsData.length})
                                    </button>

                                    {/* Capability tabs */}
                                    {allCapabilities.map((capability) => {
                                        const count = capabilityCounts[capability] || 0;
                                        const isSelected = selectedCapability === capability;

                                        return (
                                            <button
                                                key={capability}
                                                onClick={() => setSelectedCapability(capability)}
                                                className="relative pb-2 px-4"
                                                style={{
                                                    fontFamily: "Poppins",
                                                    fontSize: "14px",
                                                    fontWeight: isSelected ? 600 : 500,
                                                    color: isSelected ? "#000" : "#344054",
                                                    paddingBottom: "12px",
                                                    whiteSpace: "nowrap",
                                                    cursor: "pointer",
                                                    display: "inline-block",
                                                    transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    borderBottom: isSelected ? "2px solid #000" : "2px solid transparent",
                                                }}
                                            >
                                                {capability} ({count})
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Search Bar - Right aligned */}
                            <div className="relative" style={{ minWidth: "300px", maxWidth: "400px" }}>
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                                    style={{
                                        zIndex: 1,
                                        color: "#9CA3AF",
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Search agents..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "8px 12px 8px 36px",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                        border: "none",
                                        borderBottom: "1px solid #E5E7EB",
                                        borderRadius: "0",
                                        outline: "none",
                                        backgroundColor: "transparent",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Agents Grid Section */}
            <section className="relative pt-1 pb-12">
                <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                    {isLoadingAgents ? (
                        <div 
                            style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {[...Array(6)].map((_, index) => (
                                <AgentCardSkeleton key={index} />
                            ))}
                        </div>
                    ) : agents.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 20px",
                                backgroundColor: "#fff",
                                borderRadius: "16px",
                                border: "2px dashed #e5e7eb",
                            }}
                        >
                            <Heart size={48} color="#d1d5db" />
                            <p
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "16px",
                                    color: "#6b7280",
                                    marginTop: "16px",
                                }}
                            >
                                No agents in this wishlist yet
                            </p>
                        </div>
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-12">
                            <div style={{ fontFamily: "Poppins, sans-serif", color: "#6b7280", fontSize: "16px" }}>
                                No agents found matching your search criteria.
                            </div>
                        </div>
                    ) : (
                        <div
                            className="grid gap-4 md:gap-6 lg:gap-10"
                            style={{
                                gridTemplateColumns: "repeat(3, 1fr)",
                            }}
                        >
                            {filteredAgents.map((agent) => (
                                <div key={agent.id}>
                                    <AgentCard 
                                        {...agent} 
                                        hideWishlistIcon={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
