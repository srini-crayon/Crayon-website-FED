"use client";

import { useEffect, useState } from "react";
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

const companyValues = [
  {
    id: 1,
    name: "The mission is the boss",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/The-mission-is-the-boss-.svg.svg#883",
  },
  {
    id: 2,
    name: "Responsibility with freedom",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Responsibility-with-freedom-.svg.svg#882",
  },
  {
    id: 3,
    name: "Get shit done",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Get-shit-done-.svg-fill.svg#881",
  },
  {
    id: 4,
    name: "Be the benchmark",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Be-the-benchmark-.svg.svg#880",
  },
  {
    id: 5,
    name: "Practice constructive candor",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Practice-constructive-candor-.svg-fill.svg#879",
  },
  {
    id: 6,
    name: "Think data, craft experiences",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Think-data-craft-experiences-.svg-fill.svg#878",
  },
  {
    id: 7,
    name: "Simplicity is sophistication",
    icon: "https://crayondata.ai/wp-content/uploads/2024/04/Simplicity-is-sophistication-.svg-fill.svg#877",
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
              {/* Section Label */}
              <div
                className="fade-in-section"
                style={{
                  color: "#06B6D4",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "21px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                CRAYON VALUES
              </div>

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
              gap: "64px",
            }}
            className="md:flex-row md:items-start md:gap-20"
          >
            {/* Left Side - COMPANY VALUES Heading */}
            <div
              className="fade-in-section"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "24px",
                flexShrink: 0,
                width: "100%",
                maxWidth: "400px",
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

            {/* Right Side - Values Grid */}
            <div style={{ flex: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {companyValues.map((value, index) => (
                  <div
                    key={value.id}
                    className="stagger-item scale-in"
                    style={{
                      padding: "24px",
                      backgroundColor: "#F8F8F8",
                      borderRadius: "12px",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "16px",
                      transitionDelay: `${index * 100}ms`,
                      minHeight: "180px",
                    }}
                  >
                    <div style={{ width: "80px", height: "80px", position: "relative", flexShrink: 0 }}>
                      <Image
                        src={value.icon}
                        alt={value.name}
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
                    <p
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "120%",
                        margin: 0,
                        textAlign: "center",
                      }}
                    >
                      {value.name}
                    </p>
                  </div>
                ))}
              </div>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "64px",
            }}
            className="md:flex-row md:items-start"
          >
            {/* Left Side - Text Content */}
            <div
              className="fade-in-section"
              style={{
                flex: "1 1 0%",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                maxWidth: "500px",
              }}
            >
              <div
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
                CRAYON VALUES
              </div>
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
                Values We Prize in Our People
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
              <button
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#06B6D4",
                  color: "#FFFFFF",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "21px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "fit-content",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                  marginTop: "8px",
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
                EXPLORE VALUES
              </button>
            </div>

            {/* Right Side - Horizontal Scrollable Cards */}
            <div className="fade-in-section" style={{ flex: "1 1 0%", position: "relative" }}>
              <div
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  display: "flex",
                  gap: "24px",
                  paddingBottom: "16px",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
                className="[&::-webkit-scrollbar]:hidden"
              >
                {peopleValues.map((value, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: "280px",
                      width: "280px",
                      padding: "32px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "24px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                      flexShrink: 0,
                      minHeight: "320px",
                    }}
                  >
                    <div style={{ width: "120px", height: "120px", position: "relative", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img
                        src={value.icon}
                        alt={value.text}
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
                    <p
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "120%",
                        margin: 0,
                        textAlign: "center",
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

      {/* Story Sections */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* How Values 2.0 came to be */}
            <div
              className="fade-in-section scale-in"
              style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
            >
              {/* Image */}
              <div
                style={{
                  width: "200px",
                  height: "280px",
                  position: "relative",
                  flexShrink: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#FCD34D",
                    clipPath: "polygon(0 100%, 0 0, 100% 100%)",
                    zIndex: 1,
                  }}
                />
                <Image
                  src="https://crayondata.ai/wp-content/uploads/Group-1171278552-2.png"
                  alt="Aarti Ramakrishnan"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-family: Poppins, sans-serif; font-size: 14px;">Image</div>`;
                    }
                  }}
                />
              </div>

              {/* Text Box */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#ED2E7E",
                  borderRadius: "12px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  justifyContent: "space-between",
                  minHeight: "280px",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "120%",
                      marginBottom: "12px",
                      marginTop: 0,
                    }}
                  >
                    How Values 2.0 came to be
                  </h3>
                  <p
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      margin: 0,
                    }}
                  >
                    Co-founder and COO Aarti Ramakrishnan on the Crayon Values that have crafted our culture over the years.
                  </p>
                </div>
                <button
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-start",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="Read more"
                >
                  <span style={{ color: "#000", fontSize: "20px" }}>→</span>
                </button>
              </div>
            </div>

            {/* The story of Crayon */}
            <div
              className="fade-in-section scale-in"
              style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}
            >
              {/* Image */}
              <div
                style={{
                  width: "200px",
                  height: "280px",
                  position: "relative",
                  flexShrink: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#F9FAFB",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#3B82F6",
                    clipPath: "polygon(0 100%, 0 0, 100% 100%)",
                    zIndex: 1,
                  }}
                />
                <Image
                  src="https://crayondata.ai/wp-content/uploads/Group-1171278553-2.png"
                  alt="Suresh Shankar"
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9CA3AF; font-family: Poppins, sans-serif; font-size: 14px;">Image</div>`;
                    }
                  }}
                />
              </div>

              {/* Text Box */}
              <div
                style={{
                  flex: 1,
                  backgroundColor: "#F97316",
                  borderRadius: "12px",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  justifyContent: "space-between",
                  minHeight: "280px",
                }}
              >
                <div>
                  <h3
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "24px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "120%",
                      marginBottom: "12px",
                      marginTop: 0,
                    }}
                  >
                    The story of Crayon
                  </h3>
                  <p
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "24px",
                      margin: 0,
                    }}
                  >
                    Founder and CEO Suresh Shankar on building teams aligned to our mission.
                  </p>
                </div>
                <button
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#FFFFFF",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    alignSelf: "flex-start",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  aria-label="Read more"
                >
                  <span style={{ color: "#000", fontSize: "20px" }}>→</span>
                </button>
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
              href="/our-story"
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
              OUR STORY
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
