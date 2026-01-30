"use client";

export default function CookiePolicyPage() {
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
              <filter id="filter0_f_cookie" x="-295.74" y="-903.68" width="2077.03" height="1244" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="130" result="effect1_foregroundBlur_cookie" />
              </filter>
              <linearGradient id="paint0_linear_cookie" x1="15.7465" y1="-296.177" x2="1360.49" y2="-332.481" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5F5FFA" stopOpacity="0" />
                <stop offset="0.07" stopColor="#6565FF" />
                <stop offset="0.48" stopColor="#4242E3" />
                <stop offset="0.91" stopColor="#2FC4FF" />
                <stop offset="1" stopColor="#33A6F9" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g filter="url(#filter0_f_cookie)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M608.765 71.3609C996.952 115.908 1463.23 -10.2081 1516.31 -206.111C1569.39 -402.013 1189.16 -593.518 800.972 -638.065C569.755 -664.598 451.305 -591.931 264.305 -528.35C77.3052 -464.769 -8.23235 -373.718 -29.6948 -294.501C-82.7713 -98.5989 220.577 26.8141 608.765 71.3609Z"
                fill="url(#paint0_linear_cookie)"
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
              Cookie Policy of Website Use
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

          {/* Cookie Policy Content */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
              Browser Cookies:
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
              Cookies are pieces of information that a website places on your device when you visit a website. Cookies may involve the transmission of information from us to you and from you directly to us, to another party on our behalf, or to another party in accordance with its privacy policy. We may use cookies to bring together information we collect about you. You can choose to have your device warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. If you turn cookies off, you won't have access to many features that make your guest experience more efficient and some of our services will not function properly. Please see the last section of this Cookies Policy for more information about how to manage or disable browser cookies.
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
              We will keep your information confidential, except where disclosure is required or permitted by law. We do not share your personal information with third parties nor do we store/process any additional information other than what is mentioned above.
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
              Use of Cookies
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              We use cookies in a range of ways to advance your experience, including
            </p>

            <ul
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                paddingLeft: "24px",
                listStyleType: "disc",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                textAlign: "left",
                marginBottom: "16px",
              }}
            >
              <li style={{ paddingLeft: "8px" }}>Keeping you signed in</li>
              <li style={{ paddingLeft: "8px" }}>Understanding how you use our site</li>
              <li style={{ paddingLeft: "8px" }}>Working with partners to serve you relevant advertising</li>
              <li style={{ paddingLeft: "8px" }}>Measure the number of visitor to our Site.</li>
            </ul>

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
              Cookies that we use
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              We use three main types of Cookies on our website. They are:
            </p>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              <strong style={{ fontWeight: 600 }}>1. Session cookies:</strong> Session cookies are temporary cookies stored in the browser's memory just until the browser is closed. They enable you to transfer data across the different pages of our website without the need to re-enter details.
            </p>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              <strong style={{ fontWeight: 600 }}>2. Persistent Cookies:</strong> Persistent cookies are longer-term cookies that are tagged by the issuer with an expiration date. These cookies are stored by the browser even after the browser is closed. They are returned to the issuer every time you visit the site that issued the cookie or view a site that contains a resource, issued by the original cookie issuer. In this way, persistent cookies can track your activity not only on the site that issued the cookie but also on any site that includes a resource issued by the same site. We use cookies, such as Google Analytics, to record and analyse how visitors use the website, in order to help us improve the content, format and structure of this website.
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
                marginTop: "16px",
                textAlign: "left",
              }}
            >
              <strong style={{ fontWeight: 600 }}>3. Third Party Cookies:</strong> Certain third parties provide cookies through this website, which are utilized for the tracking, the frequency with which customers are viewing specific pages & products, matching specific content to interests of customers, recording numbers of guest users visiting the website and for analysis of customers' Internet use.
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
              Registered Guests
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
              We may analyse online activities of registered guests across our websites and online services by use of cookies and other tracking technologies. Where you have opted in to receive communications from us, we may use cookies and other tracking technologies to tailor future communications to reflect your interests.
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
              We may also use cookies or other tracking technologies within our communications to you (for example to see if they have been read or opened or to see what content you interact with and what links you follow) so that we can better match future communications to your interests. We will not share your contact information with our third-party advertisers unless you give us permission.
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
              External Links
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
              <a
                href="https://www.crayondata.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                https://www.crayondata.com
              </a>{" "}
              may contain hyperlinks to websites owned and operated by third parties. These third-party websites have their own privacy policies and are also likely to use cookies. So, we therefore, urge you to review them. They will govern the use of personal information you submit, which may also be collected by cookies while visiting these websites. We do not accept any responsibility or liability for the privacy practices of such third-party websites and your use of such websites is at your own risk.
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
              Disabling/Enabling Cookies via Your Browser
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              There are a number of ways for you to manage cookies and other tracking technologies. Through your browser settings, you can accept or decline cookies or set your browser to prompt you before accepting a cookie from the websites you visit. You should be aware that you may not be able to use all our interactive features if you set your browser to disable cookies entirely.
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
              All cookies are capable of being disabled or enabled through altering the settings on your internet browser. Deleting cookies after every session disables identification of a repeat user. If you use different computers in different locations you will need to ensure that each browser is adjusted to suit your preferences.
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
              Managing Cookies
            </h2>

            <p
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                marginBottom: "4px",
                textAlign: "left",
              }}
            >
              Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can however obtain up-to-date information about blocking and deleting cookies via these links:
            </p>

            <ul
              style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "28px",
                paddingLeft: "24px",
                listStyleType: "disc",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                textAlign: "left",
                marginBottom: "16px",
              }}
            >
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="https://support.google.com/chrome/answer/95647?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  https://support.google.com/chrome/answer/95647?hl=en
                </a>{" "}
                (Chrome);
              </li>
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences
                </a>{" "}
                (Firefox);
              </li>
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="http://www.opera.com/help/tutorials/security/cookies/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  http://www.opera.com/help/tutorials/security/cookies/
                </a>{" "}
                (Opera);
              </li>
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies
                </a>{" "}
                (Internet Explorer);
              </li>
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="https://support.apple.com/en-in/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  https://support.apple.com/en-in/guide/safari/manage-cookies-and-website-data-sfri11471/mac
                </a>{" "}
                (Safari); and
              </li>
              <li style={{ paddingLeft: "8px" }}>
                <a
                  href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "underline",
                  }}
                >
                  https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy
                </a>{" "}
                (Edge).
              </li>
            </ul>

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
              Blocking all cookies will have a negative impact upon the usability of many websites.
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
              If you block cookies, you will not be able to use all the features on our website.
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
              Queries
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
              Should you have any queries with regard to our privacy policy, please contact us at{" "}
              <a
                href="mailto:privacy@crayondata.com"
                style={{
                  color: "#007BFF",
                  textDecoration: "underline",
                }}
              >
                privacy@crayondata.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
