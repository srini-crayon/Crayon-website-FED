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
        background: "linear-gradient(135deg, #000000 5%, #1d9bf0 15%, #eff3f4 80%)",
      }}
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Embedded Twitter feed */}
        <section className="flex justify-center mb-10">
          <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
          <div className="elfsight-app-bcc6e0ac-14ab-48a8-b58b-6c75d359b3b2" data-elfsight-app-lazy />
        </section>

        <div className="flex flex-col lg:flex-row gap-8 justify-center items-start mt-10">
          <article
            className="w-[360px] flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white lg:sticky lg:top-20 lg:self-start"
          >
            <div
              className="relative h-32"
              style={{
                background: "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #312e81 100%)",
              }}
            >
              <div className="absolute left-5 bottom-[-36px] h-20 w-20 rounded-full border-4 border-white bg-white flex items-center justify-center">
                <div
                  className="h-14 w-14 rounded-full overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 45%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.3), transparent 45%), #0f172a",
                  }}
                >
                  <Image
                    src={avatarLogo}
                    alt="Crayon avatar"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute right-5 top-5 text-white text-lg font-semibold">#tangramai</div>
            </div>

            <div className="pt-12 px-5 pb-6">
              <h1 className="text-xl font-semibold text-gray-900">Crayon Data</h1>
              <p className="text-sm text-gray-500">@CrayonBigData</p>
              <p className="mt-3 text-sm text-gray-600">
                We're a fast-growing big data &amp; AI startup with a vision to simplify the world’s choices with our all-new personalization engine, http://maya.ai
              </p>

              <div className="mt-4 flex items-center gap-6 text-sm text-gray-700">
                <div>
                  <span className="font-semibold text-gray-900">873</span> Following
                </div>
                <div>
                  <span className="font-semibold text-gray-900">1,788</span> Followers
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-normal text-white transition hover:opacity-90"
                  style={{
                    fontFamily: "Poppins",
                  }}
                >
                  Follow
                </button>
              </div>
            </div>
          </article>

        </div>
      </div>
    </div>
  )
}
