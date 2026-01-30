"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// List of photos from the photos directory
// Note: Photos should be in public/photos/ for Next.js to serve them
const photos = [
  "/photos/b9d431ab5b90a091a14c6c568f2fa4dc.webp",
  "/photos/cafdcd970688661c1d3ecef6048098d8.webp",
  "/photos/Crayon-Data-handles-data-with-art-inline.jpg",
  "/photos/crayon-data-tharamani-chennai-software-companies-o0n3rnzfbp-250.avif",
  "/photos/crayon-data-tharamani-chennai-software-companies-t2opts67rp.webp",
  "/photos/crayons-dublinwebsummit.jpg",
  "/photos/image-1.png",
  "/photos/images (1).jpeg",
  "/photos/images.jpeg",
  "/photos/listening-intently-to-a-session-on-our-product-testing-process.webp",
  "/photos/Mask-group-10.png",
  "/photos/meet-our-wonderfully-versatile-crayoncaptains-they-re-the-captain-kirks.jpg",
  "/photos/our-cto-and-co-founder-vijaya-kumar-ivaturi-was-recently-published-in.webp",
];

// Different image size and shape configurations
type PhotoConfig = {
  photo: string;
  width: number;
  height: number;
};

const getRandomPhotoConfig = (): PhotoConfig => {
  const randomIndex = Math.floor(Math.random() * photos.length);
  const photo = photos[randomIndex];
  
  // Different size and shape configurations
  const shapes = [
    // Horizontal rectangles (landscape)
    { width: 280, height: 180 }, // Wide horizontal
    { width: 240, height: 160 }, // Medium horizontal
    { width: 200, height: 140 }, // Small horizontal
    
    // Vertical rectangles (portrait)
    { width: 160, height: 240 }, // Tall vertical
    { width: 140, height: 220 }, // Medium vertical
    { width: 120, height: 200 }, // Small vertical
    
    // Square shapes
    { width: 200, height: 200 }, // Large square
    { width: 180, height: 180 }, // Medium square
    { width: 160, height: 160 }, // Small square
    
    // Other aspect ratios
    { width: 220, height: 150 }, // Slightly wide
    { width: 150, height: 220 }, // Slightly tall
  ];
  
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
  
  return {
    photo,
    width: randomShape.width,
    height: randomShape.height,
  };
};

export default function OurStoryPage() {
  const [activeYear, setActiveYear] = useState(12);
  const yearSections = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [currentPhotoConfig, setCurrentPhotoConfig] = useState<PhotoConfig | null>(null);
  const [hoveredLetterIndex, setHoveredLetterIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  const titleText = "Our Stories are Fired by Big Data and AI";
  const letters = titleText.split("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.5;
      const years = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
      
      for (let i = yearSections.current.length - 1; i >= 0; i--) {
        const section = yearSections.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          const sectionBottom = sectionTop + rect.height;
          
          if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
            setActiveYear(years[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse movement for custom cursor only
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      // Use requestAnimationFrame for smooth updates
      rafRef.current = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;
        
        setMousePosition({ x, y });
        
        if (cursorRef.current) {
          cursorRef.current.style.left = `${x}px`;
          cursorRef.current.style.top = `${y}px`;
        }
        
        // Update photo container position smoothly using transform (GPU accelerated)
        if (photoContainerRef.current) {
          photoContainerRef.current.style.transform = `translate(${x + 20}px, ${y + 20}px)`;
        }
      });
    };

    if (isHovered) {
      document.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [isHovered]);
  
  // Handle letter hover - show photo when hovering over a letter
  const handleLetterHover = (index: number) => {
    // Only change photo if hovering over a different letter
    if (hoveredLetterIndex !== index) {
      setHoveredLetterIndex(index);
      const photoConfig = getRandomPhotoConfig();
      setCurrentPhotoConfig(photoConfig);
    }
  };
  
  // Handle letter leave - hide photo when leaving a letter
  const handleLetterLeave = () => {
    setHoveredLetterIndex(null);
    setCurrentPhotoConfig(null);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = "none";
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = "auto";
    setHoveredLetterIndex(null);
    setCurrentPhotoConfig(null);
  };
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Custom Cursor */}
      {isHovered && (
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#FF0000",
            pointerEvents: "none",
            zIndex: 9999,
            transform: "translate(-50%, -50%)",
            transition: "transform 0.05s linear, opacity 0.2s ease",
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.8)",
          }}
        />
      )}

      {/* Single Photo Display - Next to Cursor */}
      <div
        ref={photoContainerRef}
        style={{
          position: "fixed",
          left: "0",
          top: "0",
          transform: `translate(${mousePosition.x + 20}px, ${mousePosition.y + 20}px)`,
          zIndex: 9998,
          pointerEvents: "none",
          willChange: "opacity, transform",
        }}
      >
        {currentPhotoConfig && (
          <div
            key={`${currentPhotoConfig.photo}-${hoveredLetterIndex}`}
            style={{
              position: "relative",
              width: `${currentPhotoConfig.width}px`,
              height: `${currentPhotoConfig.height}px`,
              borderRadius: "8px",
              overflow: "hidden",
              animation: "dissolveIn 0.5s ease-in-out",
            }}
          >
            <Image
              src={currentPhotoConfig.photo}
              alt="Story"
              fill
              style={{
                objectFit: "cover",
              }}
              unoptimized
            />
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes dissolveIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>

      {/* Hero & Genesis Combined Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, rgba(147, 197, 253, 0.4) 0%, rgba(251, 207, 232, 0.4) 100%)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, #FFFFFF 60%)",
          }}
        />
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: "100px",
            paddingBottom: "20px",
          }}
        >
          {/* Hero Title */}
          <div className="text-center" style={{ position: "relative", zIndex: 1, marginTop: "90px" }}>
            <h1
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "96px",
                fontStyle: "normal",
                fontWeight: 200,
                lineHeight: "120%",
                marginBottom: "0",
                width: "975px",
                margin: "0 auto",
                cursor: "none",
                display: "inline-block",
              }}
            >
              {letters.map((letter, index) => (
                <span
                  key={index}
                  onMouseEnter={() => handleLetterHover(index)}
                  onMouseLeave={handleLetterLeave}
                  style={{
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </span>
              ))}
            </h1>
          </div>

          {/* Genesis of Crayon Data - Positioned at bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start" style={{ position: "relative", zIndex: 1 }}>
            {/* Left Column - Heading */}
            <div style={{ width: "390px" }}>
              <h2
                style={{
                  color: "var(--Interface-Color-Neutral-800, #1F2937)",
                  fontFamily: "Poppins",
                  fontSize: "48px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                }}
              >
                Genesis{" "}
                <span
                  style={{
                    color: "var(--Interface-Color-Neutral-700, #374151)",
                    fontWeight: 400,
                  }}
                >
                  of Crayon Data
                </span>
              </h2>
            </div>

            {/* Right Column - Paragraph */}
            <div>
              <p
                style={{
                  color: "#111827",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "28px",
                  maxWidth: "975px",
                }}
              >
                At an airport, three pre-Crayon entrepreneurs struck up an interesting conversation. They had been there, done that, and were raring to do it again. With decades of experience between them, the inspiration for Crayon Data came easy. Today, that idea has grown into a leader in the AI and Big Data space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24" style={{ position: "relative", paddingTop: "180px" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "relative",
            display: "flex",
            gap: "32px",
          }}
        >
          {/* Fixed Left Column - Year Display */}
          <div
            style={{
              position: "sticky",
              top: "100px",
              alignSelf: "flex-start",
              width: "562px",
              height: "288px",
              flexShrink: 0,
            }}
          >
            <h2
              style={{
                color: "var(--Interface-Color-Neutral-800, #1F2937)",
                fontFamily: "Poppins",
                fontSize: "240px",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "120%",
                transition: "opacity 0.3s ease",
              }}
            >
              20<span style={{ transition: "opacity 0.3s ease" }}>{activeYear.toString().padStart(2, "0")}</span>
            </h2>
          </div>

          {/* Scrollable Right Column - Events */}
          <div style={{ flex: 1, minWidth: 0 }}>
          {/* 2012 */}
          <div 
            ref={(el) => (yearSections.current[0] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MARCH 2012
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Our first steps. The founding team meets in Singapore
                </h3>
                <div style={{ marginTop: "16px", marginBottom: "16px" }}>
                  <Image
                    src="/img/founding-team.png"
                    alt="The founding team meets in Singapore"
                    width={450}
                    height={320}
                    style={{
                      width: "80%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                    unoptimized
                  />
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JUNE 2012
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Crayon Singapore incorporated
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  OCTOBER 2012
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Client No. 1 signs us on
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  OCTOBER 2012
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Crayon No. 1 joins the Box
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2013 */}
          <div 
            ref={(el) => (yearSections.current[1] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MARCH 2013
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We open our doors on Indian shores
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  SEPTEMBER 2014
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Our TasteGraph comes to life. Nando's is the first restaurant to be mapped on it!
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2014 */}
          <div 
            ref={(el) => (yearSections.current[2] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MARCH 2014
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We are the only Asian Big Data company to be selected for CODE_n CEBIT, Germany, and are one of the Top 5 finalists at IBM's Watson Mobile Developer Challenge
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MAY 2014
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We catch the eye of Jungle Ventures and Spring Seeds Capital. They invest in us
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2014
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Our recommendation engine, Maya 1.0 revs up
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2015 */}
          <div 
            ref={(el) => (yearSections.current[3] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JULY 2015
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We make it to the Top 3 at OrangeFab, Singapore
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  AUGUST 2015
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Ratan Tata says hello. With an investment
                </h3>
              </div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2015
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Maya 2.0 – gets Beta and better!
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2016 */}
          <div 
            ref={(el) => (yearSections.current[4] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2016
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Mitsui says Konnichiwa and invests in Crayon
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2017 */}
          <div 
            ref={(el) => (yearSections.current[5] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2017
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  The Singapore Patent Office grants a patent for Maya
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  AUGUST 2017
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  India's largest credit card issuer, one of the world's largest airlines, and Myanmar's #1 private bank, all sign on Crayon!
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  NOVEMBER 2017
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Kris Gopalakrishnan makes a personal investment in Crayon
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2017
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  The Singapore Patent Office grants a patent for our product, Yoda
                </h3>
              </div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2017
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We are recertified as ISO/IEC 27001:2013 compliant
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2018 */}
          <div 
            ref={(el) => (yearSections.current[6] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2018
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Asia's leading bank signs us up in India too!
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2019 */}
          <div 
            ref={(el) => (yearSections.current[7] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JANUARY 2019
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  We launched the all new maya.ai
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JANUARY 2019
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  One of 7 start-ups chosen for American Express's ACCELERATE ME – an accelerator program aimed at delivering innovative digital solutions to customers and business partners in the Middle East
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  SEPTEMBER 2019
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Top 15 finalists for the Emerging Enterprise Awards
                </h3>
              </div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2019
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Special Jury Award in Analytics Solutions at Express IT Awards by Financial Express
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2020 */}
          <div 
            ref={(el) => (yearSections.current[8] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2020
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Demoed maya.ai at Finovate Europe in Berlin
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  OCTOBER 2020
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Launch of Slaves to the Algo podcast
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2020
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  maya.ai wins Huawei Spark – Global Startup Competition
                </h3>
              </div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  DECEMBER 2020
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  First champion of the Huawei Spark 2020 – Global Startup Competition
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2021 */}
          <div 
            ref={(el) => (yearSections.current[9] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2021
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Crayon is a Top 10 start-up of FinTech Accelerator Program 2021 by FinTech Saudi
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2022 */}
          <div 
            ref={(el) => (yearSections.current[10] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JUNE 2022
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Crayon turns 10!
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  NOVEMBER 2022
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Featured in the Enterprise 50 Awards in Singapore
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>

          {/* 2023 */}
          <div 
            ref={(el) => (yearSections.current[11] = el)}
            className="mb-12"
          >
            <div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  FEBRUARY 2023
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Signs a partnership with Redington MEA to boost the fintech and digital transformation landscape in Africa
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MARCH 2023
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Crayon bags the Mint Startup Icon Award for SaaS
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  MARCH 2023
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  A partnership with Visa to enhance and personalize CX for their users
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JUNE 2023
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Partnered with TBO.com to offer personalized travel experiences for banking customers
                </h3>
              </div>
              <div className="mb-6">
                <p
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}
                >
                  JUNE 2023
                </p>
                <h3
                  style={{
                    color: "#111827",
                    fontFamily: "Poppins",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "28px",
                    marginBottom: "16px",
                  }}
                >
                  Transition to crayondata.ai
                </h3>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              />
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Awards Title & Graphic */}
            <div>
              <div
                style={{
                  width: "200px",
                  height: "200px",
                  marginBottom: "24px",
                  position: "relative",
                }}
              >
                <Image
                  src="/img/awards-graphic.png"
                  alt="Awards"
                  width={200}
                  height={200}
                  unoptimized
                />
              </div>
              <h2
                style={{
                  color: "var(--Interface-Color-Neutral-800, #1F2937)",
                  fontFamily: "Poppins",
                  fontSize: "48px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                  marginBottom: "8px",
                  width: "531px",
                }}
              >
                AWARDS
                <br />
                <span
                  style={{
                    color: "var(--Interface-Color-Neutral-700, #374151)",
                    fontFamily: "Poppins",
                    fontSize: "48px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "120%",
                  }}
                >
                  Lauded and Awarded
                </span>
              </h2>
            </div>

            {/* Right Column - Logos Grid */}
            <div>
              <div className="grid grid-cols-2" style={{ columnGap: "8px", rowGap: "16px" }}>
                <div style={{ width: "300px", height: "180px", position: "relative" }}>
                  <Image
                    src="/img/awards/orange-fab.svg"
                    alt="Orange Fab"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div style={{ width: "300px", height: "180px", position: "relative" }}>
                  <Image
                    src="/img/awards/ibm-watson.svg"
                    alt="IBM Watson"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div style={{ width: "300px", height: "180px", position: "relative" }}>
                  <Image
                    src="/img/awards/gartner.svg"
                    alt="Gartner"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div style={{ width: "300px", height: "180px", position: "relative" }}>
                  <Image
                    src="/img/awards/final.svg"
                    alt="Award"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In Section */}
      <section className="py-24 pb-32">
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "48px",
              fontStyle: "normal",
              lineHeight: "120%",
              marginBottom: "48px",
              width: "390px",
              margin: "0 auto 48px auto",
            }}
          >
            <span
              style={{
                color: "var(--Interface-Color-Neutral-800, #1F2937)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "120%",
              }}
            >
              Crayon Data
            </span>{" "}
            <span
              style={{
                color: "var(--Interface-Color-Neutral-700, #374151)",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "120%",
                whiteSpace: "nowrap",
              }}
            >
              As Featured in....
            </span>
          </h2>

          {/* Featured Cards - Flex layout with equal sizes */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", justifyContent: "center", maxWidth: "1120px", margin: "0 auto" }}>
            {/* Card 1 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start" }}>
              <Image
                src="/img/featured/bento-1.png"
                alt="Featured Content"
                width={324}
                height={320}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>

            {/* Card 2 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start" }}>
              <Image
                src="/img/featured/featured-img-3.svg"
                alt="Featured"
                width={324}
                height={320}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>

            {/* Card 3 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start" }}>
              <Image
                src="/img/featured/bento-2.png"
                alt="Featured Content"
                width={324}
                height={380}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>

            {/* Card 4 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start", marginTop: "-60px" }}>
              <Image
                src="/img/featured/group-1.svg"
                alt="Featured"
                width={324}
                height={320}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>

            {/* Card 5 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start", marginTop: "-60px" }}>
              <Image
                src="/img/featured/group-2.svg"
                alt="Featured"
                width={324}
                height={320}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>

            {/* Card 6 */}
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 0, alignSelf: "flex-start" }}>
              <Image
                src="/img/featured/group-3.svg"
                alt="Featured"
                width={324}
                height={320}
                style={{ height: "auto", maxWidth: "100%" }}
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
