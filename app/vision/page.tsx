"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollToTopButton from "@/components/scroll-to-top-button";

export default function VisionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Text above image */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "48px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Text block - above image */}
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              marginBottom: "48px",
            }}
          >
            {/* VISION Label */}
            <div
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "12px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "21px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              VISION
            </div>

            {/* Main Title - reduced size to match reference */}
            <h2
              style={{
                color: "#000000",
                textAlign: "center",
                fontFamily: "Poppins, sans-serif",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "120%",
                margin: "0 auto 16px auto",
              }}
            >
              Simplify AI Success
            </h2>

            {/* Sub-heading - smaller to match second image */}
            <p
              style={{
                color: "#4A4A4A",
                fontFamily: "Poppins, sans-serif",
                fontSize: "18px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                maxWidth: "720px",
                margin: "0 auto",
              }}
            >
              Welcome to Crayon Data, where we solve complex problems with simple data and AI solutions
            </p>
          </div>

          {/* Illustration - below text */}
          <div
            style={{
              width: "100%",
              maxWidth: "1000px",
              position: "relative",
              aspectRatio: "16/10",
              minHeight: "320px",
            }}
          >
            <Image
              src="https://crayondata.ai/wp-content/uploads/Top-Image-2.png"
              alt="Vision - Simplify AI Success"
              fill
              style={{ objectFit: "contain", objectPosition: "center" }}
              unoptimized
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* Our raison d'etre Section */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "64px", paddingBottom: "64px" }}>
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
              fontFamily: "Poppins, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "20px",
              marginTop: 0,
            }}
          >
            Our raison d&apos;etre
          </h2>
          <p
            style={{
              color: "#111827",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "28px",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            Ideas and opinions need to be backed by tangible data. Crayon aspires to make the data that permeates the world around us simple and easy to understand
          </p>
        </div>
      </section>

      {/* Divider Line */}
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "#E5E7EB",
          margin: "0",
        }}
      />

      {/* Why Section - single row: image left, text center, image right */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "64px", paddingBottom: "64px" }}>
        <div
          className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 w-full"
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Left Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-1"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Layer_1-4.svg#1191"
              alt="Why Illustration 1"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Center Text */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              textAlign: "center",
              minWidth: 0,
            }}
            className="md:order-2"
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
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
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We believe that AI is meant to serve the human spirit, not rule it
            </p>
          </div>

          {/* Right Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-3"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Layer_1-5.svg#1190"
              alt="Why Illustration 2"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* How Section - single row: image left, text center, image right */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "48px", paddingBottom: "64px" }}>
        <div
          className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 w-full"
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Left Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-1"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Layer_1-6.svg#1194"
              alt="How Illustration 1"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Center Text */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              textAlign: "center",
              minWidth: 0,
            }}
            className="md:order-2"
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
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
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We do this by making it simple for everyone to see, touch, and use AI that will make a difference to our lives
            </p>
          </div>

          {/* Right Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-3"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Group-1171278287.svg#1193"
              alt="How Illustration 2"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* What Section - single row: image left, text center, image right */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "48px", paddingBottom: "64px" }}>
        <div
          className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 w-full"
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          {/* Left Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-1"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Layer_1-8.svg#1195"
              alt="What Illustration 1"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>

          {/* Center Text */}
          <div
            style={{
              flex: "1 1 0%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              textAlign: "center",
              minWidth: 0,
            }}
            className="md:order-2"
          >
            <h2
              style={{
                color: "#06B6D4",
                fontFamily: "Poppins, sans-serif",
                fontSize: "36px",
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
                fontFamily: "Poppins, sans-serif",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "32px",
                margin: 0,
              }}
            >
              We deploy solutions that use data and AI to illuminate and simplify every aspect of your existence
            </p>
          </div>

          {/* Right Image */}
          <div
            style={{
              flex: "0 0 auto",
              width: "100%",
              maxWidth: "240px",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="md:order-3"
          >
            <img
              src="https://crayondata.ai/wp-content/uploads/Layer_1-7.svg#1196"
              alt="What Illustration 2"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* We handle data Section - single row: image left, text right */}
      <section style={{ backgroundColor: "#FFFFFF", paddingTop: "80px", paddingBottom: "80px" }}>
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
              color: "#000000",
              fontFamily: "Poppins, sans-serif",
              fontSize: "36px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "120%",
              marginBottom: "40px",
              marginTop: 0,
              textAlign: "center",
            }}
          >
            We handle data. With speed. With responsibility
          </h2>

          <div
            className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10 w-full"
            style={{ maxWidth: "100%" }}
          >
            {/* Tangram Illustration - left column */}
            <div
              style={{
                flex: "0 0 auto",
                width: "100%",
                maxWidth: "280px",
                minWidth: "180px",
                aspectRatio: "253 / 225",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="https://crayondata.ai/wp-content/uploads/Frame-3.svg#1197"
                alt="Tangram Arrow Illustration"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>

            {/* Text Content - right column */}
            <div
              style={{
                flex: "1 1 0%",
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <p
                style={{
                  color: "#4A4A4A",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "28px",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Our Crayon arrow logo is inspired by tangrams – the enduring Chinese puzzle involves just 7 precise pieces that have hundreds of different solutions. Just like data. The answers to everything in the universe are in the bytes of data we collect, that reveal different insights, through different combinations.
              </p>
              <p
                style={{
                  color: "#4A4A4A",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "28px",
                  margin: 0,
                  textAlign: "left",
                }}
              >
                Artful solutions from precise science. And the complex made simple.
              </p>
            </div>
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
              backgroundColor: "#1D8AD7",
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
              href="/our-story"
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
              OUR STORY
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
