"use client";

import Image from "next/image";

export default function OurValuesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(255, 255, 255, 1) 100%)",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
              width: "975px",
              color: "#000",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "96px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              marginTop: "40px",
              marginBottom: "24px",
              margin: "40px auto 24px auto",
            }}
          >
            The Crayon Data Box of Values
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
            Culture and purpose lend a person happiness at work. Here are our set of values that we believe in and shape our culture. And as any Crayon will tell you, we're fanatical about them!
          </p>
          
          {/* Image */}
          <div
            style={{
              marginTop: "48px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src="/img/our-values/group-1171278405.svg"
              alt="Crayon Data Values"
              width={500}
              height={300}
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
              }}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
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
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "48px",
            }}
            className="md:flex-row md:gap-20"
          >
            {/* Left Side - COMPANY VALUES Heading */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flexShrink: 0,
              }}
            >
              {/* Dotted C */}
              <div style={{ width: "120px", height: "120px", flexShrink: 0 }}>
                <Image
                  src="/img/our-values/C.svg"
                  alt="C"
                  width={120}
                  height={120}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  unoptimized
                />
              </div>
              
              {/* COMPANY VALUES Text with Pink Block */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "8px",
                    height: "48px",
                    backgroundColor: "#ED2E7E",
                    flexShrink: 0,
                  }}
                />
                <h2
                  style={{
                    color: "#000",
                    fontFamily: "Poppins",
                    fontSize: "48px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "120%",
                    margin: 0,
                    whiteSpace: "nowrap",
                  }}
                  className="text-2xl md:text-5xl"
                >
                  COMPANY VALUES
                </h2>
              </div>
            </div>

            {/* Right Side - Values Grid */}
            <div style={{ flex: 1 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Value 1: The mission is the boss */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/The-mission-is-the-boss.svg"
                      alt="The mission is the boss"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    The mission is the boss
                  </p>
                </div>

                {/* Value 2: Responsibility with freedom */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/Responsibility-with-freedom.svg"
                      alt="Responsibility with freedom"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    Responsibility with freedom
                  </p>
                </div>

                {/* Value 3: Get shit done */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/Get-shit-done-fill.svg"
                      alt="Get shit done"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    Get shit done
                  </p>
                </div>

                {/* Value 4: Be the benchmark */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/Be-the-benchmark.svg"
                      alt="Be the benchmark"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    Be the benchmark
                  </p>
                </div>

                {/* Value 5: Practice constructive candor */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/Practice-constructive-candor-fill.svg"
                      alt="Practice constructive candor"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    Practice constructive candor
                  </p>
                </div>

                {/* Value 6: Simplicity is sophistication */}
                <div
                  style={{
                    padding: "24px",
                    backgroundColor: "#F8F8F8",
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div style={{ width: "80px", height: "80px" }}>
                    <Image
                      src="/img/our-values/Simplicity-is-sophistication-fill.svg"
                      alt="Simplicity is sophistication"
                      width={80}
                      height={80}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      unoptimized
                    />
                  </div>
                  <p
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "120%",
                      margin: 0,
                    }}
                  >
                    Simplicity is sophistication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
