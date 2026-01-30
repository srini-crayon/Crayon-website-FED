"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

type BlogCategory =
  | "View all"
  | "Design"
  | "Product"
  | "Development"
  | "Customer Support"
  | "Leadership"
  | "Management"
  | "Interviews";

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  dateLabel: string;
  category: Exclude<BlogCategory, "View all">;
  imageSrc: string;
};

export default function BlogPage() {
  const categories: BlogCategory[] = useMemo(
    () => ["View all", "Design", "Product", "Development", "Customer Support", "Leadership", "Management", "Interviews"],
    []
  );

  const posts: BlogPost[] = useMemo(
    () => [
      {
        slug: "ux-review-presentations",
        title: "UX review presentations",
        excerpt: "How do you create compelling presentations that wow your colleagues and impress your managers? Look no further.",
        author: "Olivia Rhye",
        dateLabel: "20 Jan 2022",
        category: "Design",
        imageSrc: "/photos/listening-intently-to-a-session-on-our-product-testing-process.webp",
      },
      {
        slug: "best-books-on-scaling-your-startup",
        title: "Best books on scaling your startup",
        excerpt: "This collection of the best startup books for scaling your startup are packed full with valuable insights and advice.",
        author: "Phoenix Baker",
        dateLabel: "19 Jan 2022",
        category: "Design",
        imageSrc: "/photos/crayon-data-tharamani-chennai-software-companies-t2opts67rp.webp",
      },
      {
        slug: "building-agentic-workflows",
        title: "Building agentic workflows that actually ship",
        excerpt: "Patterns for composing tools, guardrails, and evaluation loops to get from demo to dependable production.",
        author: "Lana Steiner",
        dateLabel: "16 Jan 2022",
        category: "Product",
        imageSrc: "/photos/crayons-dublinwebsummit.jpg",
      },
      {
        slug: "operationalizing-genai",
        title: "Operationalizing GenAI in enterprise stacks",
        excerpt: "A practical guide to instrumentation, governance, and rollout strategies that reduce risk and accelerate adoption.",
        author: "Demi Wilkinson",
        dateLabel: "12 Jan 2022",
        category: "Leadership",
        imageSrc: "/photos/Crayon-Data-handles-data-with-art-inline.jpg",
      },
      {
        slug: "design-systems-that-scale",
        title: "Design systems that scale across teams",
        excerpt: "Practical steps to build reusable UI foundations without slowing down product iteration.",
        author: "Candice Wu",
        dateLabel: "11 Jan 2022",
        category: "Design",
        imageSrc: "/photos/images.jpeg",
      },
      {
        slug: "prompt-evals-in-production",
        title: "Prompt evals in production: a lightweight playbook",
        excerpt: "How to track quality, regressions, and drift without turning your release process into a research project.",
        author: "Natali Craig",
        dateLabel: "10 Jan 2022",
        category: "Development",
        imageSrc: "/photos/crayon-data-tharamani-chennai-software-companies-o0n3rnzfbp-250.avif",
      },
      {
        slug: "support-copilots-that-reduce-tickets",
        title: "Support copilots that reduce tickets (and rage)",
        excerpt: "A customer-support-first approach to knowledge retrieval, safe actions, and measurable deflection.",
        author: "Orlando Diggs",
        dateLabel: "08 Jan 2022",
        category: "Customer Support",
        imageSrc: "/photos/cafdcd970688661c1d3ecef6048098d8.webp",
      },
      {
        slug: "pricing-ai-products",
        title: "Pricing AI products: usage, value, and trust",
        excerpt: "A framework for aligning pricing with outcomes, cost, and customer confidence.",
        author: "Courtney Henry",
        dateLabel: "06 Jan 2022",
        category: "Management",
        imageSrc: "/photos/image-1.png",
      },
      {
        slug: "leader-playbook-governance",
        title: "Leadership playbook: governance without blockers",
        excerpt: "How to set guardrails that protect the business while keeping delivery velocity high.",
        author: "Brooklyn Simmons",
        dateLabel: "05 Jan 2022",
        category: "Leadership",
        imageSrc: "/photos/meet-our-wonderfully-versatile-crayoncaptains-they-re-the-captain-kirks.jpg",
      },
      {
        slug: "shipping-with-human-in-the-loop",
        title: "Shipping with humans in the loop",
        excerpt: "When to automate, when to escalate, and how to design reviews that feel invisible to users.",
        author: "Drew Cano",
        dateLabel: "03 Jan 2022",
        category: "Product",
        imageSrc: "/photos/b9d431ab5b90a091a14c6c568f2fa4dc.webp",
      },
      {
        slug: "interview-building-agent-stores",
        title: "Interview: what it takes to build an agent store",
        excerpt: "A candid conversation on curation, compliance, and making agents discoverable for teams.",
        author: "Alec Whitten",
        dateLabel: "02 Jan 2022",
        category: "Interviews",
        imageSrc: "/photos/images (1).jpeg",
      },
      {
        slug: "from-pilot-to-platform",
        title: "From pilot to platform: making AI stick",
        excerpt: "A practical path from early proofs to production systems that teams actually use every day.",
        author: "Marvin McKinney",
        dateLabel: "30 Dec 2021",
        category: "Management",
        imageSrc: "/photos/our-cto-and-co-founder-vijaya-kumar-ivaturi-was-recently-published-in.webp",
      },
    ],
    []
  );

  const [activeCategory, setActiveCategory] = useState<BlogCategory>("View all");

  const filteredPosts = useMemo(() => {
    if (activeCategory === "View all") return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [activeCategory, posts]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="flex-grow pt-32 pb-16 relative overflow-hidden"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #FFF1E5 0%, #FFF1E5 30%, rgba(255, 255, 255, 0.8) 60%, #FFF 100%)",
        }}
      >
        <div
          style={{
            width: "calc(100% - 40px)",
            maxWidth: "1472px",
            margin: "0 auto",
            paddingLeft: "25px",
            paddingRight: "25px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Header row (matches reference layout) */}
          <div className="flex flex-col gap-8" style={{ marginTop: "64px", marginBottom: "28px" }}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6" style={{ marginTop: "24px" }}>
              <div className="min-w-0">
                <h1
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "48px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "60px",
                    margin: 0,
                  }}
                >
                  Untitled Blogs
                </h1>
              </div>

              <div className="flex flex-col items-start md:items-end gap-4">
                <p
                  className="max-w-md"
                  style={{
                    color: "#4B5563",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "22px",
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  New product features, the latest in technology, solutions, and updates.
                </p>

                {/* Subscribe (moved to the right) */}
                <form className="flex flex-col sm:flex-row sm:items-center gap-3" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="blog-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="blog-email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full sm:w-[320px] h-11 rounded-full border border-[#E5E7EB] bg-white px-4 text-sm outline-none"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                  <button
                    type="submit"
                    className="h-11 rounded-full bg-[#111827] text-white px-6 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ borderBottom: "1px solid #E5E7EB" }}>
              <div
                className="flex gap-6 overflow-x-auto"
                style={{ paddingTop: "8px", paddingBottom: "10px", marginTop: "48px" }}
              >
                {categories.map((c) => {
                  const isActive = c === activeCategory;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveCategory(c)}
                      className="relative whitespace-nowrap"
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: isActive ? "#111827" : "#6B7280",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 400,
                        lineHeight: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {c}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: "-11px",
                            height: "2px",
                            backgroundColor: "#111827",
                            borderRadius: "999px",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Posts (featured + grid) */}
          <div className="flex flex-col" style={{ paddingTop: "6px", gap: "40px" }}>
            {featuredPost && (
              <article className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Left: text */}
                <div className="min-w-0">
                  <span
                    className="inline-block"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.6px",
                      textTransform: "uppercase",
                      color: "#6B7280",
                      border: "1px solid #E5E7EB",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      marginBottom: "14px",
                    }}
                  >
                    {featuredPost.author}
                  </span>
                  <h2
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "40px",
                      lineHeight: "1.15",
                      fontWeight: 600,
                      color: "#111827",
                      margin: 0,
                      marginBottom: "14px",
                    }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                      lineHeight: "24px",
                      fontWeight: 400,
                      color: "#6B7280",
                      margin: 0,
                      marginBottom: "18px",
                      maxWidth: "560px",
                    }}
                  >
                    {featuredPost.excerpt}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#111827",
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "default",
                      opacity: 0.8,
                    }}
                    aria-disabled="true"
                    title="Coming soon"
                  >
                    Read post <ArrowUpRight size={14} aria-hidden="true" />
                  </button>
                </div>

                {/* Right: image */}
                <div className="relative w-full overflow-hidden rounded-xl bg-[#F3F4F6]" style={{ minHeight: "220px" }}>
                  <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
                    <Image
                      src={featuredPost.imageSrc}
                      alt={featuredPost.title}
                      fill
                      sizes="(min-width: 768px) 640px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </article>
            )}

            {/* Grid cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {gridPosts.map((post) => (
                <article key={post.slug} className="min-w-0">
                  <div className="relative w-full overflow-hidden rounded-xl bg-[#F3F4F6] border border-[#E5E7EB]">
                    <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
                      <Image
                        src={post.imageSrc}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <span
                      className="inline-block"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "12px",
                        fontWeight: 600,
                        letterSpacing: "0.6px",
                        textTransform: "uppercase",
                        color: "#6B7280",
                        border: "1px solid #E5E7EB",
                        borderRadius: "6px",
                        padding: "2px 8px",
                        marginBottom: "10px",
                      }}
                    >
                      {post.author}
                    </span>
                    <h3
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "18px",
                        lineHeight: "26px",
                        fontWeight: 600,
                        color: "#111827",
                        margin: 0,
                        marginBottom: "8px",
                      }}
                    >
                      {post.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        lineHeight: "22px",
                        fontWeight: 400,
                        color: "#6B7280",
                        margin: 0,
                        marginBottom: "10px",
                      }}
                    >
                      {post.excerpt}
                    </p>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#111827",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "default",
                        opacity: 0.8,
                      }}
                      aria-disabled="true"
                      title="Coming soon"
                    >
                      Read post <ArrowUpRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

