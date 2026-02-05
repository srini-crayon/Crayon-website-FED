"use client";

import { useEffect } from "react";
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

const investors = [
  {
    id: 1,
    name: "Jungle Ventures",
    image: "/img/investors/jungle-ventures.svg",
  },
  {
    id: 2,
    name: "Enterprise Singapore",
    image: "/img/investors/enterprise-singapore.svg",
  },
  {
    id: 3,
    name: "Late Ratan Tata (RNT Associates)",
    image: "/img/investors/ratan-tata.svg",
  },
  {
    id: 4,
    name: "Kris Gopalakrishnan",
    image: "/img/investors/kris-gopalakrishnan.svg",
  },
];

export default function OurInvestorsPage() {
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
                  Our Investors
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
          paddingBottom: "80px",
        }}
      >
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
          {/* Section Label */}
          <div
            className="fade-in-section"
            style={{
              color: "#06B6D4",
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            OUR INVESTORS
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
              marginBottom: "12px",
              marginTop: 0,
              willChange: "opacity, transform, filter",
            }}
          >
            The Crayon Circle
          </h1>

          {/* Subtitle */}
          <p
            className="fade-in-section"
            style={{
              color: "#4A4A4A",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "28px",
              maxWidth: "900px",
              margin: "0 auto 12px auto",
            }}
          >
            Meet the people who help us simplify the world&apos;s choices
          </p>
        </div>
      </section>

      {/* Investors Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "40px", paddingBottom: "80px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Tagline */}
          <h3
            className="fade-in-section"
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              textAlign: "center",
              marginBottom: "64px",
              marginTop: 0,
            }}
          >
            Our companions on this journey down the yellow brick road
          </h3>

          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{
              gap: "48px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {investors.map((investor, index) => (
              <div
                key={investor.id}
                className="stagger-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Image/Logo Container */}
                <div
                  className="scale-in"
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <Image
                    src={investor.image}
                    alt={investor.name}
                    fill
                    style={{
                      objectFit: "contain",
                      padding: "16px",
                    }}
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div style="color: #6B7280; font-family: Poppins, sans-serif; font-size: 16px; display: flex; align-items: center; justify-content: center; height: 100%;">${investor.name}</div>`;
                      }
                    }}
                  />
                </div>

                {/* Text Content */}
                <div
                  className="fade-in-section"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "21px",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Investors
                  </p>
                  <h3
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    {investor.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* And Many More */}
          <div
            className="fade-in-section"
            style={{
              textAlign: "center",
              marginTop: "64px",
            }}
          >
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins, sans-serif",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              ... and many more
            </p>
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
