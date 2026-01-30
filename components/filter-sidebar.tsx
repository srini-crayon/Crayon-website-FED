"use client";

import { X, Check, Heart, ChevronDown, Folder } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useWishlistsStore } from "../lib/store/wishlists.store";

type FilterSidebarProps = {
    isOpen: boolean;
    onClose: () => void;
    // Capability filter - now array for multi-select
    byCapabilityFilter: string[];
    setByCapabilityFilter: (value: string[]) => void;
    allByCapabilities: string[];
    byCapabilityCounts: Record<string, number>;
    // Persona filter - now array for multi-select
    personaFilter: string[];
    setPersonaFilter: (value: string[]) => void;
    allPersonas: string[];
    agents: { persona: string }[];
    // Clear all
    onClearAll: () => void;
    hasActiveFilters: boolean;
    // Favorites filter
    showFavoritesOnly: boolean;
    setShowFavoritesOnly: (value: boolean) => void;
    favoritesCount: number;
    // Wishlist filter
    selectedWishlistId: string | null;
    setSelectedWishlistId: (id: string | null) => void;
};

// Wishlists Filter Section Component
function WishlistsFilterSection({ selectedWishlistId, setSelectedWishlistId }: {
    selectedWishlistId: string | null;
    setSelectedWishlistId: (id: string | null) => void;
}) {
    const { wishlists, loadAllWishlists } = useWishlistsStore();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        loadAllWishlists();
    }, [loadAllWishlists]);

    if (wishlists.length === 0) return null;

    const selectedWishlist = wishlists.find(w => w.id === selectedWishlistId);

    return (
        <div style={{ marginBottom: "24px" }}>
            <label
                style={{
                    display: "block",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#6B7280",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1.2px",
                    paddingLeft: "2px",
                }}
            >
                My Wishlists
            </label>

            {/* Dropdown-style selector */}
            <div style={{ position: "relative" }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: selectedWishlistId ? "2px solid rgba(239, 68, 68, 0.4)" : "2px solid rgba(229, 231, 235, 0.8)",
                        background: selectedWishlistId
                            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)"
                            : "rgba(249, 250, 251, 0.5)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Folder size={18} color={selectedWishlistId ? "#EF4444" : "#6B7280"} />
                        <span style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: selectedWishlistId ? "#EF4444" : "#374151",
                        }}>
                            {selectedWishlist?.name || "All Agents"}
                        </span>
                    </div>
                    <ChevronDown
                        size={18}
                        color="#6B7280"
                        style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                            transition: "transform 0.2s ease",
                        }}
                    />
                </button>

                {/* Dropdown list */}
                {isExpanded && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "4px",
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            zIndex: 100,
                            maxHeight: "200px",
                            overflowY: "auto",
                        }}
                    >
                        {/* All Agents option */}
                        <button
                            onClick={() => {
                                setSelectedWishlistId(null);
                                setIsExpanded(false);
                            }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                padding: "10px 14px",
                                border: "none",
                                background: !selectedWishlistId ? "rgba(99, 102, 241, 0.08)" : "transparent",
                                cursor: "pointer",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "13px",
                                color: "#374151",
                                textAlign: "left",
                            }}
                        >
                            <Folder size={16} color="#6B7280" style={{ marginRight: "10px" }} />
                            All Agents
                            {!selectedWishlistId && (
                                <Check size={16} color="#6366F1" style={{ marginLeft: "auto" }} />
                            )}
                        </button>

                        {/* Wishlist options */}
                        {wishlists.map((wishlist) => (
                            <button
                                key={wishlist.id}
                                onClick={() => {
                                    setSelectedWishlistId(wishlist.id);
                                    setIsExpanded(false);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                    padding: "10px 14px",
                                    border: "none",
                                    background: selectedWishlistId === wishlist.id ? "rgba(239, 68, 68, 0.08)" : "transparent",
                                    cursor: "pointer",
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "13px",
                                    color: "#374151",
                                    textAlign: "left",
                                }}
                            >
                                <Heart
                                    size={16}
                                    fill={selectedWishlistId === wishlist.id ? "#EF4444" : "none"}
                                    stroke={selectedWishlistId === wishlist.id ? "#EF4444" : "#6B7280"}
                                    style={{ marginRight: "10px" }}
                                />
                                {wishlist.name}
                                <span style={{
                                    marginLeft: "auto",
                                    fontSize: "11px",
                                    color: "#9CA3AF",
                                    marginRight: selectedWishlistId === wishlist.id ? "8px" : "0",
                                }}>
                                    {wishlist.agents.length}
                                </span>
                                {selectedWishlistId === wishlist.id && (
                                    <Check size={16} color="#EF4444" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function FilterSidebar({
    isOpen,
    onClose,
    byCapabilityFilter,
    setByCapabilityFilter,
    allByCapabilities,
    byCapabilityCounts,
    personaFilter,
    setPersonaFilter,
    allPersonas,
    agents,
    onClearAll,
    hasActiveFilters,
    showFavoritesOnly,
    setShowFavoritesOnly,
    favoritesCount,
    selectedWishlistId,
    setSelectedWishlistId,
}: FilterSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                onClose();
            }
        };

        if (isOpen) {
            // Add slight delay to prevent immediate close on open click
            const timer = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timer);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Toggle capability filter
    const toggleCapability = (capability: string) => {
        if (byCapabilityFilter.includes(capability)) {
            setByCapabilityFilter(byCapabilityFilter.filter(c => c !== capability));
        } else {
            setByCapabilityFilter([...byCapabilityFilter, capability]);
        }
    };

    // Toggle persona filter
    const togglePersona = (persona: string) => {
        if (personaFilter.includes(persona)) {
            setPersonaFilter(personaFilter.filter(p => p !== persona));
        } else {
            setPersonaFilter([...personaFilter, persona]);
        }
    };

    // Calculate active filter count
    const activeFilterCount = byCapabilityFilter.length + personaFilter.length + (showFavoritesOnly ? 1 : 0);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="filter-sidebar-backdrop"
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(4px)",
                    WebkitBackdropFilter: "blur(4px)",
                    zIndex: 100000,

                }}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className="filter-sidebar-enter"
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    height: "100vh",
                    width: "380px",
                    minWidth: "380px",
                    maxWidth: "90vw",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "-12px 0 48px rgba(0, 0, 0, 0.15), -4px 0 16px rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    borderRight: "none",
                    borderBottomLeftRadius: "30px",
                    zIndex: 100001,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Header with Clear All */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "24px 28px 20px",
                        borderBottom: "2px solid transparent",
                        backgroundImage: "linear-gradient(white, white), linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        flexShrink: 0,
                        position: "relative",
                    }}
                >
                    {/* Gradient accent line */}
                    <div
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2px",
                            background: "linear-gradient(90deg, rgba(99, 102, 241, 0.5) 0%, rgba(168, 85, 247, 0.5) 50%, rgba(236, 72, 153, 0.5) 100%)",
                            opacity: 0.6,
                        }}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <h2
                            className="gradient-text"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "20px",
                                fontWeight: 700,
                                margin: 0,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Filters
                        </h2>
                        {activeFilterCount > 0 && (
                            <span
                                className="filter-badge-pulse"
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    color: "#FFFFFF",
                                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                                    borderRadius: "16px",
                                    padding: "4px 10px",
                                    minWidth: "24px",
                                    textAlign: "center",
                                    boxShadow: "0 2px 8px rgba(99, 102, 241, 0.3)",
                                }}
                            >
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {/* Clear All Button - Always Visible */}
                        <button
                            onClick={onClearAll}
                            disabled={!hasActiveFilters}
                            className="filter-clear-btn"
                            style={{
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: hasActiveFilters ? "#EF4444" : "#9CA3AF",
                                background: hasActiveFilters ? "rgba(239, 68, 68, 0.08)" : "transparent",
                                border: hasActiveFilters ? "1px solid rgba(239, 68, 68, 0.2)" : "1px solid transparent",
                                cursor: hasActiveFilters ? "pointer" : "not-allowed",
                                padding: "7px 14px",
                                borderRadius: "8px",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={(e) => {
                                if (hasActiveFilters) {
                                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.2)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = hasActiveFilters ? "rgba(239, 68, 68, 0.08)" : "transparent";
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            Clear All
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                border: "1px solid rgba(107, 114, 128, 0.15)",
                                backgroundColor: "rgba(243, 244, 246, 0.5)",
                                cursor: "pointer",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(107, 114, 128, 0.1)";
                                e.currentTarget.style.transform = "rotate(90deg) scale(1.05)";
                                e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "rgba(243, 244, 246, 0.5)";
                                e.currentTarget.style.transform = "rotate(0deg) scale(1)";
                                e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.15)";
                            }}
                            aria-label="Close filters"
                        >
                            <X size={20} color="#6B7280" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Filter Content */}
                <div
                    className="filter-sidebar-scroll"
                    style={{
                        flex: "1 1 auto",
                        overflowY: "auto",
                        overflowX: "hidden",
                        padding: "24px 28px 28px",
                        background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(249, 250, 251, 0.4) 100%)",
                        minHeight: 0,
                    }}
                >
                    {/* Favorites Filter Section */}
                    {/* <div style={{ marginBottom: "24px" }}>
                        <button
                            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                padding: "14px 16px",
                                borderRadius: "12px",
                                cursor: "pointer",
                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                background: showFavoritesOnly
                                    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)"
                                    : "rgba(249, 250, 251, 0.5)",
                                border: showFavoritesOnly
                                    ? "2px solid rgba(239, 68, 68, 0.4)"
                                    : "2px solid rgba(229, 231, 235, 0.8)",
                                boxShadow: showFavoritesOnly
                                    ? "0 4px 12px rgba(239, 68, 68, 0.15)"
                                    : "none",
                            }}
                        >
                            <Heart
                                size={20}
                                fill={showFavoritesOnly ? "#EF4444" : "none"}
                                stroke={showFavoritesOnly ? "#EF4444" : "#6B7280"}
                                strokeWidth={2}
                                style={{ marginRight: "12px" }}
                            />
                            <span
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: showFavoritesOnly ? "#DC2626" : "#374151",
                                    flex: 1,
                                    textAlign: "left",
                                }}
                            >
                                Favorites Only
                            </span>
                            {favoritesCount > 0 && (
                                <span
                                    style={{
                                        fontFamily: "Poppins, sans-serif",
                                        fontSize: "12px",
                                        fontWeight: 700,
                                        color: showFavoritesOnly ? "#EF4444" : "#9CA3AF",
                                        backgroundColor: showFavoritesOnly
                                            ? "rgba(239, 68, 68, 0.15)"
                                            : "rgba(156, 163, 175, 0.1)",
                                        padding: "4px 10px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {favoritesCount}
                                </span>
                            )}
                        </button>
                    </div> */}

                    {/* Wishlists Filter Section */}
                    <WishlistsFilterSection
                        selectedWishlistId={selectedWishlistId}
                        setSelectedWishlistId={setSelectedWishlistId}
                    />

                    {/* Capability Filter Section */}
                    <div style={{ marginBottom: "32px" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#6B7280",
                                marginBottom: "14px",
                                textTransform: "uppercase",
                                letterSpacing: "1.2px",
                                paddingLeft: "2px",
                            }}
                        >
                            Capability
                        </label>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                width: "100%",
                            }}
                        >
                            {allByCapabilities.map((capability) => {
                                const count = byCapabilityCounts[capability] || 0;
                                const isSelected = byCapabilityFilter.includes(capability);
                                return (
                                    <label
                                        key={capability}
                                        className="filter-item"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "11px 14px",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            background: isSelected
                                                ? "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)"
                                                : "rgba(249, 250, 251, 0.5)",
                                            border: isSelected ? "1.5px solid rgba(59, 130, 246, 0.4)" : "1.5px solid rgba(229, 231, 235, 0.8)",
                                            boxShadow: isSelected ? "0 2px 8px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)" : "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "rgba(249, 250, 251, 1)";
                                                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                                e.currentTarget.style.borderColor = "rgba(209, 213, 219, 1)";
                                            } else {
                                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "rgba(249, 250, 251, 0.5)";
                                                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.6)";
                                                e.currentTarget.style.borderColor = "rgba(229, 231, 235, 0.8)";
                                            } else {
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                            }
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleCapability(capability)}
                                            style={{
                                                display: "none",
                                            }}
                                        />
                                        {/* Custom Checkbox */}
                                        <div
                                            className="filter-checkbox"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "6px",
                                                border: isSelected ? "2px solid #3B82F6" : "2px solid #D1D5DB",
                                                background: isSelected
                                                    ? "linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)"
                                                    : "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "12px",
                                                flexShrink: 0,
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                boxShadow: isSelected ? "0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3)" : "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
                                            }}
                                        >
                                            {isSelected && (
                                                <Check size={13} color="#FFFFFF" strokeWidth={3} className="checkbox-check" />
                                            )}
                                        </div>
                                        <span
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "13.5px",
                                                color: isSelected ? "#1E40AF" : "#374151",
                                                fontWeight: 500, // Fixed font weight to prevent layout shift
                                                flex: 1,
                                                letterSpacing: "-0.01em",
                                                transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            }}
                                        >
                                            {capability}
                                        </span>
                                        {count > 0 && (
                                            <span
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    fontSize: "12px",
                                                    color: isSelected ? "#3B82F6" : "#9CA3AF",
                                                    fontWeight: 700,
                                                    backgroundColor: isSelected ? "rgba(59, 130, 246, 0.12)" : "rgba(156, 163, 175, 0.1)",
                                                    padding: "2px 8px",
                                                    borderRadius: "8px",
                                                    minWidth: "26px",
                                                    textAlign: "center",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                }}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Persona Filter Section */}
                    <div style={{ marginBottom: "32px" }}>
                        <label
                            style={{
                                display: "block",
                                fontFamily: "Poppins, sans-serif",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: "#6B7280",
                                marginBottom: "14px",
                                textTransform: "uppercase",
                                letterSpacing: "1.2px",
                                paddingLeft: "2px",
                            }}
                        >
                            Persona
                        </label>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                width: "100%",
                            }}
                        >
                            {allPersonas.map((persona) => {
                                const count = agents.filter(
                                    (agent) => agent.persona === persona
                                ).length;
                                const isSelected = personaFilter.includes(persona);
                                return (
                                    <label
                                        key={persona}
                                        className="filter-item"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "11px 14px",
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            background: isSelected
                                                ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)"
                                                : "rgba(249, 250, 251, 0.5)",
                                            border: isSelected ? "1.5px solid rgba(16, 185, 129, 0.4)" : "1.5px solid rgba(229, 231, 235, 0.8)",
                                            boxShadow: isSelected ? "0 2px 8px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)" : "inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "rgba(249, 250, 251, 1)";
                                                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                                e.currentTarget.style.borderColor = "rgba(209, 213, 219, 1)";
                                            } else {
                                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.background = "rgba(249, 250, 251, 0.5)";
                                                e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.6)";
                                                e.currentTarget.style.borderColor = "rgba(229, 231, 235, 0.8)";
                                            } else {
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                                            }
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => togglePersona(persona)}
                                            style={{
                                                display: "none",
                                            }}
                                        />
                                        {/* Custom Checkbox */}
                                        <div
                                            className="filter-checkbox"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "6px",
                                                border: isSelected ? "2px solid #10B981" : "2px solid #D1D5DB",
                                                background: isSelected
                                                    ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                                                    : "#FFFFFF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginRight: "12px",
                                                flexShrink: 0,
                                                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                boxShadow: isSelected ? "0 2px 8px rgba(16, 185, 129, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.3)" : "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
                                            }}
                                        >
                                            {isSelected && (
                                                <Check size={13} color="#FFFFFF" strokeWidth={3} className="checkbox-check" />
                                            )}
                                        </div>
                                        <span
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "13.5px",
                                                color: isSelected ? "#065F46" : "#374151",
                                                fontWeight: 500, // Fixed font weight to prevent layout shift
                                                flex: 1,
                                                letterSpacing: "-0.01em",
                                                transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                            }}
                                        >
                                            {persona}
                                        </span>
                                        {count > 0 && (
                                            <span
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    fontSize: "12px",
                                                    color: isSelected ? "#10B981" : "#9CA3AF",
                                                    fontWeight: 700,
                                                    backgroundColor: isSelected ? "rgba(16, 185, 129, 0.12)" : "rgba(156, 163, 175, 0.1)",
                                                    padding: "2px 8px",
                                                    borderRadius: "8px",
                                                    minWidth: "26px",
                                                    textAlign: "center",
                                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                }}
                                            >
                                                {count}
                                            </span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
