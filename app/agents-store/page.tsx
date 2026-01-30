"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Paperclip, Settings, ChevronDown, Mic, ArrowUp } from "lucide-react";

export default function AgentsStorePage() {
  const [inputValue, setInputValue] = useState("");
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Explore");
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) {
        setIsModeDropdownOpen(false);
      }
    };

    if (isModeDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModeDropdownOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Background Image */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "url('/img/agents-store-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* New Feature Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                backgroundColor: "#3b82f6",
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: "12px",
                lineHeight: "20px",
              }}
            >
              New
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontWeight: 400,
                cursor: "pointer",
              }}
            >
              <span>Tangram AI Agent Store V1.0</span>
              <ArrowRight size={16} />
            </div>
          </div>

          {/* Main Title */}
          <h1
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "40px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              marginBottom: "8px",
              whiteSpace: "nowrap",
            }}
          >
            The One-Stop Agent Store.
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: "#FCFBF8",
              fontFamily: "Poppins",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              maxWidth: "600px",
              marginBottom: "48px",
            }}
          >
            Discover. Try. Deploy.
          </p>

          {/* Chat Input Component */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              backgroundColor: "#1a1a1a",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Input Field */}
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask, explore, build AI agents in real time"
              style={{
                width: "100%",
                minHeight: "120px",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontFamily: "Poppins",
                fontSize: "16px",
                lineHeight: "24px",
                resize: "none",
                padding: "0",
              }}
            />

            {/* Control Bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "16px",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Left Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontWeight: 400,
                    padding: "0",
                  }}
                >
                  <Paperclip size={16} />
                  <span>Attach</span>
                </button>
                <div ref={modeDropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#FFFFFF",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: 400,
                      cursor: "pointer",
                      backgroundColor: "transparent",
                      border: "none",
                      padding: "0",
                    }}
                  >
                    <Settings size={16} />
                    <span>{selectedMode}</span>
                    <ChevronDown size={16} />
                  </button>
                  {isModeDropdownOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        marginTop: "8px",
                        backgroundColor: "#2a2a2a",
                        borderRadius: "8px",
                        padding: "8px 0",
                        minWidth: "120px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                        zIndex: 1000,
                      }}
                    >
                      <button
                        onClick={() => {
                          setSelectedMode("Explore");
                          setIsModeDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 16px",
                          color: selectedMode === "Explore" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMode !== "Explore") {
                            (e.target as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                      >
                        Explore
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMode("Create");
                          setIsModeDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 16px",
                          color: selectedMode === "Create" ? "#FFFFFF" : "rgba(255, 255, 255, 0.7)",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: 400,
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedMode !== "Create") {
                            (e.target as HTMLButtonElement).style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                        }}
                      >
                        Create
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <button
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Voice input"
                  aria-label="Use voice input"
                >
                  <Mic size={16} />
                </button>
                <button
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    cursor: "pointer",
                    padding: "0",
                  }}
                >
                  <ArrowUp size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
