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

const perks = [
  {
    id: 1,
    title: "We've got you and your family covered with our insurance policies",
    icon: "https://crayondata.ai/wp-content/uploads/Group-39719.svg",
  },
  {
    id: 2,
    title: "Work from home or from the Box. We're flexible like that",
    icon: "https://crayondata.ai/wp-content/uploads/Frame-4.svg",
  },
  {
    id: 3,
    title: "We celebrate everything – festivals, birthdays, and more",
    icon: "https://crayondata.ai/wp-content/uploads/Frame-5.svg",
  },
  {
    id: 4,
    title: "A generous sabbatical and leave policy for those much-needed breaks",
    icon: "https://crayondata.ai/wp-content/uploads/Frame-6.svg",
  },
  {
    id: 5,
    title: "Win bonuses for successful referrals",
    icon: "https://crayondata.ai/wp-content/uploads/Frame-7.svg",
  },
  {
    id: 6,
    title: "Awards, rewards, and recognition for the star in you",
    icon: "https://crayondata.ai/wp-content/uploads/Frame-8.svg",
  },
  {
    id: 7,
    title: "Sports and wellness meet-ups for the mind, body, and soul",
    icon: "https://crayondata.ai/wp-content/uploads/Group-39718.svg",
  },
];

const testimonials = [
  {
    id: 1,
    name: "Karan Bakshi",
    role: "Pre-Sales",
    quote: "Everyone truly gets along and pitches in to get the job done - even if its not written in their job descriptions",
    image: "https://crayondata.ai/wp-content/uploads/DSC_9080-2-3.png",
  },
  {
    id: 2,
    name: "Maadhusri Ulaganathan",
    role: "Customer Science",
    quote: "Crayons are highly talented and experts in the domains they handle. They are helpful and always willing to share their knowledge. I've also felt that one's voice or opinions will never be unheard. You will feel like you are being recognized and have visibility.",
    image: "https://crayondata.ai/wp-content/uploads/2nd-image.png",
  },
  {
    id: 3,
    name: "Sundara Raghavan",
    role: "Technology",
    quote: "Crayon Data opened the doors for growth and has been supporting me in my curiosity for learning. I get the opportunity to wear multiple hats which makes it all the more interestinglarger group virtual events. Proud to be a Crayon!",
    image: "https://crayondata.ai/wp-content/uploads/Mask-group-9.png",
  },
  {
    id: 4,
    name: "Devaki Gopalan",
    role: "Program Management",
    quote: "For anyone curious about working at Crayon, I would say join because of the people. They're skilled, curious, innovative, and fun...The intelligence and passion with which they talk about AI is very refrehing. The exchange of thoughts and ideas keeps you challenged and interested.",
    image: "https://crayondata.ai/wp-content/uploads/Mask-group-10.png",
  },
  {
    id: 5,
    name: "Akshaya Sreedhar",
    role: "Sales Enablement",
    quote: "One of the coolest things we've worked on is cracking down on some very specific pain points of a major client. We went beyond just delivering the product. We were invovled in adoption and value delivery. The focus is on driving customer elation, not just customer satisfaction.",
    image: "https://crayondata.ai/wp-content/uploads/DSC_9080-2-3.png",
  },
  {
    id: 6,
    name: "Malvika Elango",
    role: "Customer Success",
    quote: "Crayons live and breathe our value, \"The mission is the boss.\" It gives you an opportunity to step up, express opinions, and take charge, irrespective of how young you may be.",
    image: "https://crayondata.ai/wp-content/uploads/2nd-image.png",
  },
  {
    id: 7,
    name: "Suresh Karthik",
    role: "Marketing",
    quote: "The world of Crayon is not just one; rather, it is a place where ideas from different backgrounds can flourish. It doesn't matter if you're shy, outgoing, or disabled. Just be yourself, because we adore you that way.",
    image: "https://crayondata.ai/wp-content/uploads/Mask-group-9.png",
  },
];

export default function CareerPage() {
  const [expandedAccordions, setExpandedAccordions] = useState<Set<string>>(new Set());
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const toggleAccordion = (id: string) => {
    const newExpanded = new Set(expandedAccordions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedAccordions(newExpanded);
  };

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Breadcrumb Section */}
      <section className="pt-8 pb-4 fade-in-section" style={{ backgroundColor: "#FFFFFF" }}>
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

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: "80px",
          paddingBottom: "0",
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
            gap: "64px",
          }}
        >
          {/* Left Side - Text Content */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Section Label */}
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

            {/* CTA Button */}
            <div className="fade-in-section" style={{ marginTop: "8px" }}>
              <button
                style={{
                  padding: "16px 32px",
                  backgroundColor: "#06B6D4",
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  alignSelf: "flex-start",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#0891b2";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#06B6D4";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                JOIN US
              </button>
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
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "24px", paddingBottom: "48px" }}>
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
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "80px" }}>
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

              {/* Accordion 2 */}
              <div
                style={{
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => toggleAccordion("workspace")}
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
                  <span>+ A bright and open workspace</span>
                  <span style={{ fontSize: "24px", color: "#06B6D4" }}>
                    {expandedAccordions.has("workspace") ? "−" : "+"}
                  </span>
                </button>
                {expandedAccordions.has("workspace") && (
                  <div style={{ padding: "0 20px 20px 20px", backgroundColor: "#FFFFFF" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {[
                        "An open seating plan with collaborative spaces",
                        "A designated chill corner, where great ideas are born!",
                        "A pantry that's always stocked with delicious and healthy treats",
                        "A fun recreation corner to de-stress with carrom or TT",
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
            <button
              style={{
                padding: "16px 32px",
                backgroundColor: "#06B6D4",
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0891b2";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#06B6D4";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              JOIN THE BOX!
            </button>
          </div>
        </div>
      </section>

      {/* The Perks Of Being A Crayon Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "80px", position: "relative" }}>
        {/* Dotted C Background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "400px",
            height: "100%",
            opacity: 0.1,
            backgroundImage: "radial-gradient(circle, #9CA3AF 1px, transparent 1px)",
            backgroundSize: "20px 20px",
            pointerEvents: "none",
          }}
        />
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              gap: "24px",
              marginBottom: "48px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "32px",
                backgroundColor: "#EA186D",
                flexShrink: 0,
              }}
            />
            <h2
              className="fade-in-blur"
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
                willChange: "opacity, transform, filter",
              }}
            >
              The Perks Of Being A Crayon
            </h2>
          </div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
            style={{
              gap: "16px",
            }}
          >
            {perks.map((perk, index) => (
              <div
                key={perk.id}
                className="stagger-item"
                style={{
                  backgroundColor: "#F7F8FA",
                  borderRadius: "8px",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                  border: "1px solid #E5E7EB",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                  }}
                >
                  <Image
                    src={perk.icon}
                    alt={perk.title}
                    width={60}
                    height={60}
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
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "24px",
                    textAlign: "center",
                    margin: 0,
                  }}
                >
                  {perk.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We Love Crayon Section - Marquee */}
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
          <h2
            className="fade-in-blur"
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "48px",
              marginTop: 0,
              textAlign: "center",
              willChange: "opacity, transform, filter",
            }}
          >
            Why We Love Crayon
          </h2>

          {/* Marquee Container */}
          <div
            style={{
              overflow: "hidden",
              width: "100%",
              position: "relative",
            }}
          >
            {/* Marquee Animation Wrapper */}
            <div
              className="marquee-track"
              style={{
                display: "flex",
                gap: "16px",
                width: "fit-content",
                animation: "marquee 30s linear infinite",
              }}
            >
              {/* First set of testimonials */}
              {testimonials.map((testimonial) => (
                <div
                  key={`first-${testimonial.id}`}
                  style={{
                    minWidth: "400px",
                    width: "400px",
                    flexShrink: 0,
                    position: "relative",
                    aspectRatio: "4/3",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.role}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {testimonials.map((testimonial) => (
                <div
                  key={`second-${testimonial.id}`}
                  style={{
                    minWidth: "400px",
                    width: "400px",
                    flexShrink: 0,
                    position: "relative",
                    aspectRatio: "4/3",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#F9FAFB",
                  }}
                >
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - ${testimonial.role}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Marquee CSS Animation */}
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .marquee-track:hover {
              animation-play-state: paused;
            }
          `}</style>
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
              backgroundColor: "#1D8AD7",
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
