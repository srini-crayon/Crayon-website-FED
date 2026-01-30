"use client";

import Image from "next/image";

export default function OurInvestorsPage() {
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
      name: "Ratan Tata (RNT Associates)",
      image: "/img/investors/ratan-tata.svg",
    },
    {
      id: 4,
      name: "Kris Gopalakrishnan",
      image: "/img/investors/kris-gopalakrishnan.svg",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
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
            textAlign: "center",
            paddingTop: "120px",
            paddingBottom: "80px",
          }}
        >
          <h1
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "96px",
              fontStyle: "normal",
              fontWeight: 200,
              lineHeight: "120%",
              marginTop: "40px",
              marginBottom: "24px",
            }}
          >
            The Crayon Data Circle
          </h1>
          <p
            style={{
              color: "#111827",
              fontFamily: "Poppins",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              maxWidth: "900px",
              margin: "32px auto 0 auto",
            }}
          >
            Meet the people who believe in our vision to simplify the world's choices using data and AI. Our companions on this journey—every step of the way.
          </p>
        </div>
      </section>

      {/* Investors Section */}
      <section className="py-24">
        <div
          style={{
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {investors.map((investor) => (
              <div
                key={investor.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {/* Image/Logo Container */}
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    borderRadius: "8px",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    position: "relative",
                  }}
                >
                  <Image
                    src={investor.image}
                    alt={investor.name}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                    unoptimized
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div style="color: #6B7280; font-family: Poppins; font-size: 16px; display: flex; align-items: center; justify-content: center; height: 100%;">${investor.name}</div>`;
                      }
                    }}
                  />
                </div>

                {/* Text Content */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <p
                    style={{
                      color: "#9CA3AF",
                      fontFamily: "Poppins",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "18px",
                      margin: 0,
                    }}
                  >
                    Investors
                  </p>
                  <h3
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
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
            style={{
              textAlign: "center",
              marginTop: "56px",
            }}
          >
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "36px",
                margin: 0,
              }}
            >
              ... and many more
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
