"use client"

import { Button } from "./ui/button"
import { Check } from "lucide-react"

interface UploadSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UploadSuccessModal({ isOpen, onClose }: UploadSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed z-50 flex items-center justify-center bg-black/40"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div 
        className="relative bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: "1020px",
          height: "584px",
          borderRadius: "12px",
          margin: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div 
          className="flex flex-col items-center justify-center px-6 py-12" 
          style={{ 
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Success Icon */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4" style={{ zIndex: 10, position: "relative" }}>
            <div 
              className="flex items-center justify-center rounded-full"
              style={{
                width: "128px",
                height: "128px",
                backgroundColor: "#10B981",
              }}
            >
              <Check className="text-white" strokeWidth={4} style={{ width: "64px", height: "64px" }} />
            </div>
            {/* Title */}
            <h1 
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "26px",
                lineHeight: "130%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
                margin: 0,
                textAlign: "center",
                zIndex: 20,
              }}
            >
              Agent Onboard Successfully!
            </h1>
          </div>

          {/* Description */}
          <p 
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#00092C",
              margin: 0,
              marginBottom: "32px",
              maxWidth: "600px",
            }}
          >
            A new agent has been successfully created and submitted for approval. You will be notified once the approval
            process is complete.
          </p>

          {/* Close Button */}
          <Button 
            onClick={onClose} 
            size="lg"
            style={{
              width: "200px",
              height: "44px",
              borderRadius: "4px",
              gap: "8px",
              paddingTop: "6px",
              paddingRight: "12px",
              paddingBottom: "6px",
              paddingLeft: "12px",
              background: "#181818",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

