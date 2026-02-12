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

const CATEGORY_LABELS: Record<string, string> = {
  founders: "Founders",
  captains: "Our Captains",
  leaders: "Our Leaders",
};

type TeamMember = {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
  category: "founders" | "captains" | "leaders";
};

const teamMembers: TeamMember[] = [
  // Founders
  {
    id: "suresh",
    name: "Suresh Shankar",
    title: "Founder & CEO",
    description:
      "Suresh is a second-time entrepreneur, and an evangelist of big data, analytics, and digital personalization. His first venture, RedPill Analytics, was acquired by IBM. With a background in sales, marketing, advertising, media, analytics and Big Data, Suresh has been in the industry for 35 years. Long enough to see the transformation of marketing from right-brain to a left-brain pursuit.",
    image: "https://crayondata.ai/wp-content/uploads/Suresh-1.png",
    category: "founders",
  },
  {
    id: "ivk",
    name: "Vijaya Kumar Ivaturi",
    title: "Co-founder & CTO",
    description:
      "Vijaya Kumar (known as IVK) is a leading expert in innovation management and advanced technologies incubation in India. He consults in business strategy and transformation through new age technologies, covering areas like embedded systems, cloud services, big data analytics and mobility.",
    image: "https://crayondata.ai/wp-content/uploads/IVK.png",
    category: "founders",
  },
  // Our Captains
  {
    id: "ajoy",
    name: "Ajoy Krishnamurti",
    title: "CBO",
    description:
      "With 35+ years of experience leading companies and P&Ls, he still approaches every challenge like a learner. His current obsession: AI — what it can do, how enterprises will adopt it, and how we can all get AI-ready. A framework thinker who loves whiteboards, problem-solving, and strong Americanos, Ajoy thrives on turning complex ideas into action. A Husband, father, dog lover, and fountain-pen enthusiast. Currently Chief Business Officer at Crayon Data.",
    image: "https://crayondata.ai/wp-content/uploads/Ajoy-web.png",
    category: "captains",
  },
  {
    id: "priyanshu",
    name: "Priyanshu Mishra",
    title: "VP – Customer Success",
    description:
      "Priyanshu has over 15 years of experience across strategy consulting and enterprise AI. He has led AI-driven analytics initiatives for banks and regulated institutions, ensuring solutions move beyond pilots into secure, scalable production environments. With a strong foundation in structured problem-solving, he focuses on translating complex data systems into measurable business outcomes. At Crayon Data, he partners closely with enterprise clients to drive adoption, impact, and long-term success.",
    image: "https://crayondata.ai/wp-content/uploads/Priyanshu-Mishra.png",
    category: "captains",
  },
  {
    id: "vinayak",
    name: "Vinayak Ganapuram",
    title: "VP – Engineering",
    description:
      "Vinayak is a seasoned, hands-on tech leader, with a proven track record in building software products from 0 to 1 & scaling from x to 10x multiple times across finance, e-commerce, and travel. He loves working on products/companies with a steep learning curve and looks to push the boundaries.",
    image: "https://crayondata.ai/wp-content/uploads/Vinayak-Ganapuram.png",
    category: "captains",
  },
  {
    id: "grace",
    name: "Grace Lee",
    title: "Director – Finance & Operations",
    description:
      "Grace, Director – Finance & Operations, brings over 15 years of experience driving financial and operational excellence. Based in Singapore, she is known for her clarity of thought, structured approach, and exceptional organisational discipline. She plays a critical role in aligning finance, operations, and governance to support sustainable growth. Beyond Crayon Data, Grace is also a respected voice and influencer in Singapore.",
    image: "/placeholder-user.jpg",
    category: "captains",
  },
  {
    id: "sujee",
    name: "Sujee Shalini",
    title: "Director – People and Culture",
    description:
      "Sujee brings over 15 years of experience in IT recruitment and operations. She specializes in talent acquisition across all levels within the technology industry, building high-performing teams in fast-evolving environments. With a strong focus on aligning talent strategy to business goals, she ensures the right capabilities are in place to support scale and execution. At Crayon Data, she leads efforts to attract, develop, and retain the talent that powers our AI platforms and enterprise delivery.",
    image: "https://crayondata.ai/wp-content/uploads/Sujee-Shalini.png",
    category: "captains",
  },
  {
    id: "tejeswini",
    name: "Tejeswini Kashyappan",
    title: "Chief of Staff",
    description:
      "Tejeswini, Chief of Staff to the CEO, is a builder at heart with 13+ years of experience across PropTech and FinTech. She has shaped products, scaled teams, and now orchestrates strategy and execution at Crayon Data — turning vision into systems that work. Known for connecting people, priorities, and plans with clarity and empathy, she brings structure to complexity and momentum to ideas. With a bias for action and a love for meaningful conversations, she thrives at the intersection of precision, storytelling, and getting things done.",
    image: "https://crayondata.ai/wp-content/uploads/Tejeswini-web.png",
    category: "captains",
  },
  // Our Leaders
  {
    id: "sethu",
    name: "Sethu Ramalingam",
    title: "Director – Customer Success",
    description:
      "With over 12 years of multi-faceted experience across sales, business analytics, consulting and operations, Sethu's expertise lies in streamlining business processes using business intelligence. He strongly advocates that a process driven organization delivers value and efficiency.",
    image: "https://crayondata.ai/wp-content/uploads/Sethu-Ramalingam.png",
    category: "leaders",
  },
  {
    id: "jyotsna",
    name: "Jyotsna Singh",
    title: "Director – Customer Experience",
    description:
      "Jyotsna focuses on translating complex business needs into scalable, production-ready AI platforms. She works closely with engineering, data, and customer teams to ensure products are intuitive, resilient, and built for real-world impact. At the core of her approach is a commitment to clarity, usability, and delivering systems that don't just launch — but last.",
    image: "/placeholder-user.jpg",
    category: "leaders",
  },
  {
    id: "karuna",
    name: "Karunamoorthi",
    title: "Director – Engineering",
    description:
      "Karuna, Director – Engineering, brings over 13 years of experience in building scalable, high-performance technology systems. Known for his calm demeanor and clarity of thought, he leads engineering with precision and steady execution. He combines architectural discipline with delivery speed, ensuring products are robust, reliable, and production-ready. At Crayon Data, he translates complex AI ambitions into enterprise-grade systems that run seamlessly at scale.",
    image: "/placeholder-user.jpg",
    category: "leaders",
  },
  {
    id: "iyyappan",
    name: "Iyyappan S",
    title: "Director – Data and AI",
    description:
      "Iyyappan leads Data and AI at Crayon with 15+ years of experience and a deep passion for transforming data into meaningful intelligence. He brings empathy, clarity, and technical rigor to every problem — making complexity feel approachable and solvable. Outside work, he spends time as a guest lecturer, inspiring students to explore the world of data. A cricketer with a soft spot for sweets, he brings warmth and curiosity to everything he does.",
    image: "https://crayondata.ai/wp-content/uploads/Iyyappan-web.png",
    category: "leaders",
  },
  {
    id: "chinmoy",
    name: "Chinmoy Rajurkar",
    title: "Assistant Director – Data Solutions",
    description:
      "Chinmoy has over 8+ years of experience and brings a deeply analytical lens to building scalable AI systems. With strong experience in data science, machine learning, and data engineering, he bridges the gap between technical rigor and product clarity. He ensures that AI products are not only intelligent, but architected for performance, reliability, and scale.",
    image: "/placeholder-user.jpg",
    category: "leaders",
  },
  {
    id: "bharath",
    name: "Bharath G",
    title: "Associate Director - Finance",
    description:
      "Bharath, Associate Director – Finance, brings strong financial discipline and operational rigor to Crayon Data. With deep experience in financial planning, controls, and compliance, he ensures clarity across cash flow, reporting, and governance. He partners closely with leadership to align financial strategy with business execution and growth. At Crayon Data, he plays a key role in strengthening financial resilience as the company scales.",
    image: "/placeholder-user.jpg",
    category: "leaders",
  },
  {
    id: "vignesh",
    name: "Vignesh Gurumohan",
    title: "Associate Director – Sales Acceleration",
    description:
      "Vignesh, Associate Director, is known for building rapid prototypes and setting the execution bar across the company. With a strong bias for speed and experimentation, he turns ideas into working systems in record time. At Crayon Data, he leads the Sales Accelerator — the engine that powers high-velocity demos, proposals, and deal momentum. He operates at the intersection of product, sales, and AI execution, ensuring innovation translates directly into business impact.",
    image: "/placeholder-user.jpg",
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
      {/* Breadcrumb Section - consistent spacing, clears header */}
      <section
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
                  Our Team
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section - extra top padding to prevent overlap with sub-nav */}
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
            textAlign: "center",
          }}
        >
          {/* Section Label */}
          <div
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "21px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "16px",
              marginTop: 0,
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

      {/* Filter Buttons - consistent spacing */}
      <section style={{ backgroundColor: "#F8F8F8", paddingTop: "40px", paddingBottom: "40px" }}>
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
            { id: "founders", label: "FOUNDERS" },
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

      {/* Team Members Section - consistent spacing */}
      <section style={{ backgroundColor: "#F8F8F8", paddingTop: "48px", paddingBottom: "80px" }}>
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
                        color: "#111827",
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
                        color: "#06B6D4",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "120%",
                        margin: 0,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {CATEGORY_LABELS[member.category]} · {member.title}
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
