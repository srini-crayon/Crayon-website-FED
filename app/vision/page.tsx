"use client";

import Image from "next/image";

export default function VisionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
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
            background: "linear-gradient(90deg, rgba(147, 197, 253, 0.4) 0%, rgba(251, 207, 232, 0.4) 100%)",
          }}
        />
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
            justifyContent: "center",
            textAlign: "center",
            paddingTop: "100px",
            paddingBottom: "80px",
          }}
        >
          {/* Main Title */}
          <h1
            style={{
              color: "#000",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "96px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "120%",
              marginBottom: "24px",
              maxWidth: "900px",
              margin: "0 auto 24px auto",
            }}
          >
            Simplify the World's Choices
          </h1>

          {/* Sub-heading */}
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
            Welcome to Crayon Data, where we solve complex problems with simple data and AI solutions
          </p>
        </div>
      </section>

      {/* Our raison d'etre Section */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
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
          <h2
            style={{
              color: "#111827",
              fontFamily: "Poppins",
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "24px",
            }}
          >
            Our raison d'etre
          </h2>
          <p
            style={{
              color: "#111827",
              fontFamily: "Poppins",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "32px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            Ideas and opinions need to be backed by tangible data. Crayon aspires to make the data that permeates the world around us simple and easy to understand
          </p>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF", position: "relative" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            gap: "80px",
            flexDirection: "column",
          }}
          className="md:flex-row"
        >
          {/* Background Graphic - Dotted W */}
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50%",
              height: "100%",
              opacity: 0.15,
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{ opacity: 0.2 }}
            >
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="400"
                fontFamily="Poppins"
                fontWeight="300"
                fill="#D1D5DB"
                style={{
                  stroke: "#D1D5DB",
                  strokeWidth: "2",
                  strokeDasharray: "8 8",
                  fill: "none",
                }}
              >
                W
              </text>
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "30%",
                width: "0",
                height: "0",
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "40px solid #06B6D4",
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              zIndex: 1,
              marginLeft: "auto",
              maxWidth: "600px",
            }}
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
              }}
            >
              Why?
            </h2>
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We believe that data is meant to serve the human spirit, not rule it
            </p>
          </div>

          {/* Illustration - Trees */}
          <div
            style={{
              width: "400px",
              height: "300px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Image
              src="/img/vision/Layer_1-4.svg"
              alt="Why Illustration"
              width={400}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* How Section */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF", position: "relative" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            gap: "80px",
            flexDirection: "column",
          }}
          className="md:flex-row"
        >
          {/* Illustration - Bell Jar */}
          <div
            style={{
              width: "400px",
              height: "300px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Image
              src="/img/vision/Layer_1-5.svg"
              alt="How Illustration"
              width={400}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              unoptimized
            />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              zIndex: 1,
              maxWidth: "600px",
            }}
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
              }}
            >
              How?
            </h2>
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We do this by making it simple for everyone to see, touch, and use the information that will make a difference to our lives
            </p>
          </div>

          {/* Background Graphic - Dotted H */}
          <div
            style={{
              position: "absolute",
              right: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50%",
              height: "100%",
              opacity: 0.15,
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{ opacity: 0.2 }}
            >
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="400"
                fontFamily="Poppins"
                fontWeight="300"
                fill="#D1D5DB"
                style={{
                  stroke: "#D1D5DB",
                  strokeWidth: "2",
                  strokeDasharray: "8 8",
                  fill: "none",
                }}
              >
                H
              </text>
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                right: "30%",
                width: "40px",
                height: "40px",
                backgroundColor: "#ED2E7E",
              }}
            />
          </div>
        </div>
      </section>

      {/* What Section */}
      <section className="py-24" style={{ backgroundColor: "#FFFFFF", position: "relative" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            alignItems: "center",
            gap: "80px",
            flexDirection: "column",
          }}
          className="md:flex-row"
        >
          {/* Background Graphic - Dotted W */}
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "50%",
              transform: "translateY(-50%)",
              width: "50%",
              height: "100%",
              opacity: 0.15,
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg
              width="400"
              height="400"
              viewBox="0 0 400 400"
              style={{ opacity: 0.2 }}
            >
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="400"
                fontFamily="Poppins"
                fontWeight="300"
                fill="#D1D5DB"
                style={{
                  stroke: "#D1D5DB",
                  strokeWidth: "2",
                  strokeDasharray: "8 8",
                  fill: "none",
                }}
              >
                W
              </text>
            </svg>
            <div
              style={{
                position: "absolute",
                bottom: "20%",
                left: "30%",
                width: "0",
                height: "0",
                borderLeft: "20px solid transparent",
                borderRight: "20px solid transparent",
                borderBottom: "40px solid #974095",
              }}
            />
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              position: "relative",
              zIndex: 1,
              marginLeft: "auto",
              maxWidth: "600px",
            }}
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: 0,
              }}
            >
              What?
            </h2>
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We create solutions that use data and AI to illuminate and simplify every aspect of your existence
            </p>
          </div>

          {/* Illustration - Bell Jar with Sun */}
          <div
            style={{
              width: "400px",
              height: "300px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Image
              src="/img/vision/Layer_1-6.svg"
              alt="What Illustration"
              width={400}
              height={300}
              style={{ width: "100%", height: "auto", objectFit: "contain" }}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* We handle data Section */}
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
          <h2
            style={{
              color: "#111827",
              fontFamily: "Poppins",
              fontSize: "48px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "48px",
              textAlign: "center",
            }}
          >
            We handle data. With art. With heart
          </h2>

          <div
            style={{
              display: "flex",
              gap: "80px",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
            className="md:flex-row"
          >
            {/* Tangram Illustration */}
            <div
              style={{
                width: "500px",
                height: "400px",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Image
                src="/img/vision/Group-1171278287.svg"
                alt="Tangram Arrow Illustration"
                width={500}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
                unoptimized
              />
            </div>

            {/* Text Content */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              <p
                style={{
                  color: "#111827",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "32px",
                  margin: 0,
                }}
              >
                Our Crayon arrow logo is inspired by tangrams - the enduring Chinese puzzle involves just 7 precise pieces that have hundreds of different solutions. Just like data. The answers to everything in the universe are in the bytes of data we collect, that reveal different insights, through different combinations.
              </p>
              <p
                style={{
                  color: "#111827",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "32px",
                  margin: 0,
                }}
              >
                Artful solutions from precise science. And the complex made simple.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
