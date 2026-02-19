"use client";

import { useEffect } from "react";
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
import { Search, FlaskConical, Rocket, Lightbulb, Wrench, Globe } from "lucide-react";

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
          <h1 className="fade-in-blur text-gray-900 font-poppins text-2xl md:text-3xl font-bold leading-tight mb-8 tracking-tight whitespace-nowrap">
            Pioneer. Veteran. <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Reinvented.</span>
          </h1>

          {/* Subheading/Intro */}
          <div className="fade-in-section text-gray-600 font-poppins text-lg md:text-xl font-light leading-relaxed max-w-3xl space-y-6">
            <p>
              How can Crayon Data be an AI pioneer but be 12 years old? How should we talk about our past and our future? Are we a new company bursting with new ideas, or a veteran of many battles?
            </p>
            <div className="py-2">
              <span className="inline-block px-4 py-2 rounded-full bg-cyan-50 text-cyan-700 font-medium text-base border border-cyan-100">
                How about…. both!
              </span>
            </div>
            <p className="text-cyan-600 font-medium text-2xl md:text-3xl tracking-tight">
              Welcome to the new Crayon Data. To understand the new Crayon, we must start with the original Crayon Data.
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
                The origins
              </h2>
              <div className="text-gray-600 font-poppins text-lg leading-relaxed space-y-6 font-light">
                <p>
                  Truth be told, Crayon Data didn’t enter the AI arena yesterday. We started in 2012 when big data was a buzzword and AI wasn’t a thing.
                </p>
                <div className="border-l-4 border-cyan-500 pl-6 py-2">
                  <p className="text-gray-800 font-medium text-xl italic">
                    Our vision then was to simplify the world’s choices, by making it easy for people to act on the information that was flooding their lives. We believed then that the future of data was algorithms, not people.
                  </p>
                </div>
                <p>
                  We were AI pioneers. We built the TasteGraph, one of the world’s first graph database led applications. We hold 3 patents, and a few more in the pipeline. We developed an entirely new model of consumer behaviour and a personalisation engine called maya.ai to translate that into reality. We really know machine learning and heuristic AI.
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
                    {["HDFC Bank", "ADIB", "Neom", "KBZ Bank", "HSBC", "Mashreq", "Emirates Airlines", "Visa"].map((client) => (
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
              The learnings
            </h2>
            <p className="fade-in-blur text-gray-500 font-poppins text-xl font-light">
              We realised that AI is easy to demo. It is brutally hard to run at scale. We know this because we’ve spent 12 years in the trenches.
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
                title: "AI was not SaaS.",
                text: "We could not do AI without forward deployed engineers and services that integrated into messy enterprise systems.",
                icon: <Wrench className="w-10 h-10 text-slate-500" strokeWidth={1.5} />,
                bg: "bg-slate-50",
                border: "border-slate-100"
              },
              {
                title: "Pilots and scale.",
                text: "We spent many quarters creating pilots and building MVPs, and were successful in operating large scale enterprise AI systems.",
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
            <p className="text-gray-900 font-poppins text-xl md:text-2xl font-bold leading-snug mb-4">
              We learned something most vendors won’t say out loud: Enterprise AI doesn’t fail because of the tech and the model.
            </p>
            <p className="text-cyan-700 font-poppins text-lg md:text-xl font-semibold leading-snug mb-8">
              It fails because enterprises are not built to run it. The problem isn’t the AI. It is everything around it.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {["Integrations", "Governance", "Adoption", "Scale"].map((tag) => (
                <span key={tag} className="px-5 py-2.5 bg-white text-gray-800 shadow-sm rounded-full text-sm font-semibold uppercase tracking-wide border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Present & The Future Section - Two cards in same row */}
      <section className="bg-white py-20 relative">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: The Present */}
            <div className="fade-in-section flex flex-col">
              <div className="relative isolate bg-white/60 backdrop-blur-xl rounded-3xl p-10 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden h-full flex flex-col">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-100 rounded-full blur-3xl opacity-50 -z-10" />

                <h2 className="text-gray-900 font-poppins text-3xl font-bold leading-tight mb-6">
                  The present
                </h2>
                <div className="text-gray-600 font-poppins text-lg leading-relaxed space-y-6 font-light flex-1">
                  <p>
                    Two years ago, we realized that GenAI and Agentic AI had changed the game. It made our lives easier, and harder.
                  </p>
                  <p>
                    Easier — faster and cheaper to build. Harder because of the hype, the rapidity of tech changes and the inability of enterprises to move as fast as the tech.
                  </p>
                  <p>
                    We know all about incredible pilots that never reach production. We’ve seen smart proofs of concept die in the face of enterprise compliance, latency, and fragmentation. We needed to re-invent.
                  </p>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                    <p className="font-poppins text-lg font-medium text-gray-800 italic">
                      So we asked ourselves the hardest question of all: What would we do if we started Crayon Data today?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: The Future */}
            <div className="fade-in-section flex flex-col">
              <div className="relative isolate bg-white/60 backdrop-blur-xl rounded-3xl p-10 md:p-12 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-900/5 overflow-hidden h-full flex flex-col">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 -z-10" />

                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 font-poppins text-3xl font-bold leading-tight mb-6">
                  The future
                </h2>
                <p className="text-gray-600 font-poppins text-lg leading-relaxed mb-6">
                  Over the last 12 months, we’ve used our real world experience to re-design Crayon Data for the world of GPTs and LLMs, agentic and generative AI.
                </p>
                <div className="space-y-6 text-gray-700 font-poppins text-lg leading-relaxed flex-1">
                  <p>
                    We decided to sunset maya.ai and convert it (over time) to a new agentic platform that we call tangram.ai.
                  </p>
                  <p>
                    It’s not just a re-brand — it is changing the core of the code.
                  </p>
                  <p>
                    Today, we operate on a simple, unapologetic belief: Enterprise AI works only when platform and execution move together. The new Crayon Data exists to bridge the gap between AI ambition and execution.
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
          <div className="text-center mb-8 max-w-4xl mx-auto">
            <h2 className="fade-in-blur text-gray-900 font-poppins text-4xl font-bold mb-2">
              Our new vision
            </h2>
            <p className="fade-in-blur text-gray-500 font-poppins text-xl leading-relaxed">
              Simplify AI success – for the enterprise.
            </p>
          </div>

          <h3 className="fade-in-section text-gray-900 font-poppins text-3xl font-bold text-center mb-10 max-w-3xl mx-auto">
            Make it easy for them to discover, try and deploy real AI solutions.
          </h3>

          <div className="fade-in-section grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Search className="w-10 h-10 text-cyan-500" strokeWidth={1.5} />, text: "Discover", bg: "bg-cyan-50", border: "border-cyan-100" },
              { icon: <FlaskConical className="w-10 h-10 text-purple-500" strokeWidth={1.5} />, text: "Try", bg: "bg-purple-50", border: "border-purple-100" },
              { icon: <Rocket className="w-10 h-10 text-blue-500" strokeWidth={1.5} />, text: "Deploy", bg: "bg-blue-50", border: "border-blue-100" },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center gap-4 rounded-2xl p-8 border ${item.border} ${item.bg} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                  {item.icon}
                </div>
                <p className="text-gray-900 font-poppins text-lg font-semibold tracking-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="fade-in-section w-full flex justify-center">
            <div className="inline-flex flex-col md:flex-row items-center justify-center gap-3 px-8 py-3 rounded-full bg-gray-900 text-white font-poppins text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors cursor-default">
              <span>No lock-ins.</span>
              <span className="w-1 h-1 bg-gray-500 rounded-full hidden md:block"></span>
              <span>No proprietary platforms.</span>
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
              Our new strategy: a triple-engine business model
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                id: "1",
                name: "Tangram AI",
                role: "The Platform",
                desc: "Our army of digital workers that we bring to your battle. 100s of pre-built production ready, enterprise grade agentic and generative AI solutions that solve real-world enterprise use cases. Powered by a model and vendor agnostic open-source platform that does not lock you in. And that can be deployed in enterprise environments fast.",
                color: "text-cyan-600",
                bg: "bg-cyan-50",
                border: "border-cyan-100"
              },
              {
                id: "2",
                name: "Catalyst",
                role: "The productised services",
                desc: "Our productised set of services, that ensures accelerated deployment whatever the enterprise's stage of readiness: Labs to ideate and build prototypes, Foundry to deploy in your environment and on your data, and Factory to scale and run the operations.",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100"
              },
              {
                id: "3",
                name: "Tangram AI store",
                role: "The ecosystem",
                desc: "We don't believe we have all the answers or solutions. So we are inviting other ISVs and start-ups to list on our store so we can show enterprises a range of specialised solutions. And we are inviting distributors and SIs to use our range of solutions for the success of their clients.",
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
              The first ensures speed. The second drives adoption. The third delivers distribution scale.
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
                <p className="text-white font-semibold text-2xl tracking-tight">That’s the journey ahead.</p>
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
