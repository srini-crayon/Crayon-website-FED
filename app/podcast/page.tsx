"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Database, Flame, Keyboard, MessageSquareText, Mic, Zap } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function PodcastPage() {
  const episodeBadgeOptions = ["Data", "AI", "entrepreneurship"] as const;

  const getEpisodeBadge = (key: string) => {
    // Deterministic "random" pick so it doesn't change on re-render.
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return episodeBadgeOptions[hash % episodeBadgeOptions.length];
  };

  const heroIcons = [
    {
      Component: MessageSquareText,
      size: 42,
      strokeWidth: 2.2,
      style: { top: "24px", right: "24px", color: "#0B1BFF" },
    },
    {
      Component: Zap,
      size: 44,
      strokeWidth: 2.4,
      style: {
        left: "120px",
        top: "50%",
        transform: "translateY(-50%) rotate(-12deg)",
        color: "#0B1BFF",
      },
    },
    {
      Component: Mic,
      size: 40,
      strokeWidth: 2.2,
      style: {
        right: "120px",
        top: "50%",
        transform: "translateY(-50%) rotate(8deg)",
        color: "#0B1BFF",
      },
    },
    {
      Component: Flame,
      size: 40,
      strokeWidth: 2.2,
      style: {
        left: "80px",
        bottom: "18%",
        transform: "rotate(-10deg)",
        color: "#0B1BFF",
      },
    },
    {
      Component: Database,
      size: 38,
      strokeWidth: 2.1,
      style: {
        right: "90px",
        bottom: "16%",
        transform: "rotate(6deg)",
        color: "#0B1BFF",
      },
    },
    {
      Component: Keyboard,
      size: 40,
      strokeWidth: 2.2,
      style: {
        left: "50%",
        top: "12%",
        transform: "translateX(-50%) rotate(4deg)",
        color: "#0B1BFF",
      },
    },
  ] as const;

  const hosts = [
    {
      name: "Suresh Shankar",
      imageSrc: "/img/meet-the-host.png",
      bio: (
        <>
          Suresh Shankar, Founder &amp; CEO of Crayon Data, is the host of the podcast,
          Slaves to the Algo. An AI, big data, and analytics evangelist, he is a 2nd-time
          entrepreneur. Suresh enjoys deadly cocktails: of data and intuition, right and
          left brain, long-term persistence and short-term impatience. What gets him
          going? Sparky and daring people. And you’ll find plenty of them in
          conversation with him on the podcast!
        </>
      ),
    },
    {
      name: "Tejeswini Kashyappan",
      imageSrc: "/placeholder-user.jpg",
      bio: (
        <>
          Tejeswini Kashyappan.
          <br />
          <br />
          More details coming soon.
        </>
      ),
    },
  ] as const;

  const episodeCards = [
    {
      type: "press",
      title: "Building the enterprise of tomorrow",
      speaker: "DR. CJ Meadows",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(126, 76, 58, 0.95) 0%, rgba(126, 76, 58, 0) 60%), linear-gradient(135deg, #6D3C2C 0%, #1B1A1A 100%)",
      portraitSrc: "/img/episode-portrait-press.png",
      portraitPosition: "50% 50%",
    },
    {
      type: "press",
      title: "Using creativity to empower technology",
      speaker: "Rishad Tobaccowala",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(24, 140, 170, 0.92) 0%, rgba(24, 140, 170, 0) 60%), linear-gradient(135deg, #1C6D7F 0%, #173A3F 100%)",
      portraitSrc: "/img/episode-portrait-2.png",
      portraitPosition: "50% 40%",
    },
    {
      type: "interview",
      title: "A social entrepreneur’s playbook",
      speaker: "Lucia Gallardo",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(255, 153, 51, 0.92) 0%, rgba(255, 153, 51, 0) 60%), linear-gradient(135deg, #B56A1E 0%, #5A3A21 100%)",
      portraitSrc: "/img/meet-the-host.png",
      portraitPosition: "50% 25%",
    },
    {
      type: "interview",
      title: "The future of AI in financial services",
      speaker: "Sarah Chen",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(147, 51, 234, 0.92) 0%, rgba(147, 51, 234, 0) 60%), linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
      portraitSrc: "/img/episode-portrait-2.png",
      portraitPosition: "50% 35%",
    },
    {
      type: "press",
      title: "Navigating digital transformation in banking",
      speaker: "Michael Rodriguez",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(239, 68, 68, 0.92) 0%, rgba(239, 68, 68, 0) 60%), linear-gradient(135deg, #DC2626 0%, #7F1D1D 100%)",
      portraitSrc: "/img/episode-portrait-press.png",
      portraitPosition: "50% 45%",
    },
    {
      type: "interview",
      title: "Data privacy in the age of personalization",
      speaker: "Dr. Priya Sharma",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(16, 185, 129, 0.92) 0%, rgba(16, 185, 129, 0) 60%), linear-gradient(135deg, #059669 0%, #064E3B 100%)",
      portraitSrc: "/img/meet-the-host.png",
      portraitPosition: "50% 30%",
    },
    {
      type: "press",
      title: "Leading with empathy in tech",
      speaker: "James Patterson",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(251, 146, 60, 0.92) 0%, rgba(251, 146, 60, 0) 60%), linear-gradient(135deg, #EA580C 0%, #7C2D12 100%)",
      portraitSrc: "/img/episode-portrait-2.png",
      portraitPosition: "50% 38%",
    },
    {
      type: "interview",
      title: "Customer experience in the digital era",
      speaker: "Emma Thompson",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(59, 130, 246, 0.92) 0%, rgba(59, 130, 246, 0) 60%), linear-gradient(135deg, #2563EB 0%, #1E3A8A 100%)",
      portraitSrc: "/img/episode-portrait-press.png",
      portraitPosition: "50% 42%",
    },
    {
      type: "press",
      title: "Building sustainable tech ecosystems",
      speaker: "David Kim",
      gradient:
        "radial-gradient(85% 95% at 55% 85%, rgba(236, 72, 153, 0.92) 0%, rgba(236, 72, 153, 0) 60%), linear-gradient(135deg, #DB2777 0%, #831843 100%)",
      portraitSrc: "/img/meet-the-host.png",
      portraitPosition: "50% 28%",
    },
  ] as const;

  const [episodeFilter, setEpisodeFilter] = useState<"all" | "press" | "interview">("all");

  const filteredEpisodeCards = useMemo(() => {
    if (episodeFilter === "all") return episodeCards;
    return episodeCards.filter((c) => c.type === episodeFilter);
  }, [episodeFilter, episodeCards]);

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="flex-grow pt-32 pb-16 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 88%), radial-gradient(120% 100% at 50% 0%, #F3FF85 0%, #D9FF00 45%, #C7F000 100%)",
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
          {/* Hype Cycle hero (inspired by reference) */}
          <div
            className="relative flex items-center justify-center"
            style={{
              minHeight: "calc(100vh - 160px)",
              paddingTop: "40px",
              paddingBottom: "40px",
            }}
          >
            {/* Decorative icons */}
            {heroIcons.map(({ Component, size, strokeWidth, style }, idx) => (
              <Component
                key={idx}
                aria-hidden="true"
                className="hidden md:block"
                style={{ position: "absolute", ...style }}
                size={size}
                strokeWidth={strokeWidth}
              />
            ))}

            {/* Center stack */}
            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#0B1BFF",
                  margin: 0,
                  fontSize: "clamp(56px, 8vw, 120px)",
                  lineHeight: 0.9,
                  textTransform: "lowercase",
                }}
              >
                the
                <br />
                hype
                <br />
                cycle
              </h1>

              <div
                style={{
                  marginTop: "14px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: "#0B1BFF",
                  fontSize: "clamp(14px, 2vw, 18px)",
                }}
              >
                PODCAST
              </div>

              <div
                style={{
                  marginTop: "22px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "rgba(11, 27, 255, 0.85)",
                  fontSize: "clamp(12px, 1.6vw, 16px)",
                }}
              >
                Riding the Waves of Trends
              </div>
            </div>
          </div>

          {/* Next section: platform buttons */}
          <div
            style={{
              position: "relative",
              left: "50%",
              right: "50%",
              marginLeft: "-50vw",
              marginRight: "-50vw",
              width: "100vw",
              background: "transparent",
              overflow: "visible",
              marginTop: "10px",
              marginBottom: "40px",
            }}
          >
            {/* decorative opposite-tilt ribbon (behind) */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "-8px",
                left: "-3vw",
                width: "106vw",
                height: "100%",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.25) 100%), #1A1A1A",
                transform: "rotate(1.2deg)",
                transformOrigin: "center",
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "relative",
                left: "-3vw",
                width: "106vw",
                background: "#0B0B0B",
                transform: "rotate(-1.2deg)",
                transformOrigin: "center",
                padding: "20px 0",
                zIndex: 1,
              }}
            >
              <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 25px" }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <h2
                  className="text-center md:text-left"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "clamp(16px, 1.6vw, 22px)",
                    lineHeight: "1.15",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.92)",
                    whiteSpace: "nowrap",
                    margin: 0,
                  }}
                >
                  Listen on your preferred platform!
                </h2>

                <div
                  className="flex flex-col sm:flex-row items-center justify-center md:justify-end"
                  style={{ gap: "24px" }}
                >
                  {/* Apple Podcasts */}
                  <a
                    href="https://podcasts.apple.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src="/img/Apple-Podcasts.svg"
                      alt="Listen on Apple Podcasts"
                      style={{ width: "224px", height: "54px", display: "block" }}
                    />
                  </a>

                  {/* Google Podcasts */}
                  <a
                    href="https://podcasts.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src="/img/Google-Podcasts.svg"
                      alt="Listen on Google Podcasts"
                      style={{ width: "224px", height: "54px", display: "block" }}
                    />
                  </a>

                  {/* Spotify */}
                  <a
                    href="https://open.spotify.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      display: "inline-block",
                      lineHeight: 0,
                    }}
                  >
                    <img
                      src="/img/Spotify-Podcasts.svg"
                      alt="Listen on Spotify"
                      style={{ width: "224px", height: "54px", display: "block" }}
                    />
                  </a>
                </div>
              </div>
            </div>
            </div>
          </div>

        </div>
      </section>

      {/* Meet the Host */}
      <section className="bg-white py-16 md:py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          <h2
            className="text-center fade-in-blur text-3xl md:text-4xl font-semibold text-[#161d26]"
            style={{
              textAlign: "center",
              fontFamily: "Poppins, sans-serif",
              maxWidth: "780px",
              width: "100%",
              margin: "0 auto 28px",
              willChange: "opacity, transform, filter",
            }}
          >
            Meet our Host&apos;s
          </h2>

          <Carousel
            className="mx-auto w-full max-w-5xl"
            opts={{ loop: true, align: "center" }}
          >
            <CarouselContent>
              {hosts.map((host) => (
                <CarouselItem key={host.name}>
                  <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-8">
                    <div className="flex items-center justify-center md:justify-self-center">
                      <Image
                        src={host.imageSrc}
                        alt={host.name}
                        width={560}
                        height={560}
                        style={{
                          width: "100%",
                          maxWidth: "clamp(220px, 30vw, 340px)",
                          height: "auto",
                        }}
                        priority={host.name === "Suresh Shankar"}
                        unoptimized
                      />
                    </div>

                    <div className="w-full text-center md:w-auto md:max-w-[560px] md:justify-self-center">
                      <p
                        style={{
                          marginTop: "16px",
                          marginLeft: "auto",
                          marginRight: "auto",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          color: "#4B5563",
                          fontSize: "16px",
                          lineHeight: "28px",
                          maxWidth: "560px",
                        }}
                      >
                        {host.bio}
                      </p>

                      <Image
                        src="/img/meet-host-divider.png"
                        alt=""
                        width={560}
                        height={12}
                        style={{
                          marginTop: "18px",
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                          width: "clamp(160px, 24vw, 240px)",
                          height: "auto",
                        }}
                        unoptimized
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 md:-left-10" />
            <CarouselNext className="right-2 md:-right-10" />
          </Carousel>
        </div>
      </section>

      {/* Watch the Latest Episodes */}
      <section className="bg-white py-16 md:py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 32px",
          }}
        >
          <div className="text-center">
            <h2
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "clamp(28px, 3.2vw, 48px)",
                lineHeight: "1.1",
                fontWeight: 300,
                color: "#111827",
                margin: 0,
              }}
            >
              Watch the Latest Episodes
            </h2>
            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                fontFamily: "Poppins, sans-serif",
                fontSize: "16px",
                lineHeight: "28px",
                fontWeight: 400,
                color: "rgba(17, 24, 39, 0.72)",
              }}
            >
              All three seasons now live on Crayon Data’s YouTube channel!
            </p>
          </div>

          {/* Episode cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center justify-center">
              <Tabs
                value={episodeFilter}
                onValueChange={(v) => setEpisodeFilter(v as "all" | "press" | "interview")}
                className="items-center gap-3"
              >
                <TabsList className="bg-transparent h-auto rounded-none p-0 gap-8">
                  <TabsTrigger
                    value="all"
                    className="flex-none bg-transparent px-0 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="press"
                    className="flex-none bg-transparent px-0 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Press
                  </TabsTrigger>
                  <TabsTrigger
                    value="interview"
                    className="flex-none bg-transparent px-0 py-2 rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Interview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {filteredEpisodeCards.map((card) => (
              <div
                key={card.title}
                className="relative overflow-hidden"
                style={{
                  borderRadius: "8px",
                  background: card.gradient,
                  height: "480px",
                  boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
                }}
              >
                {/* Play button */}
                <button
                  type="button"
                  aria-label="Play"
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    width: "38px",
                    height: "38px",
                    borderRadius: "9999px",
                    border: "1px solid rgba(255,255,255,0.55)",
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    zIndex: 3,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 7.8v8.4c0 .8.9 1.3 1.6.9l7-4.2c.6-.4.6-1.3 0-1.7l-7-4.2c-.7-.4-1.6.1-1.6.8Z"
                      fill="rgba(255,255,255,0.9)"
                    />
                  </svg>
                </button>

                <div style={{ padding: "26px", position: "relative", zIndex: 2 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "rgba(255,255,255,0.82)",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      letterSpacing: "0.08em",
                      fontWeight: 500,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "9999px",
                        background: "rgba(255,255,255,0.9)",
                        display: "inline-block",
                      }}
                    />
                    {getEpisodeBadge(card.title)}
                  </div>

                  <h3
                    style={{
                      marginTop: "16px",
                      marginBottom: 0,
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "22px",
                      lineHeight: "1.25",
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.94)",
                      maxWidth: "100%",
                    }}
                  >
                    {card.title}
                  </h3>

                  {card.speaker ? (
                    <div
                      style={{
                        marginTop: "10px",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        lineHeight: "20px",
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      - {card.speaker}
                    </div>
                  ) : null}
                </div>

                {/* soft fade at bottom (like reference) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "160px",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 100%)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* circle backdrop */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "14px",
                    transform: "translateX(-50%)",
                    width: "300px",
                    height: "300px",
                    borderRadius: "9999px",
                    background: "rgba(255,255,255,0.06)",
                    filter: "blur(0px)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                />

                {/* portrait circle */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: "22px",
                    transform: "translateX(-50%)",
                    width: "280px",
                    height: "280px",
                    borderRadius: "9999px",
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.08)",
                    zIndex: 1,
                  }}
                >
                  <Image
                    src={card.portraitSrc}
                    alt=""
                    width={680}
                    height={680}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: card.portraitPosition,
                    }}
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}

