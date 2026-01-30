"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import ChatDialog from "../../components/chat-dialog";
import { useAuthStore } from "../../lib/store/auth.store";
import { useToast } from "../../hooks/use-toast";
import { ContactSuccessModal } from "../../components/contact-success-modal";

export default function ContactPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Animation states
  const [isFormHovered, setIsFormHovered] = useState(false);
  const [isIllustrationHovered, setIsIllustrationHovered] = useState(false);

  // Typing animation state
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "How can we help?";

  // Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Hide cursor after typing is complete (after a short delay)
        setTimeout(() => {
          setShowCursor(false);
        }, 1500);
      }
    }, 80); // Typing speed in milliseconds

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const sessionId = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const requestBody = {
        company_name: "",
        email: formData.email.trim(),
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        message: formData.message.trim(),
        phone: formData.phone.trim() || "",
        session_id: sessionId,
        type: "contact",
        user_id: user?.user_id || "anonymous",
        user_type: user?.role || "client",
      };

      if (!requestBody.email || !formData.firstName.trim() || !requestBody.message) {
        toast({
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestBody.email)) {
        toast({
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting contact form:", requestBody);

      const response = await fetch("https://agents-store.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (response.ok && data.success) {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setIsSuccessModalOpen(true);
      } else {
        const errorMessage = data?.detail || data?.message || data?.error || `Server error: ${response.status} ${response.statusText}`;
        toast({
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Contact form submission error:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestBody: requestBody,
        });
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        description: error.message || "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-16"
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
              Contact
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
              Get in touch with our sales and support teams for demos, onboarding support, or product questions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(320px,1fr)] gap-10 items-center">
            {/* Illustration with hover animation */}
            <div
              className="flex justify-center lg:justify-start slide-in-left"
              onMouseEnter={() => setIsIllustrationHovered(true)}
              onMouseLeave={() => setIsIllustrationHovered(false)}
            >
              <img
                src="/Contact_image.png"
                alt="Support illustration"
                className="max-h-[420px] w-auto transition-all duration-500 ease-out"
                style={{
                  transform: isIllustrationHovered ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
                  filter: isIllustrationHovered ? 'drop-shadow(0 20px 40px rgba(0,0,0,0.15))' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))',
                }}
              />
            </div>

            {/* Form card with hover effect */}
            <div
              className="relative slide-in-right"
              onMouseEnter={() => setIsFormHovered(true)}
              onMouseLeave={() => setIsFormHovered(false)}
            >
              <div
                className="relative overflow-hidden transition-all duration-300"
                style={{
                  transform: isFormHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: isFormHovered
                    ? '0px 32px 80px rgba(15,23,42,0.12)'
                    : '0px 24px 65px rgba(15,23,42,0.08)',
                }}
              >
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 bg-[#FF9EB6] rounded-bl-[32px] rounded-tr-[32px] transition-all duration-300"
                  style={{
                    zIndex: -1,
                    opacity: isFormHovered ? 0.9 : 0.7,
                    transform: isFormHovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                {/* Background Mask Image */}
                <div
                  className="absolute inset-0 pointer-events-none w-full h-full"
                  style={{
                    zIndex: 0,
                  }}
                >
                  <Image
                    src="/Mask_img_contact.png"
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

                {/* Form Content */}
                <div
                  className="relative bg-white border border-dashed border-[#E4E4E7] p-6 sm:p-8"
                  style={{
                    zIndex: 1,
                    margin: "10px",
                    width: "calc(100% - 20px)",
                    height: "calc(100% - 20px)",
                  }}
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="stagger-item">
                        <Label
                          htmlFor="firstName"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "24px",
                            letterSpacing: "0%",
                            color: "#555555",
                          }}
                        >
                          First name *
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30 transition-all duration-200 hover:border-[#FF8CA0]/50"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#333",
                          }}
                        />
                      </div>
                      <div className="stagger-item">
                        <Label
                          htmlFor="lastName"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "24px",
                            letterSpacing: "0%",
                            color: "#555555",
                          }}
                        >
                          Last name
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30 transition-all duration-200 hover:border-[#FF8CA0]/50"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#333",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 stagger-item">
                        <Label
                          htmlFor="email"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "24px",
                            letterSpacing: "0%",
                            color: "#555555",
                          }}
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30 transition-all duration-200 hover:border-[#FF8CA0]/50"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "18px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#333",
                          }}
                        />
                      </div>
                    </div>

                    <div className="stagger-item">
                      <Label
                        htmlFor="phone"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#555555",
                        }}
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30 transition-all duration-200 hover:border-[#FF8CA0]/50"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "18px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#333",
                        }}
                      />
                    </div>

                    <div className="stagger-item">
                      <Label
                        htmlFor="message"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#555555",
                        }}
                      >
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Leave us a message..."
                        className="mt-2 min-h-[140px] bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30 transition-all duration-200 hover:border-[#FF8CA0]/50"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "18px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#333",
                        }}
                      />
                    </div>

                    <div className="pt-4 flex justify-end stagger-item">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-black hover:bg-black/90 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
                        style={{
                          width: "110px",
                          height: "42px",
                          borderRadius: "6px",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "24px",
                          letterSpacing: "0px",
                          verticalAlign: "middle",
                          color: "#FFFFFF",
                        }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending
                          </span>
                        ) : "Submit"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="create" />

      {/* Success Modal */}
      <ContactSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}

