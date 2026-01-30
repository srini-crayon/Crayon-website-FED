"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { ISVPartnerButton } from "./isv-partner-button"
import { WishlistPickerModal } from "./wishlist-picker-modal"
import { useAuthStore } from "../lib/store/auth.store"
import { useWishlistsStore } from "../lib/store/wishlists.store"
import { useModal } from "../hooks/use-modal"

interface AgentActionButtonsProps {
  agentId: string
  agentName?: string
  demoLink?: string
}

export function AgentActionButtons({ agentId, agentName, demoLink }: AgentActionButtonsProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { isInAnyWishlist, loadAllWishlists } = useWishlistsStore()
  const { openModal } = useModal()

  const isWishlisted = isInAnyWishlist(agentId)

  useEffect(() => {
    if (isAuthenticated) {
      loadAllWishlists()
    }
  }, [isAuthenticated, loadAllWishlists])

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      openModal("auth", { mode: "login", role: "client" })
      return
    }
    setIsPickerOpen(true)
  }

  return (
    <>
      <div style={{ marginTop: '42px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', width: '100%' }}>
        <ISVPartnerButton demoLink={demoLink} />
        <button
          onClick={handleWishlistClick}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "48px",
            height: "48px",
            padding: "0",
            backgroundColor: "#f3f4f6",
            color: "#111827",
            border: "1px solid #e5e7eb",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e5e7eb";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
          }}
        >
          <Heart 
            size={20} 
            fill={isWishlisted ? "#EF4444" : "none"} 
            stroke={isWishlisted ? "#EF4444" : "#111827"}
            strokeWidth={2}
          />
        </button>
      </div>
      <WishlistPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        agentId={agentId}
        agentName={agentName}
      />
    </>
  )
}
