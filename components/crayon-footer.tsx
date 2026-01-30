'use client'

import Image from "next/image"
import Link from "next/link"

export function CrayonFooter() {
  return (
    <footer 
      className="relative bg-black text-white overflow-hidden w-full"
      style={{
        maxHeight: '320px',
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-20 h-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 via-orange-400 to-transparent transform -rotate-45 origin-top-left" />
        <div className="absolute top-2 left-0 w-full h-[1px] bg-gradient-to-r from-orange-400/50 to-transparent transform -rotate-45 origin-top-left" />
      </div>
      <div className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-yellow-500 via-yellow-400 to-transparent transform -rotate-45 origin-bottom-right" />
        <div className="absolute bottom-2 right-0 w-full h-[1px] bg-gradient-to-l from-yellow-400/50 to-transparent transform -rotate-45 origin-bottom-right" />
      </div>

      <div className="relative py-12 z-10" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        {/* Main content area - Three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 w-full max-w-[1420px] mx-auto">
          {/* Left Column - Company Branding and Social Media */}
          <div 
            className="flex flex-col gap-4"
            style={{
              maxWidth: '308px',
              height: '126px',
            }}
          >
            {/* Logos */}
            <div className="flex items-center gap-6">
              <Image 
                src="/img/crayon-logo.png" 
                alt="Crayon" 
                width={120} 
                height={40} 
                className="h-auto w-auto" 
              />
              <Image 
                src="/img/tangram-logo.png" 
                alt="tangram.ai" 
                width={140} 
                height={40} 
                className="h-auto w-auto" 
              />
            </div>
            
            {/* Tagline */}
            <p
              style={{
                color: '#B3B3B3',
                fontFamily: 'Poppins',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: 'normal',
                marginTop: '8px',
                width: '307px',
              }}
            >
              AI-led revenue acceleration platform for enterprises
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-2 mt-2">
              <Link href="#" className="w-10 h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="LinkedIn">
                <Image
                  src="/img/linkedin.svg"
                  alt="LinkedIn"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
              <Link href="#" className="w-10 h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Twitter">
                <Image
                  src="/img/x.svg"
                  alt="Twitter/X"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
              <Link href="#" className="w-10 h-10 hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="Instagram">
                <Image
                  src="/img/insta.svg"
                  alt="Instagram"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </Link>
            </div>
          </div>

          {/* Middle Column - Links */}
          <div
            style={{
              maxWidth: '229px',
              height: '128px',
            }}
          >
            <h3
              style={{
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '21px',
                marginBottom: '20px',
              }}
            >
              Links
            </h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {/* Left Column */}
              <div className="flex flex-col gap-3">
                <Link 
                  href="/privacy-policy" 
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  href="/cookie-policy" 
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                  }}
                >
                  Cookie Policy
                </Link>
                <Link 
                  href="/security-policy" 
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Security Policy
                </Link>
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-3">
                <Link 
                  href="/join-us" 
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                  }}
                >
                  Join Us
                </Link>
                <Link 
                  href="/our-values" 
                  className="hover:opacity-80 transition-opacity"
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                  }}
                >
                  Our Values
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Office Location */}
          <div
            style={{
              maxWidth: '451px',
              height: '166px',
            }}
          >
            <h3
              style={{
                color: '#FFFFFF',
                fontFamily: 'Poppins',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '21px',
                marginBottom: '20px',
              }}
            >
              Office Location
            </h3>
            
            {/* Office Locations - Side by Side */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              {/* Singapore Office */}
              <div className="flex flex-col">
                <Image 
                  src="/img/singapore-flag.png" 
                  alt="Singapore Flag" 
                  width={32} 
                  height={21} 
                  className="mb-2" 
                  style={{ aspectRatio: '32/21' }}
                />
                <p
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                    marginBottom: '4px',
                  }}
                >
                  Crayon Data Pte Ltd
                </p>
                <p
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  18 Cross Street, #02-101
                </p>
                <p
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Singapore 048423
                </p>
              </div>

              {/* India Office */}
              <div className="flex flex-col">
                <Image 
                  src="/img/india-flag.png" 
                  alt="India Flag" 
                  width={32} 
                  height={21} 
                  className="mb-2" 
                  style={{ aspectRatio: '32/21' }}
                />
                <p
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '21px',
                    marginBottom: '4px',
                  }}
                >
                  Crayon Data India Pvt Ltd
                </p>
                <p
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Awfis Space Solutions, 7th Floor,
                </p>
                <p
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  RAR Technopolis, 4/293, OMR,
                </p>
                <p
                  style={{
                    color: '#B3B3B3',
                    fontFamily: 'Poppins',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Perungudi, Chennai, TN600096
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom decoration */}
      <div className="absolute bottom-[-20px] left-0 w-full h-[100px] overflow-hidden z-0">
        <Image
          src="/img/Footer Container.png"
          alt="Footer decoration"
          fill
          className="object-cover object-bottom"
          priority
        />
      </div>

      {/* Copyright text */}
      <div className="absolute bottom-[8px] left-1/2 transform -translate-x-1/2 text-center z-10">
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.80)',
            fontFamily: 'Poppins',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
          }}
        >
          © {new Date().getFullYear()} Crayon Data Pvt Ltd. All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
