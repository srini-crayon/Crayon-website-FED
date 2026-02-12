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
import { Search, FlaskConical, Rocket, Lightbulb, Wrench, Globe, CheckCircle2 } from "lucide-react";

export default function OurStoryPage() {
  // Scroll animations with IntersectionObserver (matching other pages)
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
            }
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .fade-in-blur, .scale-in"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .fade-in-blur, .scale-in"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      {/* Breadcrumb Section */}
      <section className="pt-8 pb-4 fade-in-section bg-white">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-gray-500 font-poppins text-sm hover:text-cyan-600 transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-poppins text-sm font-medium">
                  Our Story
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20">
        <div className="w-full max-w-[1420px] mx-auto px-5 flex flex-col items-center text-center">
          {/* Section Label */}
          <div className="fade-in-blur text-cyan-500 font-poppins text-sm font-medium tracking-widest uppercase mb-4">
            OUR STORY
          </div>

          {/* Main Heading */}
          <h1 className="fade-in-blur text-gray-900 font-poppins text-5xl md:text-7xl font-bold leading-tight mb-8 max-w-4xl tracking-tight">
            Pioneer. Veteran. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Reinvented.</span>
          </h1>

          {/* Subheading/Intro */}
          <div className="fade-in-section text-gray-600 font-poppins text-lg md:text-xl font-light leading-relaxed max-w-3xl space-y-6">
            <p>
              How can Crayon Data be an AI pioneer — and be 12 years old? Are we a new company bursting with ideas, or a veteran of many battles?
            </p>
            <div className="py-2">
              <span className="inline-block px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-medium text-base border border-cyan-100">
                The answer is simple: Both.
              </span>
            </div>
            <p className="text-cyan-600 font-medium text-2xl md:text-3xl tracking-tight">
              Welcome to the new Crayon Data.
            </p>
          </div>
        </div>

      </section>

      {/* The Origins Section */}
      <section className="bg-gray-50 py-20 relative overflow-hidden">
        <div className="w-full max-w-[1420px] mx-auto px-5 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
            {/* Left Text */}
            <div className="fade-in-section flex-1 space-y-8">
              <h2 className="text-gray-900 font-poppins text-4xl font-bold leading-tight">
                The Origins
              </h2>
              <div className="text-gray-600 font-poppins text-lg leading-relaxed space-y-6 font-light">
                <p>
                  We didn’t enter AI yesterday. We started in 2012 — when big data was a buzzword and AI wasn’t yet mainstream.
                </p>
                <div className="border-l-4 border-cyan-500 pl-6 py-2">
                  <p className="text-gray-800 font-medium text-xl italic">
                    "Our vision was bold: To simplify the world’s choices by making it easy for people to act on the flood of information around them."
                  </p>
                </div>
                <p>
                  We pioneered graph-database-led applications with TasteGraph. We developed maya.ai, a personalisation engine built on a new model of consumer behaviour. We hold three patents, with more in the pipeline.
                </p>
              </div>
            </div>

            {/* Right Card - Premium Stat Card */}
            <div className="fade-in-section flex-1 w-full max-w-lg">
              <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Globe className="w-24 h-24 text-cyan-500" strokeWidth={1} />
                </div>

                <div className="space-y-8 relative z-10">
                  <div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Impact at Scale</p>
                    <p className="text-gray-900 text-2xl font-medium leading-snug">
                      Built <span className="text-cyan-600 font-bold text-4xl block mt-1">200 million</span> customer genomes.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-900 text-2xl font-medium leading-snug">
                      Served <span className="text-cyan-600 font-bold text-4xl block mt-1">100 million</span> users globally.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-4">Trusted By Leaders</p>
                  <div className="flex flex-wrap gap-2">
                    {["HDFC Bank", "ADIB", "Neom", "HSBC", "Mashreq", "Visa", "Mastercard"].map((client) => (
                      <span key={client} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200">
                        {client}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Learnings Section */}
      <section className="bg-white py-24">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="fade-in-blur text-gray-900 font-poppins text-4xl font-bold mb-6">
              The Learnings
            </h2>
            <p className="fade-in-blur text-gray-500 font-poppins text-xl font-light">
              Over 12 years in the trenches, we learned something critical:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "AI is easy to demo.",
                text: "It is brutally hard to run at scale.",
                icon: <Lightbulb className="w-10 h-10 text-yellow-500" strokeWidth={1.5} />,
                bg: "bg-yellow-50",
                border: "border-yellow-100"
              },
              {
                title: "AI is not SaaS.",
                text: "It cannot be sold and left alone.",
                icon: <Wrench className="w-10 h-10 text-slate-500" strokeWidth={1.5} />,
                bg: "bg-slate-50",
                border: "border-slate-100"
              },
              {
                title: "It requires context.",
                text: "Governance, compliance, and discipline.",
                icon: <Globe className="w-10 h-10 text-blue-500" strokeWidth={1.5} />,
                bg: "bg-blue-50",
                border: "border-blue-100"
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`scale-in group bg-white hover:${item.bg} border border-gray-100 hover:${item.border} rounded-2xl p-8 flex flex-col items-center text-center gap-6 transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                <div className={`p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-gray-900 font-poppins text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 font-poppins text-base leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="fade-in-section max-w-4xl mx-auto bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-10 md:p-14 text-center border border-cyan-100 shadow-inner">
            <h3 className="text-gray-900 font-poppins text-2xl md:text-3xl font-bold leading-tight mb-6">
              Enterprise AI doesn’t fail because of the model.<br />
              <span className="text-cyan-700 block mt-2">It fails because enterprises are not built to run it.</span>
            </h3>
            <div className="inline-flex flex-wrap justify-center gap-3 md:gap-6 mt-4">
              {["Integration", "Governance", "Adoption", "Scale"].map((tag) => (
                <span key={tag} className="px-5 py-2 bg-white text-gray-800 shadow-sm rounded-full text-sm font-semibold uppercase tracking-wide border border-gray-100">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Reinvention Section */}
      <section className="bg-white py-20 relative">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Content */}
            <div className="fade-in-section flex-1 space-y-6">
              <div className="inline-block px-3 py-1 bg-purple-50 text-purple-600 rounded-md text-xs font-bold uppercase tracking-wider mb-2">Evolution</div>
              <h2 className="text-gray-900 font-poppins text-4xl font-bold leading-tight">
                The Reinvention
              </h2>
              <div className="text-gray-600 font-poppins text-lg leading-relaxed space-y-6 font-light">
                <p>
                  Two years ago, GenAI and Agentic AI changed the game. It became easier, faster, and cheaper to build.
                </p>
                <p>
                  It also became noisier. Hype accelerated. Technology evolved faster than enterprises could absorb.
                </p>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-6">
                  <p className="font-poppins text-lg font-medium text-gray-800 italic">
                    "If we started Crayon Data today — what would we build?"
                  </p>
                </div>
              </div>
            </div>

            {/* Right Card - Glassmorphism style */}
            <div className="fade-in-section flex-1 w-full">
              <div className="relative isolate bg-white/60 backdrop-blur-xl rounded-3xl p-10 md:p-12 border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden">
                {/* Gradient Blob Background */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-50 -z-10"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10"></div>

                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 font-poppins text-3xl font-bold mb-10">
                  So we decided to reinvent.
                </h3>
                <ul className="space-y-6">
                  {[
                    "We sunset maya.ai.",
                    "We redesigned the core of our codebase.",
                    "We rebuilt the company for the world of GPTs, LLMs, generative and agentic AI.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-gray-700 font-poppins text-lg leading-snug group-hover:text-gray-900 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10 pt-8 border-t border-gray-100/50 text-center">
                  <p className="text-gray-900 font-poppins text-xl font-bold">
                    This is not a rebrand. <br />
                    <span className="text-gray-500 font-normal">It is a reinvention.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The New Crayon Data - Enhanced Gradient Card */}
      <section className="bg-gray-50 py-24">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="fade-in-blur text-gray-900 font-poppins text-4xl font-bold mb-6">
              The New Crayon Data
            </h2>
            <p className="fade-in-blur text-gray-500 font-poppins text-xl leading-relaxed">
              Today, we operate on a simple belief: <br className="hidden md:block" />
              <span className="text-gray-900 font-semibold mt-2 inline-block">Enterprise AI works only when platform and execution move together.</span>
            </p>
          </div>

          <div className="fade-in-section bg-white rounded-[32px] p-12 md:p-20 shadow-xl border border-gray-100 text-center max-w-5xl mx-auto relative overflow-hidden group">
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/0 via-transparent to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <h3 className="relative z-10 text-gray-900 font-poppins text-3xl font-bold mb-16">
              Our vision is clear: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Simplify AI Success</span> — for the enterprise.
            </h3>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <Search className="w-12 h-12 text-cyan-500" strokeWidth={1.5} />, text: "Make it easy to discover" },
                { icon: <FlaskConical className="w-12 h-12 text-purple-500" strokeWidth={1.5} />, text: "Make it easy to try" },
                { icon: <Rocket className="w-12 h-12 text-blue-500" strokeWidth={1.5} />, text: "Make it easy to deploy" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-6 group/item hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 group-hover/item:bg-white inset-shadow flex items-center justify-center border border-gray-100 shadow-sm group-hover/item:shadow-lg transition-all duration-300">
                    {item.icon}
                  </div>
                  <p className="text-gray-900 font-poppins text-lg font-semibold tracking-tight">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative z-10 mt-16 inline-flex flex-col md:flex-row items-center gap-3 px-8 py-3 rounded-full bg-gray-900 text-white font-poppins text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors cursor-default">
              <span>No lock-ins.</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full hidden md:block"></span>
              <span>No proprietary traps.</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full hidden md:block"></span>
              <span>No jargon.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Triple Engine Strategy */}
      <section className="bg-white py-24">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="fade-in-blur text-gray-900 font-poppins text-4xl font-bold mb-4">
              Our Triple-Engine Strategy
            </h2>
            <p className="text-gray-500 font-poppins text-lg font-light">
              To make this real, we built a new business model powered by three unique engines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                id: "1",
                name: "Tangram AI",
                role: "The Platform",
                desc: "Hundreds of pre-built, production-ready, enterprise-grade agentic and generative AI solutions.",
                color: "text-cyan-600",
                bg: "bg-cyan-50",
                border: "border-cyan-100"
              },
              {
                id: "2",
                name: "Catalyst",
                role: "Productised Services",
                desc: "Acceleration at every stage of readiness. Labs (Ideate) → Foundry (Deploy) → Factory (Scale).",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100"
              },
              {
                id: "3",
                name: "Tangram Store",
                role: "The Ecosystem",
                desc: "We invite ISVs, Start-ups, Distributors, and SIs to list specialised AI solutions.",
                color: "text-green-600",
                bg: "bg-green-50",
                border: "border-green-100"
              },
            ].map((card) => (
              <div
                key={card.id}
                className={`scale-in group relative bg-white border border-gray-100 hover:${card.border} hover:${card.bg} rounded-2xl p-10 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between">
                  <span className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-sm ${card.color} font-bold text-xl`}>
                    {card.id}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-widest ${card.color} bg-white/50 px-3 py-1 rounded-full border border-gray-100/50`}>
                    {card.role}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-gray-900 font-poppins">
                    {card.name}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed font-light">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto border-t border-gray-100 pt-12">
            <p className="font-poppins text-xl md:text-2xl font-medium italic text-gray-400">
              "The platform ensures speed. Catalyst ensures adoption. The Store ensures distribution scale."
            </p>
          </div>
        </div>
      </section>

      {/* The Road Ahead - Dark Footer Transition */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-[1420px] mx-auto px-5 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="fade-in-blur text-white font-poppins text-4xl font-bold">
              The Road Ahead
            </h2>
            <div className="space-y-8 text-xl text-gray-400 font-light leading-relaxed">
              <p>AI will shape how enterprises operate for the next decade.</p>
              <p>We are focused on making it work. Making it dependable. Making it responsible.</p>

              <div className="pt-12 border-t border-gray-800">
                <p className="text-white font-semibold text-2xl tracking-tight">That is the journey ahead.</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold text-4xl mt-4 tracking-tight">
                  And this is the new Crayon Data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section - Restored and Enhanced */}
      <section className="bg-[#111827] py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Left Content */}
            <div className="flex-1 fade-in-section">
              <div className="relative mb-8 transform hover:scale-105 transition-transform duration-500 origin-left">
                <Image
                  src="/img/awards-graphic.png"
                  alt="Awards"
                  width={200}
                  height={200}
                  unoptimized
                  className="drop-shadow-2xl"
                />
              </div>
              <h2 className="text-5xl font-bold mb-2 tracking-tight">AWARDS</h2>
              <p className="text-2xl text-gray-400 font-light">Lauded and Awarded</p>
            </div>

            {/* Right Content - Logos Grid */}
            <div className="flex-1 w-full fade-in-section">
              <div className="grid grid-cols-2 gap-12 bg-[#1F2937] p-8 rounded-2xl border border-gray-800">
                {[
                  "/img/awards/orange-fab.svg",
                  "/img/awards/ibm-watson.svg",
                  "/img/awards/gartner.svg",
                  "/img/awards/final.svg"
                ].map((src, i) => (
                  <div key={i} className="flex items-center justify-center h-20 relative grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110">
                    <Image
                      src={src}
                      alt="Award Logo"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get to Know Us Better Section (Standard CTA) */}
      <section className="bg-white pt-20 pb-0">
        <div className="w-full max-w-[1420px] mx-auto px-5 text-center relative">
          <div className="fade-in-blur bg-cyan-600 rounded-t-3xl pt-20 pb-20 px-10 relative overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

            <h2 className="text-white font-poppins text-3xl font-bold mb-8 relative z-10">
              Get to Know Us Better
            </h2>
            <Link
              href="/our-values"
              className="fade-in-section inline-block bg-white text-cyan-900 font-poppins text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-lg hover:bg-cyan-50 hover:-translate-y-1 transition-all duration-300 shadow-lg relative z-10"
            >
              Our Values
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Navy Footer Stripe (Standard) */}
      <section className="bg-[#1A2B49] py-10">
        <div className="w-full max-w-[1420px] mx-auto"></div>
      </section>

      <ScrollToTopButton />
    </div>
  );
}
