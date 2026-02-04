"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Combined Hero and Content Section */}
      <section
        className="relative overflow-hidden py-24"
        style={{
          background: "linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 20%, rgba(255, 255, 255, 1) 40%)",
          position: "relative",
          paddingTop: "200px",
        }}
      >
        {/* Grid Lines Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1420px",
            height: "100%",
            zIndex: 0,
            pointerEvents: "none",
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            opacity: 0.3,
            animation: "gridPulse 4s ease-in-out infinite",
          }}
        />
        <style jsx>{`
          @keyframes gridPulse {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.4;
            }
          }
        `}</style>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Two-Column Layout */}
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              gap: "10px",
              marginBottom: "80px",
              alignItems: "flex-start",
              maxWidth: "1200px",
              margin: "0 auto 80px auto",
            }}
          >
            {/* Left Column - Contact Information */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Headline - Aligned with arrow and text */}
              <h1
                style={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "72px",
                  fontStyle: "normal",
                  fontWeight: 300,
                  lineHeight: "120%",
                  marginBottom: "72px",
                  marginTop: 0,
                  maxWidth: "540px",
                  paddingBottom: "0",
                }}
              >
                Let's get in touch
              </h1>

              {/* Sub-headline */}
              <p
                style={{
                  color: "#000",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "32px",
                  marginBottom: "48px",
                  marginTop: 0,
                }}
              >
                Don't be afraid to say hello to us!
              </p>

              {/* Contact Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {/* Email */}
                <div>
                  <p
                    style={{
                      color: "#6B7280",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    Email
                  </p>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                    }}
                  >
                    hello@crayondata.ai
                  </p>
                </div>

                {/* Singapore Office */}
                <div>
                  <p
                    style={{
                      color: "#6B7280",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    Singapore Office
                  </p>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      marginBottom: "8px",
                    }}
                  >
                    18 Cross Street, #02-101<br />
                    Singapore 048423
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      textDecoration: "underline",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    See on Google Map
                    <ExternalLink size={14} />
                  </a>
                </div>

                {/* India Office */}
                <div>
                  <p
                    style={{
                      color: "#6B7280",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      marginBottom: "8px",
                    }}
                  >
                    India Office
                  </p>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      marginBottom: "8px",
                    }}
                  >
                    Awfis Space Solutions, 7th Floor,<br />
                    RAR Technopolis, 4/293, OMR,<br />
                    Perungudi, Chennai, TN 600096
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "20px",
                      textDecoration: "underline",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    See on Google Map
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
              {/* Spacer to align baseline of h1 bottom line with paragraph baseline */}
              <div style={{ height: "120px", flexShrink: 0 }} />
              {/* Introductory Text with Arrow - Aligned with h1 baseline */}
              <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "48px", marginTop: 0 }}>
                <svg
                  width="72"
                  height="24"
                  viewBox="0 0 72 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    d="M0 12H70M70 12L62 4M70 12L62 20"
                    stroke="#1A1A1A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p
                  style={{
                    color: "#1A1A1A",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "24px",
                    margin: 0,
                  }}
                >
                  Have an idea or challenge? Tell us about it, and our sales accelerator team will reach out.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    backgroundColor: "#1A1A1A",
                    borderRadius: "0",
                    padding: "32px",
                    minHeight: "540px",
                    marginTop: "16px",
                  }}
                >
                  {/* Form Title */}
                  <h2
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Poppins",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "32px",
                      marginBottom: "32px",
                    }}
                  >
                    Contact
                  </h2>

                  {/* Form Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "16px" }}>
                      <div>
                        <input
                          type="text"
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) => {
                            handleChange(e);
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 0",
                            backgroundColor: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#FFFFFF",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "20px",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)";
                            e.target.style.color = "#FFFFFF";
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => {
                            handleChange(e);
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 0",
                            backgroundColor: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#FFFFFF",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "20px",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)";
                            e.target.style.color = "#FFFFFF";
                          }}
                        />
                      </div>
                    </div>

                    {/* Phone and Subject Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "16px" }}>
                      <div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={(e) => {
                            handleChange(e);
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 0",
                            backgroundColor: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#FFFFFF",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "20px",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)";
                            e.target.style.color = "#FFFFFF";
                          }}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={(e) => {
                            handleChange(e);
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          style={{
                            width: "100%",
                            padding: "12px 0",
                            backgroundColor: "transparent",
                            border: "none",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                            color: "#FFFFFF",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 400,
                            lineHeight: "20px",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderBottomColor = "#FFFFFF";
                            e.target.style.color = "#FFFFFF";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)";
                            e.target.style.color = "#FFFFFF";
                          }}
                        />
                      </div>
                    </div>

                    {/* Message Textarea */}
                    <div>
                      <textarea
                        name="message"
                        placeholder="What would you like to explore?"
                        value={formData.message}
                        onChange={handleChange}
                        rows={8}
                        style={{
                          width: "100%",
                          padding: "12px 0",
                          minHeight: "200px",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                          color: "#FFFFFF",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "20px",
                          outline: "none",
                          resize: "none",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderBottomColor = "#FFFFFF";
                          e.target.style.color = "#FFFFFF";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderBottomColor = "rgba(255, 255, 255, 0.3)";
                          e.target.style.color = "#FFFFFF";
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          e.target.style.borderBottomColor = "#FFFFFF";
                          e.target.style.color = "#FFFFFF";
                        }}
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "16px 24px",
                        backgroundColor: "#FFC334",
                        color: "#000",
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "24px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginTop: "8px",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
