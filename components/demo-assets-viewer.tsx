"use client"

/**
 * DemoAssetsViewer Component
 * 
 * Displays demo images for agents using image URLs from S3 bucket (agentsstore).
 * 
 * Features:
 * - Uses asset_url from demo_assets array as primary source
 * - Responsive gallery/carousel format with thumbnails
 * - Fallback handling for missing or invalid image URLs
 * - Server-side proxy for S3 images (no presigned URLs needed)
 * - Maintains design consistency with other image preview sections
 * 
 * Security:
 * - No AWS credentials exposed in frontend
 * - All S3 images fetched via server-side proxy (/api/image-proxy)
 * - Backend manages all AWS SDK interactions securely
 */

import { useState, useMemo, useEffect } from "react"
import clsx from "clsx"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Minimize2, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react"

type DemoAsset = { 
  demo_asset_link?: string
  demo_link?: string
  asset_url?: string // Primary field for S3 image URLs
  asset_file_path?: string
  demo_asset_name?: string // Used for alphabetical sorting
  demo_asset_type?: string
  demo_asset_id?: string
}

type DemoAssetsViewerProps = {
  assets: DemoAsset[]
  className?: string
  demoPreview?: string // Comma-separated URLs from demo_preview field
}

// S3 Configuration
const S3_BUCKET_NAME = 'agentsstore'
const S3_REGION = 'us-east-1'

/**
 * Normalizes and validates image URLs
 * Handles both S3 URLs and other URL formats
 * Uses server-side proxy to fetch S3 images (no presigned URLs needed)
 */
function normalizeImageUrl(url: string): string {
  if (!url || !url.trim()) return ""
  
  const trimmedUrl = url.trim()
  
  // Handle blob URLs (from File objects) - return as-is, no normalization needed
  if (trimmedUrl.startsWith('blob:')) {
    return trimmedUrl
  }
  
  // Handle YouTube and Vimeo URLs - return as-is, no normalization needed
  if (/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(trimmedUrl) ||
      /vimeo\.com\/(\d+)/i.test(trimmedUrl)) {
    return trimmedUrl
  }
  
  // If it's already a full URL (http/https)
  if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://')) {
    // If it's an S3 URL, route through our server-side proxy
    if (trimmedUrl.includes('.s3.') || trimmedUrl.includes('amazonaws.com')) {
      // Encode the URL properly and use our proxy
      // Use encodeURIComponent to handle special characters in URLs
      try {
        const encodedUrl = encodeURIComponent(trimmedUrl)
        return `/api/image-proxy?url=${encodedUrl}`
      } catch (e) {
        console.error('Failed to encode URL:', trimmedUrl, e)
        // Fallback: return the URL as-is if encoding fails
        return trimmedUrl
      }
    }
    // Other full URLs (GitHub, CDN, etc.) - use directly
    return trimmedUrl
  }
  
  // If it's a relative path or S3 key, construct S3 URL first, then proxy
  let s3Url: string
  if (trimmedUrl.startsWith('/')) {
    // Remove leading slash and construct S3 URL
    const key = trimmedUrl.substring(1)
    s3Url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`
  } else {
    // Assume it's an S3 key without leading slash
    s3Url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${trimmedUrl}`
  }
  
  // Route through server-side proxy (no presigned URL needed)
  const encodedUrl = encodeURIComponent(s3Url)
  return `/api/image-proxy?url=${encodedUrl}`
}

export default function DemoAssetsViewer({ assets, className, demoPreview }: DemoAssetsViewerProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set())
  
  // Reset errors when demoPreview or assets change
  useEffect(() => {
    setImageErrors(new Set())
  }, [demoPreview, assets])
  
  // Helper function to check if an asset is a video
  const isAssetVideo = (asset: DemoAsset): boolean => {
    const url = asset.asset_url || asset.asset_file_path || asset.demo_asset_link || asset.demo_link || ""
    const assetName = asset.demo_asset_name || ""
    
    // Check if it's YouTube or Vimeo
    const isYouTube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url)
    const isVimeo = /vimeo\.com\/(\d+)/i.test(url)
    
    // Check if it's a video file by extension in URL
    const isVideoFileInUrl = /\.(mp4|webm|ogg|mov)(\?|$|%3F|%2F)/i.test(url) || /\.(mp4|webm|ogg|mov)/i.test(url)
    
    // Check if demo_asset_name indicates video file
    const isVideoFileInName = assetName ? /\.(mp4|webm|ogg|mov)$/i.test(assetName) : false
    
    // Check if demo_asset_type indicates video
    const isVideoType = asset.demo_asset_type?.startsWith('video/') || false
    
    // Check if blob URL with video extension
    const isBlobVideo = url.startsWith('blob:') && assetName ? /\.(mp4|webm|ogg|mov)$/i.test(assetName) : false
    
    return Boolean(isYouTube || isVimeo || isVideoFileInUrl || isVideoFileInName || isVideoType || isBlobVideo)
  }
  
  // Helper function to check if a URL string is a video
  const isUrlVideo = (url: string): boolean => {
    if (!url) return false
    
    // Check if it's YouTube or Vimeo
    const isYouTube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url)
    const isVimeo = /vimeo\.com\/(\d+)/i.test(url)
    
    // Decode URL to handle encoded characters (e.g., %2E for .)
    let decodedUrl = url
    try {
      decodedUrl = decodeURIComponent(url)
    } catch (e) {
      // If decoding fails, use original URL
      decodedUrl = url
    }
    
    // Check if it's a video file by extension
    // Handle both direct URLs and proxy URLs (e.g., /api/image-proxy?url=...cxov2.mp4)
    // Check both original and decoded URLs
    const isVideoFile = /\.(mp4|webm|ogg|mov)(\?|$|%3F|%2F|&)/i.test(url) || 
                       /\.(mp4|webm|ogg|mov)(\?|$|&)/i.test(decodedUrl) ||
                       /\.(mp4|webm|ogg|mov)/i.test(url) ||
                       /\.(mp4|webm|ogg|mov)/i.test(decodedUrl)
    
    return isYouTube || isVimeo || isVideoFile
  }

  const normalized = useMemo(() => {
    const videoAssets: Array<{ url: string; asset: DemoAsset }> = []
    const imageAssets: Array<{ url: string; asset: DemoAsset }> = []
    const addedUrls = new Set<string>() // Track normalized URLs to avoid duplicates
    const addedOriginalUrls = new Set<string>() // Track original URLs to avoid duplicates across sources
    
    // Helper function to normalize and convert GitHub URLs
    const normalizeAndConvert = (url: string): string => {
      if (!url) return ""
      let normalized = normalizeImageUrl(url)
      
      // Convert GitHub raw URLs to jsDelivr CDN to avoid rate limits
      if (normalized.startsWith('https://raw.githubusercontent.com/')) {
        normalized = normalized.replace(
          'https://raw.githubusercontent.com/',
          'https://cdn.jsdelivr.net/gh/'
        ).replace('/main/', '@main/').replace('/master/', '@master/')
      }
      
      return normalized
    }
    
    // Process assets array - separate videos and images
    const sortedAssets = [...(assets || [])].sort((a, b) => {
      const nameA = (a.demo_asset_name || '').toLowerCase()
      const nameB = (b.demo_asset_name || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })
    
    sortedAssets.forEach(a => {
      // Priority: asset_url (primary) > asset_file_path > demo_asset_link > demo_link
      // Using asset_url as the primary source for demo images from S3
      const originalUrl = a.asset_url || a.asset_file_path || a.demo_asset_link || a.demo_link || ""
      
      if (originalUrl) {
        // Normalize the URL
        const normalizedUrl = normalizeAndConvert(originalUrl)
        
        // Check for duplicates using both original and normalized URLs
        // This prevents the same asset from appearing multiple times
        const originalUrlKey = originalUrl.trim().toLowerCase()
        const normalizedUrlKey = normalizedUrl.trim().toLowerCase()
        
        // Skip if we've already seen this original URL or normalized URL
        if (addedOriginalUrls.has(originalUrlKey) || addedUrls.has(normalizedUrlKey)) {
          return // Skip duplicate
        }
        
        if (normalizedUrl) {
          // Check if it's a video - use original URL for detection, but also check normalized URL
          const isVideo = isAssetVideo(a) || isUrlVideo(originalUrl) || isUrlVideo(normalizedUrl)
          
          // Separate videos and images
          if (isVideo) {
            videoAssets.push({ url: normalizedUrl, asset: a })
          } else {
            imageAssets.push({ url: normalizedUrl, asset: a })
          }
          
          // Mark both as added to prevent duplicates
          addedUrls.add(normalizedUrlKey)
          addedOriginalUrls.add(originalUrlKey)
        }
      }
    })
    
    // Process demo_preview if provided (comma-separated URLs)
    const previewVideos: string[] = []
    const previewImages: string[] = []
    
    if (demoPreview) {
      const rawUrls = demoPreview.split(',').map(url => url.trim()).filter(url => !!url)
      
      console.log('Processing demo_preview:', demoPreview)
      console.log('Raw URLs from demo_preview:', rawUrls)
      
      rawUrls.forEach(rawUrl => {
        // Normalize the URL
        const normalizedUrl = normalizeAndConvert(rawUrl)
        
        // Check for duplicates using both original and normalized URLs
        const originalUrlKey = rawUrl.trim().toLowerCase()
        const normalizedUrlKey = normalizedUrl.trim().toLowerCase()
        
        // Skip if we've already seen this URL (from assets array or previous demo_preview entries)
        if (addedOriginalUrls.has(originalUrlKey) || addedUrls.has(normalizedUrlKey)) {
          console.log('Skipping duplicate URL from demo_preview:', rawUrl)
          return // Skip duplicate
        }
        
        if (normalizedUrl) {
          // Separate videos and images from demo_preview
          if (isUrlVideo(rawUrl) || isUrlVideo(normalizedUrl)) {
            previewVideos.push(normalizedUrl)
          } else {
            previewImages.push(normalizedUrl)
          }
          
          // Mark both as added to prevent duplicates
          addedUrls.add(normalizedUrlKey)
          addedOriginalUrls.add(originalUrlKey)
        }
      })
      
      console.log('Preview videos after deduplication:', previewVideos.length)
      console.log('Preview images after deduplication:', previewImages.length)
    }
    
    // Combine: videos first, then images
    // Format: [video assets] + [preview videos] + [image assets] + [preview images]
    const allAssets: Array<{ url: string }> = []
    
    // Add videos first
    videoAssets.forEach(item => allAssets.push({ url: item.url }))
    previewVideos.forEach(url => allAssets.push({ url }))
    
    // Then add images
    imageAssets.forEach(item => allAssets.push({ url: item.url }))
    previewImages.forEach(url => allAssets.push({ url }))
    
    console.log('Video assets count:', videoAssets.length)
    console.log('Preview videos count:', previewVideos.length)
    console.log('Image assets count:', imageAssets.length)
    console.log('Preview images count:', previewImages.length)
    console.log('All normalized URLs (videos first, then images):', allAssets.map(a => a.url))
    
    // Return all valid URLs - videos first, then images
    return allAssets.filter(a => !!a.url)
  }, [assets, demoPreview])
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  
  // Navigation functions for expanded view
  const goToPrevious = () => {
    if (normalized.length > 0) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : normalized.length - 1))
    }
  }
  
  const goToNext = () => {
    if (normalized.length > 0) {
      setSelectedIndex((prev) => (prev < normalized.length - 1 ? prev + 1 : 0))
    }
  }
  
  // Handle keyboard navigation in expanded view
  useEffect(() => {
    if (!isOverlayOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (normalized.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : normalized.length - 1))
        }
      } else if (e.key === 'ArrowRight') {
        if (normalized.length > 0) {
          setSelectedIndex((prev) => (prev < normalized.length - 1 ? prev + 1 : 0))
        }
      } else if (e.key === 'Escape') {
        setIsOverlayOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOverlayOpen, normalized.length])

  const selected = normalized[selectedIndex]
  const selectedUrl = selected?.url || ""
  
  // Get the original asset to check file type
  // Find the asset by matching the URL since the normalized array is now sorted differently
  // We need to apply the same transformations (GitHub to jsDelivr conversion) as in the normalized useMemo
  const originalAsset = assets?.find(a => {
    const url = a.asset_url || a.asset_file_path || a.demo_asset_link || a.demo_link || ""
    if (!url) return false
    
    let normalizedUrl = normalizeImageUrl(url)
    
    // Apply the same GitHub to jsDelivr conversion as in the normalized useMemo
    if (normalizedUrl.startsWith('https://raw.githubusercontent.com/')) {
      normalizedUrl = normalizedUrl.replace(
        'https://raw.githubusercontent.com/',
        'https://cdn.jsdelivr.net/gh/'
      ).replace('/main/', '@main/').replace('/master/', '@master/')
    }
    
    return normalizedUrl === selectedUrl
  }) || null
  
  // Helper function to detect if URL is YouTube
  const isYouTubeUrl = (url: string): boolean => {
    return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i.test(url)
  }
  
  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    const regExp = /^.*(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regExp)
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return url
  }
  
  // Helper function to detect if URL is Vimeo
  const isVimeoUrl = (url: string): boolean => {
    return /vimeo\.com\/(\d+)/i.test(url)
  }
  
  // Helper function to convert Vimeo URL to embed URL
  const getVimeoEmbedUrl = (url: string): string => {
    const match = url.match(/vimeo\.com\/(\d+)/i)
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`
    }
    return url
  }
  
  const isYouTube = isYouTubeUrl(selectedUrl)
  const isVimeo = isVimeoUrl(selectedUrl)
  
  // Check if it's a video - handle both blob URLs and regular URLs
  const isVideo = /\.mp4($|\?)/i.test(selectedUrl) || 
                  selectedUrl.includes('video/') ||
                  originalAsset?.demo_asset_type?.startsWith('video/') ||
                  (selectedUrl.startsWith('blob:') && originalAsset?.demo_asset_name && /\.(mp4|webm|ogg|mov)$/i.test(originalAsset.demo_asset_name)) ||
                  isYouTube ||
                  isVimeo
  
  // Handle image load errors
  const handleImageError = (url: string) => {
    console.error('Failed to load image:', url)
    setImageErrors(prev => new Set(prev).add(url))
    setImageLoading(prev => {
      const next = new Set(prev)
      next.delete(url)
      return next
    })
  }
  
  const handleImageLoad = (url: string) => {
    setImageLoading(prev => {
      const next = new Set(prev)
      next.delete(url)
      return next
    })
  }
  
  const handleImageLoadStart = (url: string) => {
    setImageLoading(prev => new Set(prev).add(url))
  }

  return (
    <div className={clsx("w-full", className)}>
      {/* Large viewer */}
      <section 
        className="relative flex items-center justify-center overflow-hidden bg-black cursor-zoom-in p-2 w-full max-w-[716px]" 
        style={{ 
          borderRadius: '0px',
          backgroundImage: 'url(/img/agentimgbg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          aspectRatio: '716 / 402.75',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
        }}
        onClick={() => selectedUrl && setIsOverlayOpen(true)}
        title={selectedUrl ? "Click to expand" : undefined}
      >
        {/* Navigation buttons for main preview - only show if more than one asset */}
        {normalized.length > 1 && (
          <>
            {/* Left Navigation Button */}
            <Button
              size="icon"
              variant="outline"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white/90 hover:bg-white border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation()
                goToPrevious()
              }}
            >
              <ChevronLeft className="h-5 w-5 text-gray-900" />
            </Button>
            
            {/* Right Navigation Button */}
            <Button
              size="icon"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 bg-white/90 hover:bg-white border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
            >
              <ChevronRight className="h-5 w-5 text-gray-900" />
            </Button>
            
            {/* Asset counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {selectedIndex + 1} / {normalized.length}
            </div>
          </>
        )}
            {selectedUrl ? (
              isYouTube ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedUrl)}
                    className="w-full h-full max-w-full max-h-full"
                    style={{ 
                      borderRadius: '0px',
                      aspectRatio: '16/9',
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube video player"
                  />
                </div>
              ) : isVimeo ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <iframe
                    src={getVimeoEmbedUrl(selectedUrl)}
                    className="w-full h-full max-w-full max-h-full"
                    style={{ 
                      borderRadius: '0px',
                      aspectRatio: '16/9',
                    }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title="Vimeo video player"
                  />
                </div>
              ) : isVideo ? (
                <video
                  src={selectedUrl}
                  className="object-contain w-full h-full"
                  style={{ 
                    borderRadius: '0px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                  }}
                  controls
                  autoPlay
                  muted
                  playsInline
                  onError={() => handleImageError(selectedUrl)}
                />
              ) : imageErrors.has(selectedUrl) ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                  <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium mb-1">Failed to load image</p>
                  <p className="text-xs text-center opacity-75 mb-2">
                    {selectedUrl.includes('/api/image-proxy') 
                      ? 'The image proxy may be experiencing issues. Please check the server logs.'
                      : 'Image may not be accessible or the URL is invalid.'}
                  </p>
                  <p className="text-xs opacity-50 break-all px-2 text-center font-mono">
                    {selectedUrl.length > 80 ? `${selectedUrl.substring(0, 80)}...` : selectedUrl}
                  </p>
                  <button
                    onClick={() => {
                      // Try reloading the image
                      setImageErrors(prev => {
                        const next = new Set(prev)
                        next.delete(selectedUrl)
                        return next
                      })
                      // Force reload by updating the key
                      const img = document.querySelector(`img[src="${selectedUrl}"]`) as HTMLImageElement
                      if (img) {
                        img.src = selectedUrl + '?retry=' + Date.now()
                      }
                    }}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {imageLoading.has(selectedUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedUrl}
                    alt={assets[selectedIndex]?.demo_asset_name || "Demo asset"}
                    className="object-contain w-full h-full"
                    style={{ 
                      borderRadius: '0px',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      const failedUrl = target.src || selectedUrl
                      console.error('Image load error for:', failedUrl, e)
                      console.error('Error details:', {
                        url: failedUrl,
                        naturalWidth: target.naturalWidth,
                        naturalHeight: target.naturalHeight,
                        complete: target.complete,
                        src: target.src,
                        currentSrc: target.currentSrc
                      })
                      handleImageError(failedUrl)
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', selectedUrl)
                      handleImageLoad(selectedUrl)
                    }}
                    onLoadStart={() => {
                      console.log('Image load started:', selectedUrl)
                      handleImageLoadStart(selectedUrl)
                    }}
                    loading="eager"
                  />
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-muted-foreground">No demo previews available</p>
              </div>
            )}
      </section>

      {/* Overlay dialog - Centered with white background */}
      {isOverlayOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 animate-in fade-in duration-300 overflow-y-auto scrollbar-hide"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsOverlayOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300 my-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative w-full flex items-center justify-center overflow-hidden flex-1" style={{ minHeight: '80vh' }}>
            {/* Left Navigation Button */}
            {normalized.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous image"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </Button>
            )}
            
            {/* Right Navigation Button */}
            {normalized.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next image"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </Button>
            )}
            
            {/* Overlay controls: minimize + close */}
            <div className="absolute right-2 top-2 z-20 flex items-center gap-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-lg shadow-sm" 
                aria-label="Minimize" 
                onClick={() => setIsOverlayOpen(false)}
              >
                <Minimize2 className="h-4 w-4 text-gray-900" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-lg shadow-sm" 
                aria-label="Close" 
                onClick={() => setIsOverlayOpen(false)}
              >
                <X className="h-4 w-4 text-gray-900" />
              </Button>
            </div>
            
            {/* Image counter */}
            {normalized.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full shadow-md">
                <span className="text-xs font-medium text-gray-900">
                  {selectedIndex + 1} / {normalized.length}
                </span>
              </div>
            )}
            {selectedUrl && (isYouTube ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <iframe
                  src={getYouTubeEmbedUrl(selectedUrl)}
                  className="w-full h-full max-w-full max-h-full"
                  style={{ 
                    borderRadius: '0px',
                    aspectRatio: '16/9',
                    minHeight: '400px',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube video player"
                />
              </div>
            ) : isVimeo ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <iframe
                  src={getVimeoEmbedUrl(selectedUrl)}
                  className="w-full h-full max-w-full max-h-full"
                  style={{ 
                    borderRadius: '0px',
                    aspectRatio: '16/9',
                    minHeight: '400px',
                  }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Vimeo video player"
                />
              </div>
            ) : /\.mp4($|\?)/i.test(selectedUrl) ? (
              <div className="w-full h-full flex items-center justify-center px-16">
                <video 
                  src={selectedUrl} 
                  className="max-h-full max-w-full w-auto h-auto object-contain" 
                  style={{ borderRadius: '0px' }}
                  controls 
                  autoPlay 
                  muted 
                  playsInline
                  onError={() => handleImageError(selectedUrl)}
                />
              </div>
            ) : imageErrors.has(selectedUrl) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400" style={{ borderRadius: '0px' }}>
                <svg className="h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Failed to load image</p>
                <p className="text-xs mt-2 opacity-75 max-w-md text-center">
                  The image from S3 bucket could not be loaded. Please check if the image URL is correct and accessible.
                </p>
                <p className="text-xs mt-1 opacity-50 text-center font-mono">
                  URL: {selectedUrl.substring(0, 60)}...
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center px-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedUrl} 
                  alt="expanded" 
                  className="max-h-full max-w-full w-auto h-auto object-contain"
                  style={{ borderRadius: '0px' }}
                  onError={(e) => {
                    console.error('Expanded image load error for:', selectedUrl, e)
                    handleImageError(selectedUrl)
                  }}
                  onLoad={() => {
                    console.log('Expanded image loaded successfully:', selectedUrl)
                    handleImageLoad(selectedUrl)
                  }}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


