"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ScrollToTopButton from "@/components/scroll-to-top-button";

const companyValues = [
  {
    id: 1,
    name: "The mission is the boss",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/The-mission-is-the-boss-.svg.svg#883",
    description:
      "At Crayon Data, the mission comes first — always. Titles, hierarchy, and roles matter less than doing what's right for the mission. The best idea wins, regardless of where it comes from. We align decisions around impact, not authority.",
  },
  {
    id: 2,
    name: "Responsibility with freedom",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Responsibility-with-freedom-.svg.svg#882",
    description:
      "We give people the freedom to think independently, challenge assumptions, and take ownership. With that freedom comes responsibility — to be honest, to deliver on commitments, and to own outcomes. Trust is earned through execution.",
  },
  {
    id: 3,
    name: "Get shit done",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Get-shit-done-.svg-fill.svg#881",
    description:
      "We value action over perfection. When you're clear enough to move forward, you move. We think deeply, act quickly, and learn continuously. Progress matters — and momentum compounds.",
  },
  {
    id: 4,
    name: "Be the benchmark",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Be-the-benchmark-.svg.svg#880",
    description:
      "\"Good enough\" isn't good enough. We don't chase competitors — we set standards. Whether it's our thinking, our work, or our outcomes, we aim to raise the bar for ourselves and for the industry.",
  },
  {
    id: 5,
    name: "Practice constructive candour",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Practice-constructive-candor-.svg-fill.svg#879",
    description:
      "We believe honest conversations build stronger teams. We speak openly, listen actively, and give feedback with empathy and intent to help. Candour isn't about being blunt — it's about being constructive.",
  },
  {
    id: 6,
    name: "Think data, craft experiences",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Think-data-craft-experiences-.svg-fill.svg#878",
    description:
      "Data is the foundation, but experience is the outcome. We use data to inform decisions, guide intelligence, and shape systems — always with the end user in mind. Insight only matters when it creates a better experience.",
  },
  {
    id: 7,
    name: "Simplicity is sophistication",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Simplicity-is-sophistication-.svg-fill.svg#877",
    description:
      "Complex problems deserve clear solutions. We believe true sophistication lies in clarity of thought and simplicity of output — even when the systems behind them are complex. If it's not easy to understand, it's not done yet.",
  },
];

const peopleValues = [
  {
    text: "Reliable in execution",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/plumber2-services-pic1.jpg.png",
  },
  {
    text: "Respectful in intention",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Group-1171278554.png",
  },
  {
    text: "Team first in thinking",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Group-1171278555.png",
  },
  {
    text: "Bold in ambition",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Bold-in-ambition-.png",
  },
];

export default function OurValuesPage() {
  const [expandedValue, setExpandedValue] = useState<number | null>(null);

  const toggleValue = (id: number) => {
    setExpandedValue((prev) => (prev === id ? null : id));
  };

  // Scroll animations with IntersectionObserver
  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
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
    <div className="flex flex-col min-h-screen bg-white">
      {/* Breadcrumb Section */}
      <section className="pt-4 pb-4 fade-in-section" style={{ backgroundColor: "#FFFFFF" }}>
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
                <BreadcrumbLink
                  href="/"
                  style={{
                    color: "#6B7280",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                  }}
                >
                  Our Values
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
          paddingTop: "48px",
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
          <div
            className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 w-full"
          >
            {/* Left Side - Text Content */}
            <div
              style={{
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxWidth: "600px",
              }}
            >
              {/* Main Heading */}
              <h1
                className="fade-in-blur"
                style={{
                  color: "#000000",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "48px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "120%",
                  margin: 0,
                  willChange: "opacity, transform, filter",
                }}
              >
                The Crayon Box of Values
              </h1>

              {/* Description */}
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
                Culture and purpose lend a person happiness at work. Here are our set of values that we believe in and shape our culture. And as any Crayon will tell you, we're fanatical about them!
              </p>
              <a
                href="/The-Crayon-Box-of-Values.pdf"
                download="The Crayon Box of Values.pdf"
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
                Download Values PDF
              </a>
            </div>

            {/* Right Side - Hero Image */}
            <div
              className="fade-in-section"
              style={{
                flex: "1 1 0%",
                position: "relative",
                minHeight: "400px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  position: "relative",
                  aspectRatio: "1/1",
                }}
              >
                <img
                  src="https://crayondata.ai/wp-content/uploads/2024/04/Group-1171278405.svg#884"
                  alt="The Crayon Box of Values"
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
          </div>
        </div>
      </section>

      {/* Company Values Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "24px", paddingBottom: "80px" }}>
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
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
          >
            {/* COMPANY VALUES Heading */}
            <div
              className="fade-in-section"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "24px",
                flexShrink: 0,
                width: "100%",
                position: "relative",
              }}
            >
              {/* Dotted C Background */}
              <div
                style={{
                  position: "absolute",
                  left: "-100px",
                  top: "-50px",
                  width: "400px",
                  height: "400px",
                  opacity: 0.1,
                  zIndex: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="https://crayondata.ai/wp-content/uploads/C.svg"
                  alt=""
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

              {/* COMPANY VALUES Text with Pink Block */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flex: 1,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "32px",
                    backgroundColor: "#ED2E7E",
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "36px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "120%",
                    margin: 0,
                  }}
                >
                  COMPANY VALUES
                </h2>
              </div>
            </div>

            {/* Values Tiles Grid */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              style={{ gap: "20px", width: "100%" }}
            >
              {companyValues.map((value, index) => {
                const isExpanded = expandedValue === value.id;
                return (
                  <div
                    key={value.id}
                    className="stagger-item scale-in"
                    onClick={() => toggleValue(value.id)}
                    style={{
                      transitionDelay: `${index * 80}ms`,
                      backgroundColor: "#F8F8F8",
                      borderRadius: "16px",
                      border: isExpanded ? "2px solid #ED2E7E" : "2px solid transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "border-color 0.35s ease, box-shadow 0.35s ease, transform 0.2s ease",
                      boxShadow: isExpanded
                        ? "0 6px 24px rgba(237, 46, 126, 0.12)"
                        : "0 1px 3px rgba(0, 0, 0, 0.04)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = isExpanded
                        ? "0 8px 28px rgba(237, 46, 126, 0.16)"
                        : "0 4px 16px rgba(0, 0, 0, 0.08)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = isExpanded
                        ? "0 6px 24px rgba(237, 46, 126, 0.12)"
                        : "0 1px 3px rgba(0, 0, 0, 0.04)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {/* Tile Top: Icon + Title + Arrow */}
                    <div
                      style={{
                        padding: "28px 24px 20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "16px",
                        textAlign: "center",
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          position: "relative",
                          flexShrink: 0,
                          transition: "transform 0.35s ease",
                          transform: isExpanded ? "scale(1.1)" : "scale(1)",
                        }}
                      >
                        <Image
                          src={value.icon}
                          alt={value.name}
                          fill
                          style={{ objectFit: "contain" }}
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          color: isExpanded ? "#ED2E7E" : "#111827",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "17px",
                          fontWeight: 600,
                          lineHeight: "140%",
                          margin: 0,
                          transition: "color 0.35s ease",
                        }}
                      >
                        {value.name}
                      </h3>

                      {/* Expand indicator */}
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          backgroundColor: isExpanded ? "#ED2E7E" : "#E5E7EB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.35s ease",
                          flexShrink: 0,
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.35s ease",
                          }}
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke={isExpanded ? "#FFFFFF" : "#6B7280"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Expandable Description */}
                    <div
                      style={{
                        maxHeight: isExpanded ? "300px" : "0px",
                        opacity: isExpanded ? 1 : 0,
                        overflow: "hidden",
                        transition:
                          "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease 0.05s",
                      }}
                    >
                      <div
                        style={{
                          padding: "0 24px 28px",
                          borderTop: "1px solid #E5E7EB",
                          paddingTop: "16px",
                        }}
                      >
                        <p
                          style={{
                            color: "#4B5563",
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 400,
                            lineHeight: "24px",
                            margin: 0,
                          }}
                        >
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values We Prize in Our People Section */}
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
          <div className="flex flex-col md:flex-row md:items-start gap-12">
            {/* Left Side - Text Content */}
            <div
              className="fade-in-section flex-1 order-1"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <h2
                style={{
                  color: "#111827",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "36px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "120%",
                  margin: 0,
                }}
              >
                Values We Prize in<br />Our People
              </h2>
              <p
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
                A true Crayon will embody all of these values and walk the talk. All the values, all the time.
              </p>
            </div>

            {/* Right Side - 2x2 Grid Cards */}
            <div className="fade-in-section flex-1 order-2">
              <div className="grid grid-cols-2 gap-4">
                {peopleValues.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "0",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ width: "100%", height: "140px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <img
                        src={value.icon}
                        alt={value.text}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
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
                        lineHeight: "120%",
                        margin: 0,
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      {value.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}
