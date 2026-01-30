"use client";

export default function OurTeamPage() {
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
            Our Team
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
            Meet the talented individuals who make Crayon Data what it is today
          </p>
        </div>
      </section>

      {/* Content Section */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Content will go here */}
            <div
              style={{
                padding: "32px",
                backgroundColor: "#F9FAFB",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  color: "#111827",
                  fontFamily: "Poppins",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "120%",
                  marginBottom: "12px",
                }}
              >
                Team Title
              </h3>
              <p
                style={{
                  color: "#6B7280",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                Team description and details
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
