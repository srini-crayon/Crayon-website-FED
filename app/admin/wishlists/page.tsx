"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../lib/store/auth.store";

export default function AdminWishlistsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    // Redirect to unified wishlist page
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/wishlists');
        } else {
            router.replace('/auth/login');
        }
    }, [isAuthenticated, router]);

    return null;

    const [newWishlistIsPublic, setNewWishlistIsPublic] = useState(false);

    const handleCreateWishlist = async () => {
        if (!newWishlistName.trim()) return;
        await createWishlist(newWishlistName.trim(), undefined, newWishlistIsPublic);
        setNewWishlistName("");
        setNewWishlistIsPublic(false);
        setShowCreateInput(false);
    };

    const handleRename = async (id: string) => {
        if (!editingName.trim()) return;
        await renameWishlist(id, editingName.trim());
        setEditingId(null);
        setEditingName("");
    };

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        await deleteWishlist(id);
        setDeletingId(null);
    };

    if (isCheckingAuth) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f9fafb",
                padding: "40px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "32px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span style={{ fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>Back to Admin</span>
                        </Link>
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "32px",
                    }}
                >
                    <Heart size={32} color="#EF4444" />
                    <h1
                        style={{
                            fontSize: "32px",
                            fontWeight: 600,
                            color: "#111827",
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        Admin Wishlists
                    </h1>
                </div>

                {/* Create Wishlist Section */}
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "12px",
                        padding: "24px",
                        marginBottom: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    {!showCreateInput ? (
                        <button
                            onClick={() => setShowCreateInput(true)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "12px 16px",
                                backgroundColor: "#EF4444",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "14px",
                                fontWeight: 500,
                                transition: "opacity 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                            <Plus size={18} />
                            Create New Wishlist
                        </button>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <input
                                type="text"
                                value={newWishlistName}
                                onChange={(e) => setNewWishlistName(e.target.value)}
                                placeholder="Wishlist name"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleCreateWishlist();
                                    if (e.key === "Escape") {
                                        setShowCreateInput(false);
                                        setNewWishlistName("");
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
                                }}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "12px 16px",
                                    backgroundColor: "#f9fafb",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
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
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={handleCreateWishlist}
                                    disabled={isCreating || !newWishlistName.trim()}
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#EF4444",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: isCreating || !newWishlistName.trim() ? "not-allowed" : "pointer",
                                        opacity: isCreating || !newWishlistName.trim() ? 0.6 : 1,
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                        fontWeight: 500,
                                    }}
                                >
                                    {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateInput(false);
                                        setNewWishlistName("");
                                        setNewWishlistIsPublic(false);
                                    }}
                                    style={{
                                        padding: "12px 24px",
                                        backgroundColor: "#f3f4f6",
                                        color: "#374151",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "14px",
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Wishlists List */}
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    </div>
                ) : wishlists.length === 0 ? (
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            padding: "48px",
                            textAlign: "center",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
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
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {wishlists.map((wishlist) => (
                            <div
                                key={wishlist.id}
                                style={{
                                    backgroundColor: "white",
                                    borderRadius: "12px",
                                    padding: "24px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        {editingId === wishlist.id ? (
                                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleRename(wishlist.id);
                                                        if (e.key === "Escape") {
                                                            setEditingId(null);
                                                            setEditingName("");
                                                        }
                                                    }}
                                                    autoFocus
                                                    style={{
                                                        flex: 1,
                                                        padding: "8px 12px",
                                                        border: "1px solid #e5e7eb",
                                                        borderRadius: "6px",
                                                        fontFamily: "Poppins, sans-serif",
                                                        fontSize: "16px",
                                                        fontWeight: 600,
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleRename(wishlist.id)}
                                                    style={{
                                                        padding: "8px 16px",
                                                        backgroundColor: "#10b981",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontFamily: "Poppins, sans-serif",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingId(null);
                                                        setEditingName("");
                                                    }}
                                                    style={{
                                                        padding: "8px 16px",
                                                        backgroundColor: "#f3f4f6",
                                                        color: "#374151",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontFamily: "Poppins, sans-serif",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <h3
                                                    style={{
                                                        fontSize: "18px",
                                                        fontWeight: 600,
                                                        color: "#111827",
                                                        fontFamily: "Poppins, sans-serif",
                                                        marginBottom: "4px",
                                                    }}
                                                >
                                                    {wishlist.name}
                                                </h3>
                                                {wishlist.description && (
                                                    <p
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#6b7280",
                                                            fontFamily: "Poppins, sans-serif",
                                                        }}
                                                    >
                                                        {wishlist.description}
                                                    </p>
                                                )}
                                                <p
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#9ca3af",
                                                        fontFamily: "Poppins, sans-serif",
                                                        marginTop: "8px",
                                                    }}
                                                >
                                                    {wishlist.agents.length} agent{wishlist.agents.length !== 1 ? 's' : ''}
                                                </p>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                                    {wishlist.isPublic ? (
                                                        <span
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "4px",
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
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                        <button
                                            onClick={() => togglePublic(wishlist.id, !wishlist.isPublic)}
                                            title={wishlist.isPublic ? "Make private" : "Make public"}
                                            style={{
                                                padding: "8px",
                                                backgroundColor: wishlist.isPublic ? "#d1fae5" : "#f3f4f6",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                color: wishlist.isPublic ? "#10b981" : "#6b7280",
                                            }}
                                        >
                                            {wishlist.isPublic ? <Globe size={18} /> : <Lock size={18} />}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(wishlist.id);
                                                setEditingName(wishlist.name);
                                            }}
                                            disabled={editingId === wishlist.id}
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                cursor: editingId === wishlist.id ? "not-allowed" : "pointer",
                                                color: "#6b7280",
                                            }}
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(wishlist.id)}
                                            disabled={deletingId === wishlist.id}
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "transparent",
                                                border: "none",
                                                cursor: deletingId === wishlist.id ? "not-allowed" : "pointer",
                                                color: "#ef4444",
                                            }}
                                        >
                                            {deletingId === wishlist.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2 size={18} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/wishlists/${wishlist.id}`}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#EF4444",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                textDecoration: "none",
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "14px",
                                                fontWeight: 500,
                                            }}
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
