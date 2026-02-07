"use client";

import { useState } from "react";
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

type TeamMember = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  category: "founders" | "captains" | "leaders";
};

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Suresh Shankar",
    title: "Founder and CEO",
    description:
      "Suresh is a second-time entrepreneur, and an evangelist of big data, analytics, and digital personalization. His first venture, RedPill Analytics, was acquired by IBM. With a background in sales, marketing, advertising, media, analytics and Big Data, Suresh has been in the industry for 35 years. Long enough to see the transformation of marketing from right-brain to a left-brain pursuit.",
    image: "https://crayondata.ai/wp-content/uploads/Suresh-1.png",
    category: "founders",
  },
  {
    id: "2",
    name: "Vijaya Kumar Ivaturi",
    title: "Co-Founder and CTO",
    description:
      "Vijaya Kumar (known as IVK) is a leading expert in innovation management and advanced technologies incubation in India. He consults in business strategy and transformation through new age technologies, covering areas like embedded systems, cloud services, big data analytics and mobility.",
    image: "https://crayondata.ai/wp-content/uploads/IVK.png",
    category: "founders",
  },
  {
    id: "4",
    name: "Ajoy Krishnamurti",
    title: "Chief Business Officer",
    description:
      "With 35+ years of experience leading companies and P&Ls, he still approaches every challenge like a learner. His current obsession: AI — what it can do, how enterprises will adopt it, and how we can all get AI-ready. A framework thinker who loves whiteboards, problem-solving, and strong Americanos, Ajoy thrives on turning complex ideas into action. A Husband, father, dog lover, and fountain-pen enthusiast. Currently Chief Business Officer at Crayon Data.",
    image: "https://crayondata.ai/wp-content/uploads/Ajoy-web.png",
    category: "captains",
  },
  {
    id: "5",
    name: "Priyanshu Mishra",
    title: "VP, Customer Success",
    description:
      "With 10+ years of experience, Priyanshu cut his teeth in strategy consulting and has been delivering AI-led analytics for banks over the past 8 years.",
    image: "https://crayondata.ai/wp-content/uploads/Priyanshu-Mishra.png",
    category: "captains",
  },
  {
    id: "6",
    name: "Vinayak Ganapuram",
    title: "VP, Engineering",
    description:
      "Vinayak is a seasoned, hands-on tech leader, with a proven track record in building software products from 0 to 1 & scaling from x to 10x multiple times across finance, e-commerce, and travel. He loves working on products/companies with a steep learning curve and looks to push the boundaries.",
    image: "https://crayondata.ai/wp-content/uploads/Vinayak-Ganapuram.png",
    category: "captains",
  },
  {
    id: "7",
    name: "Sujee Shalini",
    title: "Director, HR",
    description:
      "Sujee has 13+ years of experience in IT recruitment and operations. She is a specialist in talent acquisition across all levels in the tech industry vertical.",
    image: "https://crayondata.ai/wp-content/uploads/Sujee-Shalini.png",
    category: "captains",
  },
  {
    id: "8",
    name: "Tejeswini Kashyappan",
    title: "Chief of Staff",
    description:
      "Tejeswini is a builder at heart. With 13+ years across PropTech and FinTech, she's shaped products, scaled teams, and now orchestrates the chaos as Chief of Staff to the CEO at Crayon Data. She loves turning vision into systems that work — connecting people, priorities, and plans with equal parts precision and empathy. A sharp mind for structure, a soft spot for stories, and a bias for getting things done. When she's not connecting dots, she's likely baking, hosting people, or at a round table.",
    image: "https://crayondata.ai/wp-content/uploads/Tejeswini-web.png",
    category: "captains",
  },
  {
    id: "9",
    name: "Sethu Ramalingam",
    title: "Director, Customer Success",
    description:
      "With over 9 years of multi-faceted experience across sales, business analytics, consulting and operations, Sethu's expertise lies in streamlining business processes using business intelligence. He strongly advocates that a process driven organization delivers value and efficiency.",
    image: "https://crayondata.ai/wp-content/uploads/Sethu-Ramalingam.png",
    category: "leaders",
  },
  {
    id: "11",
    name: "Iyyappan S",
    title: "Director - Data and AI",
    description:
      "Iyyappan leads Data and AI at Crayon with 15+ years of experience and a deep passion for transforming data into meaningful intelligence. He brings empathy, clarity, and technical rigor to every problem — making complexity feel approachable and solvable. Outside work, he spends time as a guest lecturer, inspiring students to explore the world of data. A cricketer with a soft spot for sweets, he brings warmth and curiosity to everything he does.",
    image: "https://crayondata.ai/wp-content/uploads/Iyyappan-web.png",
    category: "leaders",
  },
];

export default function OurTeamPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());

  const filteredMembers =
    activeFilter === "all"
      ? teamMembers
      : teamMembers.filter((member) => member.category === activeFilter);

  const toggleExpand = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Breadcrumb Section */}
      <section className="pt-8 pb-4" style={{ backgroundColor: "#FFFFFF" }}>
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
                  Our Team
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
            style={{
              color: "#06B6D4",
              fontFamily: "Poppins, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "24px",
            }}
          >
            OUR TEAMS
          </div>

          {/* Main Heading */}
          <h1
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            Meet the Crayon Crew
          </h1>

          {/* Tagline */}
          <p
            style={{
              color: "#4B5563",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            The people who build up the Box
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section style={{ backgroundColor: "#F8F8F8", paddingBottom: "40px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "all", label: "ALL" },
            { id: "founders", label: "OUR FOUNDERS" },
            { id: "captains", label: "OUR CAPTAINS" },
            { id: "leaders", label: "OUR LEADERS" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: "12px 24px",
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                backgroundColor: activeFilter === filter.id ? "#06B6D4" : "transparent",
                color: activeFilter === filter.id ? "#FFFFFF" : "#111827",
                border: activeFilter === filter.id ? "none" : "1px solid #E5E7EB",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                if (activeFilter !== filter.id) {
                  e.currentTarget.style.backgroundColor = "#F3F4F6";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFilter !== filter.id) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Team Members Section */}
      <section style={{ backgroundColor: "#F8F8F8", paddingTop: "40px", paddingBottom: "80px" }}>
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
            className="grid grid-cols-1 md:grid-cols-3"
            style={{
              gap: "16px",
            }}
          >
            {filteredMembers.map((member) => {
              const isExpanded = expandedMembers.has(member.id);
              const shouldTruncate = member.description.length > 150;
              const displayDescription = isExpanded || !shouldTruncate
                ? member.description
                : truncateDescription(member.description, 150);

              return (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    padding: "24px",
                  }}
                >
                  {/* Member Image */}
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      position: "relative",
                      borderRadius: "8px",
                      overflow: "hidden",
                      backgroundColor: "#F9FAFB",
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
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

                  {/* Member Content */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#007BFF",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "22px",
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "120%",
                        margin: 0,
                      }}
                    >
                      {member.name}
                    </h3>
                    <p
                      style={{
                        color: "#6c757d",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "120%",
                        margin: 0,
                      }}
                    >
                      {member.title}
                    </p>
                    <p
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                        margin: "12px 0 0 0",
                      }}
                    >
                      {displayDescription}
                      {shouldTruncate && !isExpanded && "..."}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(member.id)}
                        style={{
                          color: "#06B6D4",
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          textDecoration: "underline",
                          backgroundColor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          marginTop: "8px",
                          textAlign: "left",
                          alignSelf: "flex-start",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#0891b2";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#06B6D4";
                        }}
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
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
