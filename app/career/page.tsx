"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ScrollToTopButton from "@/components/scroll-to-top-button";

export default function CareerPage() {
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());

  const toggleAccordion = (id: string) => {
    const newExpanded = new Set(expandedAccordions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccordions(newExpanded);
  };

  // Scroll animations
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
            } else if (entry.target.classList.contains("fade-in-blur")) {
              entry.target.classList.add("fade-in-blur-visible");
            } else if (entry.target.classList.contains("scale-in")) {
              entry.target.classList.add("scale-in-visible");
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
        ".fade-in-section, .fade-in-blur, .scale-in, .stagger-item"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .fade-in-blur, .scale-in, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Breadcrumb Section - consistent gap below header */}
      <section
        className="fade-in-section"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: "32px",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" style={{ color: "#6B7280", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage style={{ color: "#111827", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
                  Life At Crayon
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section - generous gap below nav, aligned two-column layout */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: "120px",
          paddingBottom: "64px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "80px",
          }}
        >
          {/* Left Side - Text Content */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "28px",
              alignItems: "flex-start",
            }}
          >
            {/* Section Label */}
            <div
              className="fade-in-section"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              LIFE AT CRAYON
            </div>

            {/* Main Heading */}
            <h1
              className="fade-in-blur"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
                willChange: "opacity, transform, filter",
              }}
            >
              Add Your Color to The Crayon Box
            </h1>

            {/* Subtitle */}
            <p
              className="fade-in-section"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              Crayons are a diverse and passionate bunch
            </p>

            {/* CTA Button - same style as Download Values PDF on Our Values */}
            <div className="fade-in-section">
              <Link
                href="/career#open-positions"
                className="fade-in-section"
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#111827",
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "21px",
                  textDecoration: "none",
                  borderRadius: "6px",
                  display: "inline-block",
                  width: "fit-content",
                  transition: "background-color 0.2s ease",
                  marginTop: "8px",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#111827";
                }}
              >
                JOIN US
              </Link>
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div
            className="fade-in-blur"
            style={{
              flex: "1 1 0%",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                aspectRatio: "4/3",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src="https://crayondata.ai/wp-content/uploads/Group-1171278399.svg"
                alt="Life at Crayon Illustration"
                fill
                style={{
                  objectFit: "contain",
                }}
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* We are Crayon Data Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "0", paddingBottom: "48px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Illustration */}
          <div
            className="fade-in-blur"
            style={{
              width: "100%",
              maxWidth: "500px",
              position: "relative",
              minHeight: "200px",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <Image
                src="https://crayondata.ai/wp-content/uploads/Layer_1.svg"
                alt="We are Crayon Data Illustration"
                fill
                style={{
                  objectFit: "contain",
                }}
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              textAlign: "center",
            }}
          >
            <div
              className="fade-in-section"
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              ABOUT US
            </div>
            <h2
              className="fade-in-blur"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                marginBottom: "24px",
                marginTop: 0,
                willChange: "opacity, transform, filter",
              }}
            >
              We are Crayon Data
            </h2>
            <p
              className="fade-in-section"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              Life in the Crayon Box is a little chaotic, largely dynamic, and keeps us on our toes! Crayons are a diverse and passionate bunch. Challenges excite us. Our mission drives us. good food, caffeine (for the most part) and youthful energy fuel us. You'll find Crayon Boxes in Singapore, Chennai and Dubai. But you'll find Crayons in every corner of the world
            </p>
          </div>
        </div>
      </section>

      {/* Be the CEO of Your Own Career Section */}
      <section id="open-positions" style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "80px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "row",
            gap: "64px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Side - Illustration */}
          <div
            className="fade-in-blur"
            style={{
              flex: "1 1 0%",
              position: "relative",
              minHeight: "500px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                minHeight: "400px",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <img
                src="https://crayondata.ai/wp-content/uploads/Group-1171278346-1.svg#1247"
                alt="Be the CEO of Your Own Career Illustration"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "32px",
            }}
          >
            <div
              className="fade-in-section"
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              CAREER GROWTH
            </div>
            <h3
              className="fade-in-section"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
              }}
            >
              Be the CEO of Your Own Career
            </h3>

            <div
              className="fade-in-section"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "24px",
                  backgroundColor: "#06B6D4",
                  flexShrink: 0,
                  marginTop: "4px",
                }}
              />
              <p
                style={{
                  color: "#06B6D4",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "120%",
                  margin: 0,
                }}
              >
                Join a brilliant team of problem-solvers
              </p>
            </div>

            <p
              className="fade-in-section"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              The world is full of problems and we've chosen some pretty interesting ones to solve. Here are some of things you can look forward to if you join our team
            </p>

            {/* Bullet Points */}
            <div className="fade-in-section" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                "World-class R&D and breakthrough methods to solve problems (psst, we have several patents under our belt, you could be a part of our next big idea!)",
                "Top-notch data and computer science talent",
                "Offices, clients and partners in over 10 countries. Our teams are incredibly diverse",
                "Opportunity to travel to and work on exciting projects around the world",
              ].map((point, index) => (
                <div key={index} style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "flex-start" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "#06B6D4",
                      marginTop: "8px",
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      margin: 0,
                    }}
                  >
                    {point}
                  </p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="fade-in-section" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
              {/* Accordion 1 */}
              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleAccordion("navigate")}
                  style={{
                    width: "100%",
                    padding: "20px",
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "20px",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  <span>+ Navigate your path to success</span>
                  <span style={{ fontSize: "24px", color: "#06B6D4" }}>
                    {expandedAccordions.has("navigate") ? "−" : "+"}
                  </span>
                </button>
                {expandedAccordions.has("navigate") && (
                  <div style={{ padding: "0 20px 20px 20px", backgroundColor: "#FFFFFF" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        "A growing community of mentors and learners",
                        "Structured goals for a clear view of your career path",
                        "Regular demo days, hackathons and external events to showcase your talent",
                        "The opportunity to move across teams to build your experience and skillsets",
                      ].map((item, index) => (
                        <div key={index} style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "flex-start" }}>
                          <div
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: "#06B6D4",
                              marginTop: "8px",
                              flexShrink: 0,
                            }}
                          />
                          <p
                            style={{
                              color: "#111827",
                              fontFamily: "Poppins, sans-serif",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "24px",
                              margin: 0,
                            }}
                          >
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Take Your Spot Section */}
      <section style={{ backgroundColor: "#F8F9FA", paddingTop: "80px", paddingBottom: "80px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            textAlign: "center",
          }}
        >
          <div
            className="fade-in-section"
            style={{
              color: "#06B6D4",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            JOIN OUR TEAM
          </div>
          <h2
            className="fade-in-blur"
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "24px",
              marginTop: 0,
              willChange: "opacity, transform, filter",
            }}
          >
            Take Your Spot in The Crayon Box
          </h2>
          <p
            className="fade-in-section"
            style={{
              color: "#4B5563",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              maxWidth: "800px",
              margin: "0 auto 32px auto",
            }}
          >
            Think you'll feel at home with our innovative, <em>quirky</em>, and data-driven tribe? Then jump right in! Check out our open positions here
          </p>
          <div className="fade-in-section">
            <Link
              href="/career#open-positions"
              className="fade-in-section"
              style={{
                padding: "12px 24px",
                backgroundColor: "#111827",
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "21px",
                textDecoration: "none",
                borderRadius: "6px",
                display: "inline-block",
                width: "fit-content",
                transition: "background-color 0.2s ease",
                marginTop: "8px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#374151";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111827";
              }}
            >
              JOIN THE BOX!
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "80px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div
            style={{
              color: "#06B6D4",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "8px",
              textAlign: "center",
            }}
          >
            TESTIMONIALS
          </div>
          <h2
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "36px",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "48px",
              marginTop: 0,
              textAlign: "center",
            }}
          >
            Why Crayons Love Working Here
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px",
              alignItems: "stretch",
            }}
          >
            {/* 1st testimonial - Arun Changotra */}
            <div
              className="fade-in-section"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/photo-testimonials/arun-changotra.png"
                  alt="Arun Changotra"
                  width={120}
                  height={120}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  color: "#374151",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "26px",
                  marginBottom: "24px",
                  flex: 1,
                }}
              >
                Crayon fosters an atmosphere where challenges are seen as opportunities. With constant support and open communication, it&apos;s a place where both personal and professional growth thrive.
              </p>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                Arun Changotra
              </div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Software Engineer
              </div>
            </div>

            {/* 2nd testimonial - K S S Sreekrishna */}
            <div
              className="fade-in-section"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/photo-testimonials/sreekrishna.png"
                  alt="K S S Sreekrishna"
                  width={120}
                  height={120}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  color: "#374151",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "26px",
                  marginBottom: "24px",
                  flex: 1,
                }}
              >
                At Crayon, it&apos;s the people and culture that make the difference. The environment is dynamic and fast-paced, challenging you to grow while surrounding you with genuine encouragement, collaboration, and support.
              </p>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                K S S Sreekrishna
              </div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Associate Product Manager
              </div>
            </div>

            {/* 3rd testimonial - Saravanan R */}
            <div
              className="fade-in-section"
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                border: "1px solid #E5E7EB",
              }}
            >
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "24px",
                  flexShrink: 0,
                }}
              >
                <Image
                  src="/photo-testimonials/saravanan-r.png"
                  alt="Saravanan R"
                  width={120}
                  height={120}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <p
                style={{
                  color: "#374151",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "26px",
                  marginBottom: "24px",
                  flex: 1,
                }}
              >
                At Crayon, I value the collaborative culture and the trust placed in me to take ownership of my responsibilities. #Responsibility with freedom
              </p>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                Saravanan R
              </div>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  color: "#6B7280",
                }}
              >
                Lead System Administrator - IT
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get to Know Us Better Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "0" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            className="fade-in-blur"
            style={{
              backgroundColor: "#06B6D4",
              backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 2px, transparent 2px)`,
              backgroundSize: "24px 24px",
              borderRadius: "16px 16px 0 0",
              paddingTop: "80px",
              paddingBottom: "80px",
              paddingLeft: "40px",
              paddingRight: "40px",
              willChange: "opacity, transform, filter",
            }}
          >
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                marginBottom: "32px",
                marginTop: 0,
              }}
            >
              Get to Know Us Better
            </h2>
            <Link
              href="/vision"
              className="fade-in-section"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#000000",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                display: "inline-block",
                padding: "16px 32px",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              OUR VISION
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Navy Footer Section */}
      <section style={{ backgroundColor: "#1A2B49", paddingTop: "40px", paddingBottom: "40px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Footer content can be added here if needed */}
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
