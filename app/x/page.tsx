import type { Metadata } from "next"
import Image from "next/image"
import avatarLogo from "../../assets/image-096a6d53-9b07-4328-b61e-220a17f56711.png"
import tweetMock from "../../assets/image-2d43e253-a02a-4b38-bce1-6b5a47a00ceb.png"
import tweetMockAlt from "../../assets/image-eaaf1285-a2e7-4e23-9790-76989c330f0e.png"
import xLogo from "../../assets/X_logo_2023.svg"

export const metadata: Metadata = {
  title: "X | Crayon Data",
  description: "A focused card experience for X.",
}

export default function XPage() {
  const cards = Array.from({ length: 5 }, (_, i) => i)

  return (
    <div
      className="flex min-h-screen px-5 pt-32 pb-16"
      style={{
        background: "linear-gradient(135deg, #000000 5%, #1d9bf0 15%, #eff3f4 80%)",
      }}
    >
      <div className="w-full max-w-5xl mx-auto">
        <div className="flex justify-center mb-6 -mt-6">
          <Image
            src={xLogo}
            alt="X logo"
            width={260}
            height={156}
            className="h-auto w-[260px] opacity-70"
            priority
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-8 justify-start items-start mt-10">
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

          <div className="w-full lg:w-[520px] rounded-lg flex flex-col gap-6">
            {cards.map((card, idx) => (
              <article key={card} className="rounded-lg border border-gray-200 bg-white text-gray-900">
                <div className="px-5 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
                      <Image
                        src={avatarLogo}
                        alt="Crayon avatar"
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">Crayon Data</span>
                      </div>
                      <div className="text-sm text-gray-500">@CrayonBigData · Jan 26, 2024</div>
                    </div>
                  </div>

                  {idx === 2 ? (
                    <p className="mt-4 text-sm text-gray-800 leading-relaxed font-normal">
                      #OnTheShouldersOf Marvin Minsky
                      <br />
                      <br />
                      Marvin Lee Minsky is considered one of the founding fathers of AI. His work laid the groundwork for modern AI research and continues to influence the field to this day.
                      <br />
                      <br />
                      <span className="text-blue-500 font-semibold">#AI</span> <span className="text-blue-500 font-semibold">#ArtificialIntelligence</span>
                    </p>
                  ) : idx === 1 ? (
                    <p className="mt-4 text-sm text-gray-800 leading-relaxed font-normal">
                      Can you say “Yes, I will!” to the following?
                      <br />
                      <br />
                      Help is on developing the largest pool of merchant repository called Bazaar as a value proposition for our clients across the continent.
                      <br />
                      <br />
                      You will be joining this team as a software engineer.
                      <br />
                      <br />
                      <a
                        href="https://crayondata.zohorecruit.com/recruit/ViewJob.na?digest=CCO4y0GzCU1Xebmp4jb2@ngUmjvtGVJzOatum4MXxts-&embedsource=Twitter"
                        className="text-blue-500 font-semibold break-all no-underline hover:underline"
                      >
                        https://crayondata.zohorecruit.com/recruit/ViewJob...
                      </a>
                    </p>
                  ) : (
                    <p className="mt-4 text-sm text-gray-800 leading-relaxed font-normal">
                      Happy 75th Republic Day, India!
                      <br />
                      <br />
                      As we celebrate the spirit of unity, diversity, and progress, Crayon Data wishes you all a day filled with pride, joy, and reflection. Let's continue to move forward together towards a brighter and more inclusive future.
                      <br />
                      <br />
                      <span className="text-blue-500 font-semibold">#RepublicDay</span> <span className="text-blue-500 font-semibold">#India75</span>
                    </p>
                  )}
                </div>

                {idx === 2 ? (
                  <div className="mt-4 px-5">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <Image
                        src={tweetMockAlt}
                        alt="Twitter mock"
                        className="w-full h-auto object-cover"
                        placeholder="blur"
                        sizes="(min-width: 1024px) 480px, 100vw"
                        priority
                      />
                    </div>
                  </div>
                ) : idx !== 1 ? (
                  <div className="mt-4 px-5">
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <Image
                        src={tweetMock}
                        alt="Twitter mock"
                        className="w-full h-auto object-cover"
                        placeholder="blur"
                        sizes="(min-width: 1024px) 480px, 100vw"
                        priority
                      />
                    </div>
                  </div>
                ) : null}

                {idx === 1 ? (
                  <div className="px-5 flex justify-start">
                    <div className="mt-4 w-full max-w-[480px] border-t border-gray-200 py-4 text-sm text-gray-600 flex items-center justify-end gap-4">
                      <span className="text-gray-800">59 Views</span>
                      <span className="text-gray-800">1 Repost</span>
                      <span className="text-gray-800">1 Like</span>
                      <span className="text-gray-800">0 Reply</span>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-4 text-sm text-gray-600 flex items-center justify-end gap-4">
                    <span className="text-gray-800">59 Views</span>
                    <span className="text-gray-800">1 Repost</span>
                    <span className="text-gray-800">1 Like</span>
                    <span className="text-gray-800">0 Reply</span>
                  </div>
                )}
              </article>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
