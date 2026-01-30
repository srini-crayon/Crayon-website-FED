import type { Metadata } from "next"
import Image from "next/image"
import Script from "next/script"
import avatarLogo from "../../assets/image-096a6d53-9b07-4328-b61e-220a17f56711.png"
import tweetMock from "../../assets/image-2d43e253-a02a-4b38-bce1-6b5a47a00ceb.png"
import tweetMockAlt from "../../assets/image-eaaf1285-a2e7-4e23-9790-76989c330f0e.png"
import xLogo from "../../assets/X_logo_2023.svg"

export const metadata: Metadata = {
  title: "X | Crayon Data",
  description: "A focused card experience for X.",
}

export default function XPage() {
  return (
    <div
      className="flex min-h-screen px-5 pt-32 pb-16"
      style={{
        background: "linear-gradient(180deg, #0f172a 0%, #111827 35%, #e5e7eb 70%, #fafafa 100%)",
      }}
    >
      <div className="w-full" style={{ maxWidth: "1472px", margin: "0 auto" }}>
        <div className="flex flex-col gap-8 justify-center items-stretch mt-10">
          <article
            className="w-full flex flex-col md:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="flex flex-col md:flex-row w-full">
              <div
                className="md:w-56 flex items-center justify-center p-6"
                style={{
                  background: "#ffffff",
                }}
              >
                <Image
                  src="/img/crayon-full-logo.png"
                  alt="Crayon Data logo"
                  width={200}
                  height={200}
                  className="h-auto w-44 md:w-48 object-contain"
                  priority
                />
              </div>

              <div
                className="hidden md:block w-px bg-gray-200"
                style={{ marginTop: "16px", marginBottom: "16px" }}
                aria-hidden="true"
              />

              <div className="flex-1 px-6 py-6 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <h1 className="text-xl font-semibold text-gray-900">Crayon Data</h1>
                    <p className="text-sm text-gray-500">@CrayonBigData</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="font-semibold text-gray-900">873</span> Following
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">1,788</span> Followers
                      </div>
                    </div>
                    <a
                      href="https://x.com/CrayonBigData"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-md bg-gray-900 px-4 py-2 text-sm font-normal text-white transition hover:opacity-80"
                      style={{
                        fontFamily: "Poppins",
                        whiteSpace: "nowrap",
                      }}
                      aria-label="Follow Crayon Data on X"
                    >
                      Follow
                    </a>
                  </div>
                </div>

                <p className="text-sm text-gray-600" style={{ width: "480px", maxWidth: "100%" }}>
                  Crayon Data helps enterprises move from GenAI pilots to production. With AI Catalyst and the Tangram.ai platform, we deliver results fast, real, and measurable.
                </p>

                <span className="inline-block text-sm font-medium text-blue-700">#tangramai</span>
              </div>
            </div>
          </article>

        </div>

        {/* Embedded Twitter feed */}
        <section className="flex justify-center mt-10">
          <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
          <div className="elfsight-app-bcc6e0ac-14ab-48a8-b58b-6c75d359b3b2" data-elfsight-app-lazy />
        </section>
      </div>
    </div>
  )
}
