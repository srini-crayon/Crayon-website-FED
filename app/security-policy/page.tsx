"use client";

export default function SecurityPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content with Gradient Background */}
      <section
        className="flex-grow pt-32 pb-16 relative overflow-hidden"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #FFF1E5 0%, #FFF1E5 30%, rgba(255, 255, 255, 0.8) 60%, #FFF 100%)",
        }}
      >
        {/* Background SVG Element */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "1557.028px",
            height: "724px",
            zIndex: 0,
            pointerEvents: "none",
            opacity: 0.4,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1557.028"
            height="724"
            viewBox="0 0 1512 341"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <filter id="filter0_f_security" x="-295.74" y="-903.68" width="2077.03" height="1244" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="130" result="effect1_foregroundBlur_security" />
              </filter>
              <linearGradient id="paint0_linear_security" x1="15.7465" y1="-296.177" x2="1360.49" y2="-332.481" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5F5FFA" stopOpacity="0" />
                <stop offset="0.07" stopColor="#6565FF" />
                <stop offset="0.48" stopColor="#4242E3" />
                <stop offset="0.91" stopColor="#2FC4FF" />
                <stop offset="1" stopColor="#33A6F9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g filter="url(#filter0_f_security)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M608.765 71.3609C996.952 115.908 1463.23 -10.2081 1516.31 -206.111C1569.39 -402.013 1189.16 -593.518 800.972 -638.065C569.755 -664.598 451.305 -591.931 264.305 -528.35C77.3052 -464.769 -8.23235 -373.718 -29.6948 -294.501C-82.7713 -98.5989 220.577 26.8141 608.765 71.3609Z"
                fill="url(#paint0_linear_security)"
              />
            </g>
          </svg>
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "1420px",
            margin: "0 auto",
            paddingLeft: "20px",
            paddingRight: "20px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Page Header */}
          <div style={{ marginBottom: "80px", marginTop: "40px", textAlign: "center" }}>
            <h1
              style={{
                color: "var(--Interface-Color-Primary-900, #091917)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "48px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "60px",
                width: "541px",
                margin: "0 auto 18px auto",
              }}
            >
              Security Policy of Website Use
            </h1>
            <p
              style={{
                color: "var(--Interface-Color-Neutral-700, #374151)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
              }}
            >
              Version 4.0 | Last revised June 2021
            </p>
          </div>

          {/* Security Policy Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              At Crayon Data, we prioritize the security and privacy of our clients' data. Our commitment is reflected through robust policies and practices designed to safeguard information.
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              Data Protection Measures
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              We implement stringent administrative, physical, and technical security controls to maintain the confidentiality, integrity, and availability of personal data. Access to sensitive information is restricted to authorized personnel only, ensuring that data is handled responsibly and securely.
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              Compliance and Certifications
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              Crayon Data adheres to global data protection regulations and standards. We have successfully completed the Service Organization Control (SOC) 2 Type II audit, demonstrating our ongoing commitment to data security and operational excellence.
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              Incident Reporting & Security Concerns
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              If you identify any discrepancies in security artifacts or suspect a security incident, please report them to our security team at{" "}
              <a
                href="mailto:infosec@crayondata.com"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                infosec@crayondata.com
              </a>
              . We take all security concerns seriously and will act promptly to address them.
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              Whistleblower & Grievance Reporting
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              We are committed to transparency and accountability. If you wish to report any violations or grievances related to security and compliance, you can reach out to our grievance team at{" "}
              <a
                href="mailto:grievances@crayondata.com"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                grievances@crayondata.com
              </a>
              .
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              Cookie Usage
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              To enhance user experience, our website utilizes cookies that help us understand how visitors interact with our site. Users have the option to manage or disable cookies through their browser settings, providing control over personal data preferences.
            </p>

            <h2
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              User Rights
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              We respect and uphold the rights of our users concerning their personal data. Users can access, correct, or request deletion of their data, and we are committed to responding promptly to such requests. For any inquiries or concerns regarding data privacy, please contact our Data Protection Officer at{" "}
              <a
                href="mailto:privacy@crayondata.ai"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                privacy@crayondata.ai
              </a>
              .
            </p>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "16px",
                textAlign: "left",
              }}
            >
              For a comprehensive understanding of our data practices, please refer to our{" "}
              <a
                href="/privacy-policy"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/cookie-policy"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
