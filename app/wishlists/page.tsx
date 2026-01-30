"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Trash2, Edit2, Loader2, Globe, Lock, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { useWishlistsStore } from "../../lib/store/wishlists.store";
import { useAuthStore } from "../../lib/store/auth.store";
import { generateSlug } from "../../lib/api/wishlist.service";
import Link from "next/link";
import { getPublicWishlistUrl, getWishlistUrl } from "../../lib/utils/public-url";

export default function WishlistsPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const {
        wishlists,
        isLoading,
        isCreating,
        loadAllWishlists,
        createWishlist,
        deleteWishlist,
        renameWishlist,
        togglePublic,
    } = useWishlistsStore();

    const [newWishlistName, setNewWishlistName] = useState("");
    const [newWishlistSlug, setNewWishlistSlug] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState("");
    const [editingIsPublic, setEditingIsPublic] = useState(false);
    const [editingSlug, setEditingSlug] = useState("");
    const [showEditInput, setShowEditInput] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [newWishlistIsPublic, setNewWishlistIsPublic] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
    const [isHoveringHeader, setIsHoveringHeader] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    useEffect(() => {
        console.log('🔍 WishlistsPage: isAuthenticated =', isAuthenticated);
        console.log('🔍 WishlistsPage: user =', user);
        console.log('🔍 WishlistsPage: wishlists from store =', wishlists);
        console.log('🔍 WishlistsPage: isLoading =', isLoading);
        
        if (isAuthenticated) {
            console.log('🔍 WishlistsPage: Calling loadAllWishlists()...');
            loadAllWishlists().then(() => {
                const updatedWishlists = useWishlistsStore.getState().wishlists;
                console.log('🔍 WishlistsPage: After loadAllWishlists, wishlists =', updatedWishlists);
                console.log('🔍 WishlistsPage: localStorage keys =', Object.keys(localStorage).filter(k => k.toLowerCase().includes('wishlist')));
            });
        } else {
            console.log('⚠️ WishlistsPage: Not authenticated, skipping loadAllWishlists');
        }
    }, [isAuthenticated, loadAllWishlists]);

    // Track mouse position for header hover effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isHoveringHeader) {
                const headerSection = document.querySelector('[data-header-section]') as HTMLElement;
                if (headerSection) {
                    const rect = headerSection.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    setMousePosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
                }
            }
        };

        if (isHoveringHeader) {
            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isHoveringHeader]);

    const handleCreateWishlist = async () => {
        if (!newWishlistName.trim()) return;
        
        setCreateError(null); // Clear previous errors
        
        try {
            // Validate and clean slug if provided
            let slug = newWishlistSlug.trim();
            if (slug) {
                // Clean slug: lowercase, replace spaces/special chars with hyphens, remove invalid chars
                slug = slug
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }
            
            const result = await createWishlist(newWishlistName.trim(), undefined, newWishlistIsPublic, slug || undefined);
            
            if (!result) {
                throw new Error('Failed to create wishlist. Please try again.');
            }
            
            // Success - clear form
            setNewWishlistName("");
            setNewWishlistSlug("");
            setNewWishlistIsPublic(false);
            setShowCreateInput(false);
        } catch (error: any) {
            console.error('Error in handleCreateWishlist:', error);
            const errorMessage = error?.message || 'Failed to create wishlist. Please try again.';
            setCreateError(errorMessage);
        }
    };

    const handleRename = async (id: string) => {
        if (!editingName.trim()) return;
        
        const wishlist = wishlists.find(w => w.id === id);
        if (!wishlist) return;
        
        // Update name
        await renameWishlist(id, editingName.trim());
        
        // Update public/private status if changed
        if (wishlist.isPublic !== editingIsPublic) {
            await togglePublic(id, editingIsPublic);
        }
        
        // Update slug if it's a public wishlist
        if (editingIsPublic) {
            let slug = editingSlug.trim();
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
                        if (w.id === id) {
                            const updatedWl = { ...w, name: editingName.trim() };
                            if (slug) {
                                updatedWl.slug = slug;
                            } else if (editingIsPublic && !updatedWl.slug) {
                                // Auto-generate slug if not provided
                                updatedWl.slug = generateSlug(editingName.trim(), id, true);
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
                        if (w.id === id) {
                            const updatedWl = { ...w, name: editingName.trim(), isPublic: editingIsPublic };
                            if (slug) {
                                updatedWl.slug = slug;
                            } else if (editingIsPublic && !updatedWl.slug) {
                                updatedWl.slug = generateSlug(editingName.trim(), id, true);
                            }
                            return updatedWl;
                        }
                        return w;
                    });
                    
                    // Add to public wishlists if making public, remove if making private
                    if (editingIsPublic) {
                        const exists = updatedPublic.find((w: any) => w.id === id);
                        if (!exists) {
                            const wishlistToAdd = updated.find((w: any) => w.id === id);
                            if (wishlistToAdd) {
                                updatedPublic.push(wishlistToAdd);
                            }
                        }
                        localStorage.setItem('local-public-wishlists', JSON.stringify(updatedPublic));
                    } else {
                        const filtered = updatedPublic.filter((w: any) => w.id !== id);
                        localStorage.setItem('local-public-wishlists', JSON.stringify(filtered));
                    }
                    
                    // Reload wishlists to reflect changes
                    await loadAllWishlists();
                } catch (error) {
                    console.error('Error updating wishlist:', error);
                }
            }
        }
        
        setEditingId(null);
        setEditingName("");
        setEditingIsPublic(false);
        setEditingSlug("");
        setShowEditInput(false);
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteWishlist(id);
        setDeletingId(null);
    };

    if (!isAuthenticated) {
        return (
            <div
                className="w-full min-h-screen bg-white flex flex-col items-center justify-center"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    animation: 'fadeIn 0.3s ease-in',
                }}
            >
                <Heart size={48} color="#EF4444" />
                <h1 style={{ fontSize: "24px", fontWeight: 600, marginTop: "20px", color: "#111827" }}>
                    Wishlists
                </h1>
                <p style={{ color: "#6b7280", marginTop: "10px" }}>
                    Please log in to view your wishlists
                </p>
            </div>
        );
    }

    return (
        <div
            className="w-full min-h-screen bg-white"
            style={{
                animation: 'fadeIn 0.3s ease-in',
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(-10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInRight {
                  from { opacity: 0; transform: translateX(20px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInLeft {
                  from { opacity: 0; transform: translateX(-20px); }
                  to { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
                }
              `}} />
            
            {/* Header Section with Gradient */}
            <div
                data-header-section
                className="w-full px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-0 relative group"
                style={{
                    background: 'radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)',
                    animation: 'fadeIn 0.4s ease-out',
                }}
                onMouseEnter={() => setIsHoveringHeader(true)}
                onMouseLeave={() => setIsHoveringHeader(false)}
            >
                {/* Dotted Gradient Background Pattern - Visible on Hover near Cursor */}
                <div
                    aria-hidden="true"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `radial-gradient(circle 3px, rgba(180, 83, 9, 0.25) 1.5px, transparent 1.5px)`,
                        backgroundSize: '32px 32px',
                        backgroundPosition: '0 0',
                        backgroundRepeat: 'repeat',
                        maskImage: `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 40%, transparent 60%)`,
                        WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 40%, transparent 60%)`,
                        transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out, opacity 0.3s ease-in-out',
                        willChange: 'mask-image',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}
                />
                {/* Content wrapper with higher z-index */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-8" style={{ animation: 'slideInLeft 0.5s ease-out' }}>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                Wishlists
                            </h1>
                            <p className="text-base text-gray-600">
                                Create and manage your wishlists
                            </p>
                        </div>
                        {!showCreateInput && (
                            <div style={{ animation: 'slideInRight 0.5s ease-out' }}>
                                <button
                                    onClick={() => setShowCreateInput(true)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        padding: "12px 16px",
                                        backgroundColor: "#181818",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                        transition: "all 0.2s",
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "#000000";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "#181818";
                                        e.currentTarget.style.transform = "scale(1)";
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                    }}
                                >
                                    <Plus size={18} />
                                    Create New Wishlist
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Wishlist Modal - Similar to create */}
            {showEditInput && editingId && (
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
                        setEditingId(null);
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
                                    if (e.key === "Enter") handleRename(editingId);
                                    if (e.key === "Escape") {
                                        setShowEditInput(false);
                                        setEditingId(null);
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
                                            {getPublicUrl()}/wishlists/
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
                                                if (e.key === "Enter") handleRename(editingId);
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
                                        setEditingId(null);
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
                                    onClick={() => handleRename(editingId)}
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
                                        if (editingName.trim()) {
                                            e.currentTarget.style.backgroundColor = "#181818";
                                        }
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="w-full px-8 md:px-12 lg:px-16 pt-8 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Create Wishlist Input Section - Only shown when creating */}
                    {showCreateInput && (
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                padding: "24px",
                                marginBottom: "24px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                border: "1px solid #e5e7eb",
                                animation: 'scaleIn 0.4s ease-out',
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {createError && (
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            backgroundColor: "#fee2e2",
                                            border: "1px solid #fca5a5",
                                            borderRadius: "8px",
                                            color: "#dc2626",
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {createError}
                                    </div>
                                )}
                                <input
                                    type="text"
                                    value={newWishlistName}
                                    onChange={(e) => {
                                        setNewWishlistName(e.target.value);
                                        setCreateError(null); // Clear error when user types
                                    }}
                                    placeholder="Wishlist name"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCreateWishlist();
                                        if (e.key === "Escape") {
                                            setShowCreateInput(false);
                                            setNewWishlistName("");
                                            setNewWishlistSlug("");
                                            setNewWishlistIsPublic(false);
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
                                            {newWishlistIsPublic ? (
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
                                                {newWishlistIsPublic ? "Public" : "Private"}
                                            </span>
                                            <span
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    fontSize: "12px",
                                                    color: "#6b7280",
                                                    marginLeft: "4px",
                                                }}
                                            >
                                                {newWishlistIsPublic
                                                    ? "(accessible to all admins and via URL)"
                                                    : "(only visible to you)"}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNewWishlistIsPublic(!newWishlistIsPublic)}
                                            style={{
                                                position: "relative",
                                                width: "48px",
                                                height: "24px",
                                                borderRadius: "12px",
                                                backgroundColor: newWishlistIsPublic ? "#10b981" : "#d1d5db",
                                                border: "none",
                                                cursor: "pointer",
                                                transition: "background-color 0.2s",
                                                outline: "none",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (newWishlistIsPublic) {
                                                    e.currentTarget.style.backgroundColor = "#059669";
                                                } else {
                                                    e.currentTarget.style.backgroundColor = "#9ca3af";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = newWishlistIsPublic ? "#10b981" : "#d1d5db";
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    top: "2px",
                                                    left: newWishlistIsPublic ? "26px" : "2px",
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "white",
                                                    transition: "left 0.2s",
                                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
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
                                                {getPublicUrl()}/wishlists/
                                            </span>
                                            <input
                                                type="text"
                                                value={newWishlistSlug}
                                                onChange={(e) => {
                                                    // Only allow lowercase letters, numbers, and hyphens
                                                    const cleaned = e.target.value
                                                        .toLowerCase()
                                                        .replace(/[^a-z0-9-]/g, '')
                                                        .replace(/-+/g, '-');
                                                    setNewWishlistSlug(cleaned);
                                                }}
                                                placeholder="my-custom-slug"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleCreateWishlist();
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
                                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginLeft: "auto", width: "fit-content" }}>
                                    <button
                                        onClick={() => {
                                            setShowCreateInput(false);
                                            setNewWishlistName("");
                                            setNewWishlistSlug("");
                                            setNewWishlistIsPublic(false);
                                        }}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#f3f4f6",
                                            color: "#374151",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "14px",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#e5e7eb";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateWishlist}
                                        disabled={isCreating || !newWishlistName.trim()}
                                        style={{
                                            padding: "12px 24px",
                                            backgroundColor: "#181818",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "8px",
                                            cursor: isCreating || !newWishlistName.trim() ? "not-allowed" : "pointer",
                                            opacity: isCreating || !newWishlistName.trim() ? 0.6 : 1,
                                            fontFamily: "Poppins, sans-serif",
                                            fontSize: "14px",
                                            fontWeight: 500,
                                            transition: "all 0.2s",
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isCreating && newWishlistName.trim()) {
                                                e.currentTarget.style.backgroundColor = "#000000";
                                                e.currentTarget.style.transform = "scale(1.05)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "#181818";
                                            e.currentTarget.style.transform = "scale(1)";
                                        }}
                                    >
                                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wishlists List */}
                    {isLoading ? (
                        <div style={{ textAlign: "center", padding: "60px" }}>
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                        </div>
                    ) : wishlists.length === 0 ? (
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "12px",
                                padding: "48px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                border: "1px solid #e5e7eb",
                                animation: 'scaleIn 0.4s ease-out',
                            }}
                        >
                            <Heart size={48} color="#d1d5db" />
                            <p
                                style={{
                                    marginTop: "16px",
                                    color: "#6b7280",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "16px",
                                }}
                            >
                                No wishlists yet. Create one above!
                            </p>
                        </div>
                    ) : (
                        <div 
                            style={{ 
                                display: "grid", 
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "20px",
                            }}
                        >
                            {wishlists.map((wishlist, index) => (
                                <div
                                    key={wishlist.id}
                                    style={{
                                        backgroundColor: "white",
                                        borderRadius: "12px",
                                        padding: "20px",
                                        border: "1px solid #e5e7eb",
                                        transition: "all 0.2s",
                                        animation: `scaleIn ${0.3 + index * 0.1}s ease-out`,
                                        display: "flex",
                                        flexDirection: "column",
                                        cursor: "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                    onClick={() => router.push(`/wishlists/${wishlist.slug || wishlist.id}`)}
                                >
                                    {/* Card Header */}
                                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                                        {false && editingId === wishlist.id ? (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        e.stopPropagation();
                                                        if (e.key === "Enter") handleRename(wishlist.id);
                                                        if (e.key === "Escape") {
                                                            setEditingId(null);
                                                            setEditingName("");
                                                        }
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    autoFocus
                                                    style={{
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        border: "2px solid #181818",
                                                        borderRadius: "6px",
                                                        fontFamily: "Poppins, sans-serif",
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                        outline: "none",
                                                    }}
                                                />
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRename(wishlist.id);
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: "6px 12px",
                                                            backgroundColor: "#181818",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            fontFamily: "Poppins, sans-serif",
                                                            fontSize: "12px",
                                                            fontWeight: 500,
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingId(null);
                                                            setEditingName("");
                                                        }}
                                                        style={{
                                                            flex: 1,
                                                            padding: "6px 12px",
                                                            backgroundColor: "#f3f4f6",
                                                            color: "#374151",
                                                            border: "1px solid #e5e7eb",
                                                            borderRadius: "6px",
                                                            cursor: "pointer",
                                                            fontFamily: "Poppins, sans-serif",
                                                            fontSize: "12px",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                                                        <h3
                                                            style={{
                                                                fontSize: "18px",
                                                                fontWeight: 600,
                                                                color: "#111827",
                                                                fontFamily: "Poppins, sans-serif",
                                                            }}
                                                        >
                                                            {wishlist.name}
                                                        </h3>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            {wishlist.isPublic ? (
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "4px",
                                                                        fontSize: "11px",
                                                                        color: "#10b981",
                                                                        fontFamily: "Poppins, sans-serif",
                                                                        fontWeight: 500,
                                                                        padding: "2px 8px",
                                                                        backgroundColor: "#d1fae5",
                                                                        borderRadius: "2%",
                                                                    }}
                                                                >
                                                                    <Globe size={12} />
                                                                    Public
                                                                </span>
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "4px",
                                                                        fontSize: "11px",
                                                                        color: "#6b7280",
                                                                        fontFamily: "Poppins, sans-serif",
                                                                        fontWeight: 500,
                                                                        padding: "2px 8px",
                                                                        backgroundColor: "#f3f4f6",
                                                                        borderRadius: "2%",
                                                                    }}
                                                                >
                                                                    <Lock size={12} />
                                                                    Private
                                                                </span>
                                                            )}
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        style={{
                                                                            padding: "4px",
                                                                            backgroundColor: "transparent",
                                                                            border: "none",
                                                                            cursor: "pointer",
                                                                            color: "#6b7280",
                                                                            borderRadius: "4px",
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
                                                                        <MoreVertical size={18} />
                                                                    </button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            // Pass existing slug if making public, or undefined if making private
                                                                            const slugToUse = !wishlist.isPublic && wishlist.slug ? wishlist.slug : undefined;
                                                                            togglePublic(wishlist.id, !wishlist.isPublic, slugToUse);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        {wishlist.isPublic ? (
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
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditingId(wishlist.id);
                                                                            setEditingName(wishlist.name);
                                                                            setEditingIsPublic(wishlist.isPublic || false);
                                                                            setEditingSlug(wishlist.slug || "");
                                                                            setShowEditInput(true);
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    >
                                                                        <Edit2 size={16} style={{ marginRight: "8px" }} />
                                                                        Edit
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDelete(wishlist.id);
                                                                        }}
                                                                        style={{ 
                                                                            cursor: deletingId === wishlist.id ? "not-allowed" : "pointer",
                                                                            color: "#ef4444",
                                                                        }}
                                                                        disabled={deletingId === wishlist.id}
                                                                    >
                                                                        {deletingId === wishlist.id ? (
                                                                            <>
                                                                                <Loader2 size={16} className="animate-spin" style={{ marginRight: "8px" }} />
                                                                                Deleting...
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <Trash2 size={16} style={{ marginRight: "8px" }} />
                                                                                Delete
                                                                            </>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </div>
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#9ca3af",
                                                            fontFamily: "Poppins, sans-serif",
                                                        }}
                                                    >
                                                        {wishlist.agents.length} agent{wishlist.agents.length !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Card Actions - Only show when not editing */}
                                    {editingId !== wishlist.id && (
                                        <Link
                                            href={`/wishlists/${wishlist.slug || wishlist.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                marginTop: "auto",
                                                padding: "10px 16px",
                                                backgroundColor: "#f3f4f6",
                                                color: "#374151",
                                                border: "1px solid #e5e7eb",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "14px",
                                                fontWeight: 500,
                                                transition: "all 0.2s",
                                                textAlign: "center",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = "#e5e7eb";
                                                e.currentTarget.style.color = "#111827";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = "#f3f4f6";
                                                e.currentTarget.style.color = "#374151";
                                            }}
                                        >
                                            View Wishlist
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
