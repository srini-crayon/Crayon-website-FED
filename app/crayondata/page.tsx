"use client";

import { useState, useEffect } from "react";
import ChatDialog from "../../components/chat-dialog";

export default function CrayondataPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Welcome to Crayon Data";

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowCursor(false);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  // Scroll animations with IntersectionObserver
  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 200 });
      } else {
        setTimeout(callback, 100);
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains("fade-in-section")) {
              entry.target.classList.add("fade-in-visible");
            } else if (entry.target.classList.contains("slide-in-left")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("slide-in-right")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("scale-in")) {
              entry.target.classList.add("scale-in-visible");
            } else if (entry.target.classList.contains("fade-in-blur")) {
              entry.target.classList.add("fade-in-blur-visible");
            } else if (entry.target.classList.contains("stagger-item")) {
              entry.target.classList.add("stagger-visible");
            }
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-16 flex-shrink-0 flex items-center justify-center min-h-screen"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #FFF1E5 0%, #FFF 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10 relative" style={{ zIndex: 1 }}>
          <div className="text-center space-y-4">
            <span
              className="inline-flex items-center justify-center uppercase tracking-wider scale-in"
              style={{
                display: "inline-flex",
                transform: "rotate(0.282deg)",
                padding: "4px 16px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                borderRadius: "50px",
                background: "#FFE4CC",
                color: "#A75510",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "140%",
              }}
            >
              Crayon Data
            </span>
            <h1
              style={{
                color: "var(--Interface-Color-Primary-900, #091917)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "52px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "52px",
                marginTop: "2px",
                marginBottom: "0",
                minHeight: "52px",
              }}
            >
              {typedText}
              <span
                style={{
                  opacity: showCursor ? 1 : 0,
                  transition: 'opacity 0.3s',
                  animation: showCursor ? 'blink 1s step-end infinite' : 'none',
                }}
              >
                |
              </span>
              <style jsx>{`
                @keyframes blink {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
              `}</style>
            </h1>
            <p
              className="fade-in-section"
              style={{
                color: "var(--Interface-Color-Primary-900, #091917)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
                marginTop: "4px",
              }}
            >
              Empowering businesses with intelligent data solutions and AI-driven insights.
            </p>
          </div>
        </div>
      </section>

      <div className="flex-grow"></div>

      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="create" />
    </div>
  );
}
