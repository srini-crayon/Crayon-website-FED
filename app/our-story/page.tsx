"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ScrollToTopButton from "@/components/scroll-to-top-button";

export default function OurStoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      {/* Breadcrumb - left aligned, same margins as page */}
      <section className="pt-8 pb-4 bg-white">
        <div className="w-full max-w-[1420px] mx-auto px-5">
          <Breadcrumb>
            <BreadcrumbList className="justify-start">
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

      {/* Plain document content - page margins only (left/right) */}
      <main className="flex-1 w-full py-12 font-poppins text-gray-800 leading-relaxed">
        <div className="w-full max-w-[1420px] mx-auto px-5">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Crayon data story
        </h1>

        <p className="mb-6">
          How can Crayon Data be an AI pioneer but be 12 years old? How should we talk about our past and our future? Are we a new company bursting with new ideas, or a veteran of many battles?
        </p>

        <p className="mb-6">
          How about…. both!
        </p>

        <p className="mb-10">
          Welcome to the new Crayon Data. To understand the new Crayon, we must start with the original Crayon Data.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          The origins:
        </h2>

        <p className="mb-6">
          Truth be told, Crayon Data didn’t enter the AI arena yesterday. We started in 2012 when big data was a buzzword and AI wasn’t a thing. Our vision then was to simplify the world’s choices, by making it easy for people to act on the information that was flooding their lives. We believed then that the future of data was algorithms, not people
        </p>

        <p className="mb-6">
          We were AI pioneers, we built the TasteGraph, one of the world’s first graph database led applications. We hold 3 patents, and a few more in the pipeline. We developed an entirely new model of consumer behaviour and a personalisation engine called maya.ai to translate that into reality. We really know machine learning and heuristic AI.
        </p>

        <p className="mb-10">
          We have built nearly 200 million customer genomes, deployed our engine for close to 100M customers. We’ve been building and deploying production-grade systems for global giants like HDFC Bank, ADIB, Neom, KBZ Bank, HSBC, Mashreq, Emirates Airlines, and Visa since 2013.
        </p>

        <h2 className="text-xl font-semibold text-violet-600 mb-4">
          The learnings:
        </h2>

        <p className="mb-6">
          We realised that AI is easy to demo. It is brutally hard to run at scale. We know this because we’ve spent 12 years in the trenches.
        </p>

        <p className="mb-6">
          We realised early that AI was not SaaS. That we could not do AI without forward deployed engineers and services that integrated into messy enterprise systems. We spent many quarters creating pilots and building MVPs, and were successful in operating large scale enterprise AI systems.
        </p>

        <p className="mb-10" />

        <h2 className="text-xl font-semibold text-purple-600 mb-4">
          The present:
        </h2>

        <p className="mb-6">
          Two years ago, we realized that GenAI and Agentic AI had changed the game.
        </p>

        <p className="mb-6">
          It made our lives easier, and harder.
        </p>

        <p className="mb-6">
          Easier faster and cheaper to build. Harder because of the hype, the rapidity of tech changes and the inability of enterprises to move as fast as the tech. We know all about incredible pilots that never reach production. We’ve seen smart proofs of concept die in the face of enterprise compliance, latency, and fragmentation.
        </p>

        <p className="mb-6">
          We learned something most vendors won’t say out loud: Enterprise AI doesn’t fail because of the tech and the model. It fails because enterprises are not built to run it. Because innovation happens faster than clients can absorb it
        </p>

        <p className="mb-6">
          The problem isn’t the AI. It is everything around it. Integrations. Governance. Adoption. Scale
        </p>

        <p className="mb-6">
          We needed to re-invent.
        </p>

        <p className="mb-6 py-3 px-4 rounded-lg bg-cyan-50 border-l-4 border-cyan-500 text-gray-900">
          So we asked ourselves the hardest question of all: <span className="font-bold">What would we do if we started Crayon Data today?</span>
        </p>

        <p className="mb-10">
          Which brings us to…
        </p>

        <h2 className="text-xl font-semibold text-cyan-600 mb-4">
          The future:
        </h2>

        <p className="mb-6">
          Over the last 12 months, we’ve used our real world experience to re-design Crayon Data for the world of GPTs and LLMs, agentic and generative AI.
        </p>

        <p className="mb-6">
          We decided to sunset maya.ai and convert it (over time) to a new agentic platform that we call tangram.ai. It’s not just a re-brand, it is changing the core of the code.
        </p>

        <p className="mb-10">
          Today, we operate on a simple, unapologetic belief: Enterprise AI works only when platform and execution move together. The new Crayon Data exists to bridge the gap between AI ambition and execution.
        </p>

        <h2 className="text-xl font-semibold text-blue-600 mb-4">
          Our new vision: Simplify AI success – for the enterprise.
        </h2>

        <p className="mb-6">
          Make it easy for them to discover, try and deploy real AI solutions.
        </p>

        <p className="mb-10">
          No lock-ins. No proprietary platforms. No jargon.
        </p>

        <h2 className="text-xl font-semibold text-indigo-600 mb-6">
          Our new strategy: a triple engine business model
        </h2>

        <p className="mb-4 font-semibold text-gray-900">
          1. Tangram AI (The Platform)
        </p>

        <p className="mb-4 font-semibold text-gray-900">
          2. Catalyst (The productised services)
        </p>

        <p className="mb-8 font-semibold text-gray-900">
          3. Tangram AI store (the ecosystem)
        </p>

        <p className="mb-6">
          <span className="font-semibold text-cyan-600">Tangram AI (The Platform)</span> – Our army of digital workers that we bring to your battle. 100s of pre-built production ready, enterprise grade agentic and generative AI solutions that solve real-world enterprise use cases. Powered by a model and vendor agnostic open-source platform that does not lock you in. And that can be deployed in enterprise environments fast.
        </p>

        <p className="mb-6">
          <span className="font-semibold text-purple-600">Catalyst (The productised services)</span> - Our productised set of services, that ensures accelerated deployment that whatever the enterprise’s stage of readiness, Labs to ideate and build prototypes, Foundry to deploy in your environment and on your data, and Factory to scale and run the operations.
        </p>

        <p className="mb-10">
          <span className="font-semibold text-violet-600">Tangram AI store (the ecosystem)</span> – our ecosystem play. We don’t believe we have all the answers or solutions. So we are inviting other ISVs and start-ups to list on our store so we can show enterprises a range of specialised solutions. And we don’t believe we know or understand all clients and problems. So we are inviting distributors and SIs to use our range of solutions for the success of their clients.
        </p>

        <p className="mb-10">
          The first ensures speed. The second drives adoption. The third delivers distribution scale
        </p>

        <p className="mb-4 leading-tight">
          AI will shape how enterprises operate for the next decade.
          <br />
          We are focused on making it work.
          <br />
          Making it dependable.
          <br />
          Making it responsible.
        </p>

        <p className="mb-4">
          That’s the journey ahead.
        </p>
        </div>
      </main>

      <ScrollToTopButton />
    </div>
  );
}
