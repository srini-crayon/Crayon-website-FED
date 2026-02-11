'use client'

import Image from "next/image"
import Link from "next/link"

export function CrayonFooter() {
  return (
    <footer className="relative bg-black text-white overflow-hidden w-full">
      <div className="relative pt-8 sm:pt-10 md:pt-12 pb-1 z-10 px-4 sm:px-6 md:px-8 md:pl-[52px] md:pr-0 lg:pl-[52px]">
        {/* Main content: left stays in place; Legal + AI summary grouped on the right */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 sm:gap-12 md:gap-0 mb-6 w-full max-w-[1920px] mx-auto">
          {/* Left Column - Company Branding and Social Media (position unchanged) */}
          <div
            className="flex flex-col gap-4 shrink-0 w-full md:max-w-[308px] md:min-h-[126px]"
          >
            {/* Logos */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Image 
                src="/img/crayon-logo.png" 
                alt="Crayon" 
                width={120} 
                height={40} 
                className="h-6 sm:h-7 w-auto" 
              />
              <Image 
                src="/img/tangram-logo-light.svg" 
                alt="tangram.ai" 
                width={140} 
                height={40} 
                className="h-6 sm:h-7 w-auto" 
              />
            </div>
            
            {/* Tagline */}
            <p
              className="text-[#B3B3B3] font-normal mt-2 max-w-[307px] w-full text-sm leading-normal"
              style={{ fontFamily: 'Poppins' }}
            >
              AI-led revenue acceleration platform for enterprises
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-2 mt-2">
              <Link href="#" className="w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="LinkedIn">
                <Image
                  src="/img/linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </Link>
              <Link href="#" className="w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Twitter">
                <Image
                  src="/img/x.svg"
                  alt="Twitter/X"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </Link>
              <Link href="#" className="w-9 h-9 sm:w-10 sm:h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Instagram">
                <Image
                  src="/img/insta.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </Link>
            </div>
          </div>

          {/* Right side: Legal + AI summary with 146px gap between them on desktop */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-8 sm:gap-10 md:gap-[146px] md:flex-nowrap shrink-0 w-full md:w-auto">
          {/* Legal */}
          <div className="min-w-0 md:max-w-[229px]">
            <h3
              className="text-[#B3B3B3] font-normal text-sm leading-[21px] mb-4 sm:mb-5"
              style={{ fontFamily: 'Poppins' }}
            >
              Legal
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                <Link 
                  href="/terms-of-use" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Terms of Use
                </Link>
                <Link 
                  href="/privacy-policy" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/cookie-policy" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Cookie Policy
                </Link>
                <Link 
                  href="/security-policy" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal whitespace-nowrap"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Security Policy
                </Link>
                <Link 
                  href="/trust-center" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Trust Center
                </Link>
                
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-3">
                <Link 
                  href="/data-policy" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Data Policy
                </Link>
                <Link 
                  href="/civil-liberties" 
                  className="hover:opacity-80 transition-opacity text-white text-sm leading-[21px] font-normal"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Civil Liberties
                </Link>
              </div>
            </div>
          </div>

          {/* AI summary of Crayon Data */}
          <div className="min-w-0 md:max-w-[451px] mr-0 md:mr-[125px]">
            <h3
              className="text-[#B3B3B3] font-normal text-sm leading-[21px] mb-4 sm:mb-5"
              style={{ fontFamily: 'Poppins' }}
            >
              AI summary of Crayon Data
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/terms-of-use"
                className="hover:opacity-80 transition-opacity inline-flex items-center gap-2 text-white text-sm leading-[21px] font-normal"
                style={{ fontFamily: 'Poppins' }}
              >
                <Image src="/img/footer/icon-1.png" alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                Chatgpt
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:opacity-80 transition-opacity inline-flex items-center gap-2 text-white text-sm leading-[21px] font-normal"
                style={{ fontFamily: 'Poppins' }}
              >
                <Image src="/img/footer/icon-2.png" alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                Claude
              </Link>
              <Link
                href="/cookie-policy"
                className="hover:opacity-80 transition-opacity inline-flex items-center gap-2 text-white text-sm leading-[21px] font-normal"
                style={{ fontFamily: 'Poppins' }}
              >
                <Image src="/img/footer/gemini-color 1.png" alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                Gemini
              </Link>
              <Link
                href="/security-policy"
                className="hover:opacity-80 transition-opacity inline-flex items-center gap-2 text-white text-sm leading-[21px] font-normal"
                style={{ fontFamily: 'Poppins' }}
              >
                <Image src="/img/footer/icon-4.png" alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                Grook
              </Link>
              <Link
                href="/trust-center"
                className="hover:opacity-80 transition-opacity inline-flex items-center gap-2 text-white text-sm leading-[21px] font-normal"
                style={{ fontFamily: 'Poppins' }}
              >
                <Image src="/img/footer/icon-5.png" alt="" width={16} height={16} className="w-4 h-4 shrink-0" />
                Perplexity
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Footer decoration with copyright overlaid on top - image not trimmed */}
      <div className="relative w-full min-h-[100px] h-28 sm:h-32 md:h-[140px] overflow-hidden">
        <Image
          src="/img/Footer Container.png"
          alt=""
          fill
          className="object-contain object-bottom"
          priority
        />
        {/* Copyright - centered on top of the decorative image */}
        <p
          className="absolute inset-x-0 bottom-0 top-10 sm:top-12 md:top-14 flex items-center justify-center text-center z-10 px-4 text-xs sm:text-sm md:text-[15px] font-normal leading-normal"
          style={{
            color: 'rgba(255, 255, 255, 0.95)',
            fontFamily: 'Poppins',
          }}
        >
          © {new Date().getFullYear()} Crayon Data Pvt Ltd. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
