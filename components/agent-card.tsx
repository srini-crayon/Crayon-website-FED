import Link from "next/link"
import Image from "next/image"
import { getAgentDetailHref } from "@/app/agents/[id]/types"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Heart } from "lucide-react"
import { useWishlistsStore } from "../lib/store/wishlists.store"
import { useAuthStore } from "../lib/store/auth.store"
import { WishlistPickerModal } from "./wishlist-picker-modal"

interface AgentCardProps {
  id: string
  title: string
  description: string
  badges: Array<{ label: string; variant?: "default" | "primary" | "secondary" | "outline" }>
  tags: string[]
  assetType?: string
  demoPreview?: string
  wishlistId?: string // Optional: if provided, clicking heart removes from this specific wishlist
  onRemoveFromWishlist?: (agentId: string) => void // Optional: callback for removing from wishlist
  hideWishlistIcon?: boolean // Optional: if true, hide the wishlist icon
}

export function AgentCard({ id, title, description, tags, assetType, demoPreview, wishlistId, onRemoveFromWishlist, hideWishlistIcon }: AgentCardProps) {
  // Determine badge color based on assetType
  const badgeColor = assetType === "Solution"
    ? { bg: "#FB923C", text: "white" } // Orange for Solution
    : { bg: "#10B981", text: "white" }; // Green for Agent

  const [visibleTags, setVisibleTags] = useState<string[]>([])
  const [overflowCount, setOverflowCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Wishlists functionality
  const { isInAnyWishlist, loadAllWishlists, isInWishlist } = useWishlistsStore()
  const { isAuthenticated } = useAuthStore()
  const isAgentFavorite = wishlistId ? isInWishlist(wishlistId, id) : isInAnyWishlist(id)

  useEffect(() => {
    if (!tags || tags.length === 0 || !tagsContainerRef.current) {
      setVisibleTags([])
      setOverflowCount(0)
      return
    }

    const container = tagsContainerRef.current
    const containerWidth = container.offsetWidth
    let totalWidth = 0
    const visible: string[] = []
    let overflow = 0

    // Estimate width: each tag is max 155px + 4px gap, +X pill is ~30px
    const tagMaxWidth = 155
    const gap = 4
    const plusPillWidth = 30

    for (let i = 0; i < tags.length; i++) {
      const tagWidth = Math.min(tagMaxWidth, tags[i].length * 8 + 18) // Rough estimate
      const wouldFit = totalWidth + tagWidth + (i > 0 ? gap : 0) <= containerWidth - plusPillWidth - gap

      if (wouldFit) {
        visible.push(tags[i])
        totalWidth += tagWidth + (i > 0 ? gap : 0)
      } else {
        overflow = tags.length - i
        break
      }
    }

    // If all tags fit, show them all
    if (visible.length === tags.length) {
      setVisibleTags(tags)
      setOverflowCount(0)
    } else {
      setVisibleTags(visible)
      setOverflowCount(overflow)
    }
  }, [tags])

  const detailHref = getAgentDetailHref(id, assetType)

  return (
    <>
      <Link href={detailHref} scroll>
        <Card
          className="agent-card-enhanced flex flex-col overflow-hidden bg-white p-0 w-full !border-0 cursor-pointer"
          style={{
            height: "400px",
            maxWidth: "442px",
            borderRadius: "0px",
            boxShadow: "none",
            border: "none",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Section */}
          <div
            className="relative bg-gray-100 overflow-hidden flex-shrink-0 w-full"
            style={{
              height: "220px",
              border: "1px solid #E5E7EB",
              minHeight: "220px",
              maxHeight: "220px",
              flexShrink: 0,
            }}
          >
            {/* Mask Image - Base Layer */}
            <div
              className="absolute inset-0 pointer-events-none w-full h-full"
              style={{
                zIndex: 1,
              }}
            >
              <Image
                src="/Mask group.png"
                alt=""
                fill
                className="object-cover"
                unoptimized
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>

            {/* Card Image - On Top of Mask */}
            <div
              className="absolute"
              style={{
                width: "calc(100% - 22.32px)",
                height: "202.04px",
                maxWidth: "419.68px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 2,
              }}
            >
              {demoPreview ? (
                <Image
                  src={demoPreview}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                  onError={(e) => {
                    // Fallback to sample image if demo preview fails
                    const target = e.target as HTMLImageElement;
                    if (target.src !== "/Sample_image_agent.png") {
                      target.src = "/Sample_image_agent.png";
                    }
                  }}
                />
              ) : (
                <Image
                  src="/Sample_image_agent.png"
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
            </div>

            {/* Favorite Heart Button - Only show for authenticated users and if not hidden */}
            {isAuthenticated && !hideWishlistIcon && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // If in wishlist detail page, remove from wishlist directly
                  if (wishlistId && onRemoveFromWishlist && isAgentFavorite) {
                    onRemoveFromWishlist(id)
                  } else {
                    // Otherwise, open picker modal
                    setIsPickerOpen(true)
                  }
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full transition-opacity duration-200 hover:opacity-80"
                style={{
                  zIndex: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={
                  wishlistId && isAgentFavorite 
                    ? "Remove from wishlist" 
                    : isAgentFavorite 
                    ? "Manage wishlists" 
                    : "Add to wishlist"
                }
              >
                <Heart
                  size={16}
                  fill={isAgentFavorite ? "#ef4444" : "none"}
                  stroke={isAgentFavorite ? "#ef4444" : "#9ca3af"}
                  strokeWidth={1.5}
                />
              </button>
            )}

          </div>

          {/* Content Section */}
          <CardContent
            className="flex flex-col gap-4 flex-1 w-full !px-0"
            style={{
              padding: "0 16px 16px 16px",
              minHeight: "162px",
              flex: "1 1 auto",
            }}
          >
            {/* Title with Badge — smooth crossfade between solid and gradient text on hover */}
            <div className="flex items-center justify-between gap-2" style={{ paddingTop: "16px" }}>
              <h3
                className="line-clamp-2 flex-1 relative overflow-hidden"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "normal",
                }}
              >
                {/* Solid color layer — fades out on hover */}
                <span
                  className="transition-opacity duration-300 ease-out"
                  style={{
                    color: "#101828",
                    opacity: isHovered ? 0 : 1,
                  }}
                >
                  {title}
                </span>
                {/* Gradient layer — fades in on hover (overlaid for smooth transition) */}
                <span
                  className="absolute inset-0 transition-opacity duration-300 ease-out pointer-events-none line-clamp-2"
                  style={{
                    background: "linear-gradient(90deg, #0013A2 0%, #D00004 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    opacity: isHovered ? 1 : 0,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "normal",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as any,
                    overflow: "hidden",
                  }}
                >
                  {title}
                </span>
              </h3>
              {assetType && (
                <span
                  className="flex-shrink-0"
                  style={{
                    display: "inline-flex",
                    maxWidth: "120px",
                    padding: "2px 6px",
                    flexDirection: "column",
                    alignItems: "center",
                    background: assetType === "Solution" ? "#FFF0E0" : "#A9E9C8",
                    fontSize: "12px",
                    color: assetType === "Solution" ? "#A75510" : "#06552C",
                  }}
                >
                  {assetType}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="line-clamp-2 flex-1" style={{
              marginTop: "2px",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "140%",
              color: "#344054",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {description}
            </p>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div
                ref={tagsContainerRef}
                className="flex mt-auto w-full overflow-hidden"
                style={{
                  height: "24px",
                  gap: "4px",
                  marginTop: "auto",
                }}
              >
                {visibleTags.map((tag, index) => (
                  <span
                    key={index}
                    ref={(el) => { tagRefs.current[index] = el }}
                    className="bg-white flex-shrink-0"
                    style={{
                      display: "flex",
                      maxWidth: "155px",
                      padding: "3px 9px",
                      flexDirection: "column",
                      alignItems: "center",
                      border: "1px solid #E5E7EB",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "12px",
                      lineHeight: "100%",
                      textAlign: "center",
                      color: "#667085",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {tag}
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span
                    className="bg-white flex-shrink-0"
                    style={{
                      display: "flex",
                      padding: "3px 9px",
                      flexDirection: "column",
                      alignItems: "center",
                      border: "1px solid #E5E7EB",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "12px",
                      lineHeight: "100%",
                      textAlign: "center",
                      color: "#667085",
                      whiteSpace: "nowrap",
                    }}
                  >
                    +{overflowCount}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Wishlist Picker Modal - Rendered via Portal outside Link - Only show for authenticated users */}
      {isAuthenticated && typeof document !== 'undefined' && createPortal(
        <WishlistPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          agentId={id}
          agentName={title}
        />,
        document.body
      )}
    </>
  )
}
