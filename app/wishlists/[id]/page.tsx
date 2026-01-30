"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2, Edit2, Loader2, X, Lock, Globe, Search, User, MoreVertical, Copy, Check } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { useWishlistsStore } from "../../../lib/store/wishlists.store";
import { useAuthStore } from "../../../lib/store/auth.store";
import { AgentCard } from "../../../components/agent-card";
import { generateSlug } from "../../../lib/api/wishlist.service";
import { getPublicWishlistUrl, getWishlistUrl } from "../../../lib/utils/public-url";

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

export default function WishlistDetailPage() {
    const router = useRouter();
    const params = useParams();
    // Extract id directly - useParams() in client components returns a plain object
    const wishlistId = (params?.id as string) || '';

    const { isAuthenticated, user } = useAuthStore();
    const {
        wishlists,
        loadAllWishlists,
        removeFromWishlist,
        renameWishlist,
        deleteWishlist,
        getPublicWishlist,
        togglePublic,
    } = useWishlistsStore();

    const [agents, setAgents] = useState<Agent[]>([]);
    const [isLoadingAgents, setIsLoadingAgents] = useState(true);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);
    const [showEditInput, setShowEditInput] = useState(false);
    const [editingName, setEditingName] = useState("");
    const [editingIsPublic, setEditingIsPublic] = useState(false);
    const [editingSlug, setEditingSlug] = useState("");
    const [removingAgentId, setRemovingAgentId] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<any>(null);
    const [isPublicWishlist, setIsPublicWishlist] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCapability, setSelectedCapability] = useState<string>("All");
    const [allAgentsData, setAllAgentsData] = useState<Agent[]>([]);
    const [copied, setCopied] = useState(false);

    // Load wishlist - check if public first
    useEffect(() => {
        const loadWishlist = async () => {
            setIsLoadingWishlist(true);
            
            // ALWAYS check localStorage for public wishlists first (even if not authenticated)
            // Support both ID and slug lookups
            if (typeof window !== 'undefined') {
                try {
                    const publicStored = localStorage.getItem('local-public-wishlists')
                    const publicWishlists: any[] = publicStored ? JSON.parse(publicStored) : []
                    // Try to find by ID first, then by slug
                    const publicWishlist = publicWishlists.find(w => w.id === wishlistId || w.slug === wishlistId)
                    
                    if (publicWishlist && publicWishlist.isPublic) {
                        // If public wishlist and not authenticated, redirect to public landing page
                        if (!isAuthenticated) {
                            const publicSlug = publicWishlist.slug || wishlistId;
                            router.replace(`/wishlists/public/${publicSlug}`);
                            return;
                        }
                        setWishlist(publicWishlist)
                        setIsPublicWishlist(true)
                        setIsLoadingWishlist(false)
                        return
                    }
                } catch (error) {
                    console.error('Error loading public wishlist from localStorage:', error)
                }
            }
            
            // If authenticated, load all wishlists and find the one (for private wishlists or public from API)
            if (isAuthenticated) {
                if (wishlists.length === 0) {
                    await loadAllWishlists();
                }
                // Re-check wishlists after loading
                // Support both ID and slug lookups
                const currentWishlists = useWishlistsStore.getState().wishlists
                const foundWishlist = currentWishlists.find((w) => w.id === wishlistId || w.slug === wishlistId);
                if (foundWishlist) {
                    setWishlist(foundWishlist);
                    setIsPublicWishlist(foundWishlist.isPublic || false);
                    setIsLoadingWishlist(false);
                    return;
                }
                
                // If authenticated and not found in local wishlists, try API for public wishlist
                // Only if not using local auth
                const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('auth-token')) : null
                const isLocal = token?.startsWith('local-token')
                
                if (!isLocal) {
                    try {
                        const publicWishlist = await getPublicWishlist(wishlistId);
                        if (publicWishlist && publicWishlist.isPublic) {
                            setWishlist(publicWishlist);
                            setIsPublicWishlist(true);
                            setIsLoadingWishlist(false);
                            return;
                        }
                    } catch (error) {
                        // Silently fail - wishlist might not exist or might be private
                    }
                }
            }
            
            // If we get here, wishlist not found
            setIsLoadingWishlist(false);
        };

        loadWishlist();
    }, [wishlistId, isAuthenticated, loadAllWishlists, getPublicWishlist, router]);

    // Fetch agent details when wishlist is loaded
    useEffect(() => {
        if (!wishlist) return;

        const fetchAgents = async () => {
            setIsLoadingAgents(true);
            try {
                // Extract agent IDs from wishlist
                const agentIds: string[] = [];
                
                if (Array.isArray(wishlist.agents)) {
                    wishlist.agents.forEach((agent: any) => {
                        if (typeof agent === 'string') {
                            // Already an ID
                            agentIds.push(agent);
                        } else if (agent && typeof agent === 'object') {
                            // Full object, extract ID
                            const id = agent.agent_id || agent.id || agent;
                            if (id && typeof id === 'string') {
                                agentIds.push(id);
                            }
                        }
                    });
                }
                
                console.log('🔍 Wishlist agent IDs:', agentIds);
                
                // If agents array is empty, nothing to fetch
                if (agentIds.length === 0) {
                    console.log('📭 No agents in wishlist');
                    setAllAgentsData([]);
                    setAgents([]);
                    setIsLoadingAgents(false);
                    return;
                }

                // Fetch each agent individually by ID
                console.log('📡 Fetching individual agent details for IDs:', agentIds);
                
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://agents-store.onrender.com';
                
                // Fetch each agent individually by ID
                const agentPromises = agentIds.map(async (agentId: string) => {
                    try {
                        console.log(`📡 Fetching agent: ${agentId}`);
                        const res = await fetch(`${apiUrl}/api/agents/${agentId}`, {
                            cache: "no-store"
                        });
                        
                        if (!res.ok) {
                            console.warn(`⚠️ Failed to fetch agent ${agentId}: ${res.status}`);
                            return null;
                        }
                        
                        const data = await res.json();
                        const agentData = data.agent || data;
                        
                        if (!agentData || !agentData.agent_id) {
                            console.warn(`⚠️ Invalid agent data for ${agentId}`);
                            return null;
                        }
                        
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
                        console.error(`❌ Error fetching agent ${agentId}:`, error);
                        return null;
                    }
                });
                
                // Wait for all agent fetches to complete
                const fetchedAgents = await Promise.all(agentPromises);
                
                // Filter out null values (failed fetches)
                const wishlistAgents = fetchedAgents.filter((agent): agent is Agent => agent !== null);
                
                console.log(`✅ Successfully fetched ${wishlistAgents.length} out of ${agentIds.length} agents:`, wishlistAgents.map(a => a.id));
                
                setAllAgentsData(wishlistAgents);
                // Keep agents state for backward compatibility, but filteredAgents is the source of truth for display
                setAgents(wishlistAgents);
            } catch (error) {
                console.error("❌ Error fetching agents:", error);
                setAllAgentsData([]);
                setAgents([]);
            } finally {
                setIsLoadingAgents(false);
            }
        };

        fetchAgents();
    }, [wishlist]);

    // Get all unique capabilities from agents (based on all agents, not filtered)
    const allCapabilities = Array.from(new Set(allAgentsData.map(a => a.valueProposition).filter(Boolean))).sort();

    // Calculate counts for each capability (based on all agents)
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

    const handleRemoveAgent = async (agentId: string) => {
        setRemovingAgentId(agentId);
        await removeFromWishlist(wishlistId, agentId);
        setAllAgentsData((prev) => prev.filter((a) => a.id !== agentId));
        setAgents((prev) => prev.filter((a) => a.id !== agentId));
        setRemovingAgentId(null);
    };

    const handleRename = async () => {
        if (!editingName.trim()) return;
        
        // Update name
        await renameWishlist(wishlistId, editingName.trim());
        
        // Prepare slug if making public - backend requires both is_public=true AND slug
        let slugToUse: string | undefined = undefined;
        if (editingIsPublic) {
            let slug = editingSlug.trim();
            if (slug) {
                // Clean slug: lowercase, replace spaces/special chars with hyphens, remove invalid chars
                slug = slug
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                slugToUse = slug;
            } else if (wishlist?.slug) {
                // Use existing slug if no new slug provided
                slugToUse = wishlist.slug;
            }
            // If no slug provided and no existing slug, togglePublic will generate one
        }
        
        // Update public/private status if changed - pass slug if making public
        if (wishlist?.isPublic !== editingIsPublic) {
            await togglePublic(wishlistId, editingIsPublic, slugToUse);
            setIsPublicWishlist(editingIsPublic);
        }
        
        // If wishlist is already public and we have a new slug, update it separately
        // (togglePublic handles slug when toggling, but if already public we need to update slug separately)
        if (editingIsPublic && slugToUse && wishlist?.isPublic === editingIsPublic && slugToUse !== wishlist.slug) {
            // Wishlist is already public, just update the slug via the store's rename/update mechanism
            // The slug will be updated when we reload wishlists below
            console.log('📝 Updating slug for already-public wishlist:', slugToUse);
        }
        
        // Update slug in localStorage for local auth (for backward compatibility)
        if (editingIsPublic) {
            let slug = slugToUse || editingSlug.trim();
            if (slug) {
                // Clean slug: lowercase, replace spaces/special chars with hyphens, remove invalid chars
                slug = slug
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            
            // Update slug in localStorage for local auth
            if (typeof window !== 'undefined') {
                try {
                    const stored = localStorage.getItem('local-wishlists');
                    const localWishlists: any[] = stored ? JSON.parse(stored) : [];
                    const updated = localWishlists.map((w: any) => {
                        if (w.id === wishlistId) {
                            const updatedWl = { ...w, name: editingName.trim() };
                            if (slug) {
                                updatedWl.slug = slug;
                            } else if (editingIsPublic && !updatedWl.slug) {
                                // Auto-generate slug if not provided
                                updatedWl.slug = generateSlug(editingName.trim(), wishlistId, true);
                            }
                            return updatedWl;
                        }
                        return w;
                    });
                    localStorage.setItem('local-wishlists', JSON.stringify(updated));
                    
                    // Also update in public wishlists
                    const publicStored = localStorage.getItem('local-public-wishlists');
                    const publicWishlists: any[] = publicStored ? JSON.parse(publicStored) : [];
                    const updatedPublic = publicWishlists.map((w: any) => {
                        if (w.id === wishlistId) {
                            const updatedWl = { ...w, name: editingName.trim(), isPublic: editingIsPublic };
                            if (slug) {
                                updatedWl.slug = slug;
                            } else if (editingIsPublic && !updatedWl.slug) {
                                updatedWl.slug = generateSlug(editingName.trim(), wishlistId, true);
                            }
                            return updatedWl;
                        }
                        return w;
                    });
                    
                    // Add to public wishlists if making public, remove if making private
                    if (editingIsPublic) {
                        const exists = updatedPublic.find((w: any) => w.id === wishlistId);
                        if (!exists) {
                            const wishlistToAdd = updated.find((w: any) => w.id === wishlistId);
                            if (wishlistToAdd) {
                                updatedPublic.push(wishlistToAdd);
                            }
                        }
                        localStorage.setItem('local-public-wishlists', JSON.stringify(updatedPublic));
                    } else {
                        const filtered = updatedPublic.filter((w: any) => w.id !== wishlistId);
                        localStorage.setItem('local-public-wishlists', JSON.stringify(filtered));
                    }
                    
                    // Reload wishlists to reflect changes
                    await loadAllWishlists();
                } catch (error) {
                    console.error('Error updating wishlist:', error);
                }
            }
        }
        
        setShowEditInput(false);
        setEditingName("");
        setEditingIsPublic(false);
        setEditingSlug("");
        
        // Reload wishlist to get updated data
        await loadAllWishlists();
        const { wishlists: currentWishlists } = useWishlistsStore.getState();
        const foundWishlist = currentWishlists.find((w) => w.id === wishlistId || w.slug === wishlistId);
        if (foundWishlist) {
            setWishlist(foundWishlist);
            setIsPublicWishlist(foundWishlist.isPublic || false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this wishlist?")) {
            try {
                await deleteWishlist(wishlistId);
                // Also remove from local storage if it's a public wishlist
                if (typeof window !== 'undefined' && isPublicWishlist) {
                    try {
                        const publicStored = localStorage.getItem('local-public-wishlists');
                        if (publicStored) {
                            const publicWishlists: any[] = JSON.parse(publicStored);
                            const filtered = publicWishlists.filter((w: any) => w.id !== wishlistId);
                            localStorage.setItem('local-public-wishlists', JSON.stringify(filtered));
                        }
                    } catch (error) {
                        console.error('Error removing from public wishlists:', error);
                    }
                }
                router.push("/wishlists");
            } catch (error) {
                console.error('Error deleting wishlist:', error);
                alert('Failed to delete wishlist. Please try again.');
            }
        }
    };

    const handleCopyUrl = async () => {
        // For public wishlists, use the public URL with slug
        // For private wishlists, use the regular URL with ID
        const url = isPublicWishlist && wishlist?.slug
            ? getPublicWishlistUrl(wishlist.slug)
            : getWishlistUrl(wishlistId);
        
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    // Show loading state
    if (isLoadingWishlist) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Poppins, sans-serif",
                }}
            >
                <Loader2 size={40} className="animate-spin text-gray-400" />
                <p style={{ marginTop: "16px", color: "#6b7280" }}>Loading wishlist...</p>
            </div>
        );
    }

    // Check access: if not public and not authenticated, deny access
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
                <p style={{ marginTop: "8px", color: "#6b7280" }}>
                    This wishlist doesn't exist or is private.
                </p>
                <Link 
                    href="/agents" 
                    style={{ 
                        marginTop: "24px",
                        padding: "12px 24px",
                        backgroundColor: "#10b981",
                        color: "white",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Browse Agents
                </Link>
            </div>
        );
    }


    // If private and not authenticated, require login
    if (!isPublicWishlist && !isAuthenticated) {
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
                <Lock size={48} color="#d1d5db" />
                <p style={{ marginTop: "16px", fontSize: "18px", fontWeight: 600, color: "#111827" }}>
                    Private Wishlist
                </p>
                <p style={{ marginTop: "8px", color: "#6b7280", textAlign: "center" }}>
                    This wishlist is private. Please log in to view it.
                </p>
                <Link 
                    href="/auth/login" 
                    style={{ 
                        marginTop: "24px",
                        padding: "12px 24px",
                        backgroundColor: "#EF4444",
                        color: "white",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                    }}
                >
                    Log In
                </Link>
            </div>
        );
    }

    // This page is for authenticated users viewing their own wishlists or private wishlists
    // Public wishlists should be accessed via /wishlists/public/[slug]

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Header Section with Gradient - Matching agents page style */}
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
                    <Link
                        href="/wishlists"
                        className="inline-flex items-center mb-4"
                        style={{
                            color: '#091917',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '12px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '150%',
                        }}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to Wishlists
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-6 items-start justify-between w-full mb-8">
                        <div className="flex-1">
                            <div>
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
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                                    <p
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "14px",
                                            color: "#6b7280",
                                        }}
                                    >
                                        by {(() => {
                                            const creator = wishlist?.created_by || user?.email || "Unknown";
                                            // Extract username from email (part before @)
                                            const username = creator.includes('@') ? creator.split('@')[0] : creator;
                                            return username;
                                        })()} | {wishlist?.agents.length || 0} agent{wishlist?.agents.length !== 1 ? "s" : ""}
                                    </p>
                                    {isPublicWishlist && (
                                        <>
                                            <span style={{ color: "#d1d5db" }}>|</span>
                                            <Globe size={14} color="#10b981" />
                                            <span
                                                onClick={handleCopyUrl}
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    fontSize: "14px",
                                                    color: "#6b7280",
                                                    cursor: "pointer",
                                                    textDecoration: "underline",
                                                    textUnderlineOffset: "2px",
                                                }}
                                            >
                                                {isPublicWishlist && wishlist?.slug
                                                    ? getPublicWishlistUrl(wishlist.slug)
                                                    : getWishlistUrl(wishlistId)}
                                            </span>
                                            {copied && (
                                                <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "12px", color: "#10b981" }}>
                                                    Copied!
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Public/Private pill and 3-dot menu */}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {isPublicWishlist ? (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "4px 8px",
                                        backgroundColor: "#d1fae5",
                                        borderRadius: "2%",
                                        fontSize: "12px",
                                        color: "#10b981",
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    <Globe size={14} />
                                    Public
                                </span>
                            ) : (
                                <span
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "4px 8px",
                                        backgroundColor: "#f3f4f6",
                                        borderRadius: "2%",
                                        fontSize: "12px",
                                        color: "#6b7280",
                                        fontFamily: "Poppins, sans-serif",
                                        fontWeight: 500,
                                    }}
                                >
                                    <Lock size={14} />
                                    Private
                                </span>
                            )}
                            {/* Only show 3-dot menu if authenticated and (user owns it or is admin) */}
                            {isAuthenticated && (user?.role === 'admin' || !isPublicWishlist) && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#6b7280",
                                                borderRadius: "6px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: "all 0.2s",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f3f4f6";
                                                e.currentTarget.style.color = "#181818";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = "#6b7280";
                                            }}
                                        >
                                            <MoreVertical size={20} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent 
                                        align="start" 
                                        side="bottom"
                                        sideOffset={8}
                                        alignOffset={0}
                                        collisionPadding={16}
                                        className="min-w-[180px]"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setEditingName(wishlist?.name || "");
                                                setEditingIsPublic(wishlist?.isPublic || false);
                                                setEditingSlug(wishlist?.slug || "");
                                                setShowEditInput(true);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Edit2 size={16} style={{ marginRight: "8px" }} />
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                // Get current slug or generate one if making public
                                                const currentSlug = wishlist?.slug || (editingSlug.trim() || '');
                                                togglePublic(wishlistId, !isPublicWishlist, currentSlug || undefined);
                                                setIsPublicWishlist(!isPublicWishlist);
                                            }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {isPublicWishlist ? (
                                                <>
                                                    <Lock size={16} style={{ marginRight: "8px" }} />
                                                    Make Private
                                                </>
                                            ) : (
                                                <>
                                                    <Globe size={16} style={{ marginRight: "8px" }} />
                                                    Make Public
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={handleDelete}
                                            style={{ 
                                                cursor: "pointer",
                                                color: "#ef4444",
                                            }}
                                        >
                                            <Trash2 size={16} style={{ marginRight: "8px" }} />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section - Matching agents page style */}
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

            {/* Agents Grid Section - Matching agents page style */}
            <section className="relative pt-1 pb-12">
                <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                    {isLoadingAgents ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <Loader2 size={40} className="animate-spin text-gray-400" />
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
                            <Link
                                href="/agents"
                                style={{
                                    display: "inline-block",
                                    marginTop: "16px",
                                    padding: "12px 24px",
                                    backgroundColor: "#10b981",
                                    color: "#fff",
                                    borderRadius: "10px",
                                    textDecoration: "none",
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 600,
                                }}
                            >
                                Browse Agents
                            </Link>
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
                                        wishlistId={wishlistId}
                                        onRemoveFromWishlist={handleRemoveAgent}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Edit Wishlist Modal */}
            {showEditInput && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(4px)",
                    }}
                    onClick={() => {
                        setShowEditInput(false);
                        setEditingName("");
                        setEditingIsPublic(false);
                        setEditingSlug("");
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: "16px",
                            width: "100%",
                            maxWidth: "500px",
                            padding: "24px",
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "20px",
                                fontWeight: 600,
                                color: "#111827",
                                marginBottom: "20px",
                            }}
                        >
                            Edit Wishlist
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <input
                                type="text"
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                placeholder="Wishlist name"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleRename();
                                    if (e.key === "Escape") {
                                        setShowEditInput(false);
                                        setEditingName("");
                                        setEditingIsPublic(false);
                                        setEditingSlug("");
                                    }
                                }}
                                autoFocus
                                style={{
                                    padding: "12px 16px",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => e.target.style.borderColor = "#181818"}
                                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                            />
                            
                            {/* Public/Private Toggle */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                    padding: "12px 16px",
                                    backgroundColor: "#f9fafb",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {editingIsPublic ? (
                                            <Globe size={18} color="#10b981" />
                                        ) : (
                                            <Lock size={18} color="#6b7280" />
                                        )}
                                        <span
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "14px",
                                                color: "#374151",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {editingIsPublic ? "Public" : "Private"}
                                        </span>
                                        <span
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "12px",
                                                color: "#6b7280",
                                                marginLeft: "4px",
                                            }}
                                        >
                                            {editingIsPublic
                                                ? "(accessible to all admins and via URL)"
                                                : "(only visible to you)"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditingIsPublic(!editingIsPublic)}
                                        style={{
                                            position: "relative",
                                            width: "48px",
                                            height: "24px",
                                            borderRadius: "12px",
                                            backgroundColor: editingIsPublic ? "#10b981" : "#d1d5db",
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s",
                                            outline: "none",
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "2px",
                                                left: editingIsPublic ? "26px" : "2px",
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                backgroundColor: "#fff",
                                                transition: "left 0.2s",
                                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Slug Input - Under toggle */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                    <label
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "12px",
                                            color: "#6b7280",
                                            fontWeight: 500,
                                        }}
                                    >
                                        Custom URL Slug (optional)
                                    </label>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "14px",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            {typeof window !== 'undefined' ? window.location.origin : ''}/wishlists/
                                        </span>
                                        <input
                                            type="text"
                                            value={editingSlug}
                                            onChange={(e) => {
                                                // Only allow lowercase letters, numbers, and hyphens
                                                const cleaned = e.target.value
                                                    .toLowerCase()
                                                    .replace(/[^a-z0-9-]/g, '')
                                                    .replace(/-+/g, '-');
                                                setEditingSlug(cleaned);
                                            }}
                                            placeholder="my-custom-slug"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleRename();
                                            }}
                                            style={{
                                                flex: 1,
                                                padding: "8px 12px",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "6px",
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "14px",
                                                outline: "none",
                                                transition: "border-color 0.2s",
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = "#181818"}
                                            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                                        />
                                    </div>
                                    <p
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "11px",
                                            color: "#9ca3af",
                                            margin: 0,
                                        }}
                                    >
                                        Leave empty to auto-generate from name
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginLeft: "auto", width: "fit-content" }}>
                                <button
                                    onClick={() => {
                                        setShowEditInput(false);
                                        setEditingName("");
                                        setEditingIsPublic(false);
                                        setEditingSlug("");
                                    }}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#f3f4f6",
                                        color: "#374151",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRename}
                                    disabled={!editingName.trim()}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#181818",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: editingName.trim() ? "pointer" : "not-allowed",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        opacity: editingName.trim() ? 1 : 0.6,
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (editingName.trim()) {
                                            e.currentTarget.style.backgroundColor = "#000000";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#181818";
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
