"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Heart, Check, Loader2 } from "lucide-react";
import { useWishlistsStore } from "../lib/store/wishlists.store";

interface WishlistPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    agentId: string;
    agentName?: string;
}

export function WishlistPickerModal({ isOpen, onClose, agentId, agentName }: WishlistPickerModalProps) {
    const {
        wishlists,
        isCreating,
        addToWishlist,
        removeFromWishlist,
        createWishlist,
        isInWishlist,
    } = useWishlistsStore();

    const [newWishlistName, setNewWishlistName] = useState("");
    const [showCreateInput, setShowCreateInput] = useState(false);
    const [loadingWishlistId, setLoadingWishlistId] = useState<string | null>(null);

    const handleToggleWishlist = async (wishlistId: string) => {
        setLoadingWishlistId(wishlistId);
        try {
            if (isInWishlist(wishlistId, agentId)) {
                await removeFromWishlist(wishlistId, agentId);
            } else {
                await addToWishlist(wishlistId, agentId);
            }
        } finally {
            setLoadingWishlistId(null);
        }
    };

    const handleCreateWishlist = async () => {
        if (!newWishlistName.trim()) return;

        const newWl = await createWishlist(newWishlistName.trim());
        if (newWl) {
            await addToWishlist(newWl.id, agentId);
            setNewWishlistName("");
            setShowCreateInput(false);
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                overflowY: "auto",
                padding: "20px",
            }}
            onClick={onClose}
        >
            <div
                data-wishlist-modal
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    width: "100%",
                    maxWidth: "400px",
                    maxHeight: "calc(100vh - 40px)",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
                    margin: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid #e5e7eb",
                        background: "linear-gradient(135deg, #f9fafb 0%, #fff 100%)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Heart size={20} fill="#EF4444" stroke="#EF4444" />
                        <span
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                fontSize: "16px",
                                color: "#111827",
                            }}
                        >
                            Save to Wishlist
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <X size={20} color="#6b7280" />
                    </button>
                </div>

                {/* Agent name */}
                {agentName && (
                    <div
                        style={{
                            padding: "12px 20px",
                            backgroundColor: "#f3f4f6",
                            fontSize: "13px",
                            color: "#6b7280",
                            fontFamily: "Poppins, sans-serif",
                        }}
                    >
                        Adding: <strong style={{ color: "#111827" }}>{agentName}</strong>
                    </div>
                )}

                {/* Create new wishlist - moved to top */}
                <div
                    style={{
                        padding: "8px 20px 4px 20px",
                    }}
                >
                    {showCreateInput ? (
                        <div style={{ display: "flex", gap: "8px" }} onClick={(e) => e.stopPropagation()}>
                            <input
                                type="text"
                                placeholder="Wishlist name..."
                                value={newWishlistName}
                                onChange={(e) => setNewWishlistName(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleCreateWishlist();
                                    }
                                }}
                                autoFocus
                                style={{
                                    flex: 1,
                                    padding: "10px 14px",
                                    borderRadius: "8px",
                                    border: "2px solid #d1d5db",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCreateWishlist();
                                }}
                                disabled={isCreating || !newWishlistName.trim()}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "#10b981",
                                    color: "#fff",
                                    fontFamily: "Poppins, sans-serif",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    cursor: isCreating ? "wait" : "pointer",
                                    opacity: !newWishlistName.trim() ? 0.5 : 1,
                                }}
                            >
                                {isCreating ? <Loader2 size={16} className="animate-spin" /> : "Add"}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCreateInput(false);
                                    setNewWishlistName("");
                                }}
                                style={{
                                    padding: "10px",
                                    borderRadius: "8px",
                                    border: "2px solid #e5e7eb",
                                    backgroundColor: "#fff",
                                    cursor: "pointer",
                                }}
                            >
                                <X size={16} color="#6b7280" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowCreateInput(true);
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                                width: "100%",
                                padding: "12px",
                                borderRadius: "10px",
                                border: "2px dashed #d1d5db",
                                backgroundColor: "transparent",
                                color: "#6b7280",
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                        >
                            <Plus size={18} />
                            Create New Wishlist
                        </button>
                    )}
                </div>

                {/* Wishlist list */}
                <div
                    style={{
                        padding: "4px 16px 12px 16px",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {wishlists.length === 0 ? (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "24px",
                                color: "#9ca3af",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "14px",
                            }}
                        >
                            No wishlists yet. Create one below!
                        </div>
                    ) : (
                        wishlists.map((wishlist) => {
                            const isChecked = isInWishlist(wishlist.id, agentId);
                            const isLoading = loadingWishlistId === wishlist.id;

                            return (
                                <button
                                    key={wishlist.id}
                                    onClick={() => handleToggleWishlist(wishlist.id)}
                                    disabled={isLoading}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "12px 14px",
                                        marginBottom: "8px",
                                        borderRadius: "10px",
                                        border: isChecked ? "2px solid #181818" : "2px solid #e5e7eb",
                                        backgroundColor: isChecked ? "rgba(24, 24, 24, 0.05)" : "#fff",
                                        cursor: isLoading ? "wait" : "pointer",
                                        transition: "all 0.2s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: "22px",
                                            height: "22px",
                                            borderRadius: "6px",
                                            border: isChecked ? "none" : "2px solid #d1d5db",
                                            backgroundColor: isChecked ? "#181818" : "transparent",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginRight: "12px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {isLoading ? (
                                            <Loader2 size={14} color={isChecked ? "#fff" : "#9ca3af"} className="animate-spin" />
                                        ) : isChecked ? (
                                            <Check size={14} color="#fff" strokeWidth={3} />
                                        ) : null}
                                    </div>
                                    <div style={{ flex: 1, textAlign: "left" }}>
                                        <div
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontWeight: 500,
                                                fontSize: "14px",
                                                color: "#111827",
                                            }}
                                        >
                                            {wishlist.name}
                                        </div>
                                        <div
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "12px",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            {wishlist.agents.length} agent{wishlist.agents.length !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Save Wishlist button */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderTop: "1px solid #e5e7eb",
                        backgroundColor: "#fff",
                    }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "#181818",
                            color: "#fff",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "14px",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#000000";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "#181818";
                        }}
                    >
                        Save Wishlist
                    </button>
                </div>
            </div>
        </div>
    );

    // Render modal at document body level using portal
    if (typeof window !== 'undefined') {
        return createPortal(modalContent, document.body);
    }
    
    return null;
}
