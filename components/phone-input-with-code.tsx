"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check, Search } from "lucide-react"

interface PhoneInputWithCodeProps {
  label: string
  placeholder?: string
  value: string
  countryCode: string
  onValueChange: (value: string) => void
  onCountryCodeChange: (code: string) => void
  required?: boolean
}

const countryCodes = [
  { code: "IND", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "USA", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GBR", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CAN", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "AUS", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "DEU", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FRA", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "JPN", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "CHN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "SGP", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "UAE", dialCode: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "SAU", dialCode: "+966", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "NLD", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "ESP", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
  { code: "ITA", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "BRA", dialCode: "+55", name: "Brazil", flag: "🇧🇷" },
  { code: "KOR", dialCode: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "MYS", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "IDN", dialCode: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "THA", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
]

// Label styling matching InputField component
const labelStyle = {
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontStyle: "normal" as const,
  fontSize: "14px",
  lineHeight: "24px",
  letterSpacing: "0%",
  color: "#555555",
}

// Input styling matching InputField component
const inputStyle = {
  height: "42px",
  borderRadius: "0 4px 4px 0",
  border: "1px solid #E5E7EB",
  borderLeft: "none",
  backgroundColor: "#FFFFFF",
  fontFamily: "Poppins, sans-serif",
  fontWeight: 400,
  fontStyle: "normal" as const,
  fontSize: "14px",
  lineHeight: "28px",
  letterSpacing: "0%",
}

export function PhoneInputWithCode({
  label,
  placeholder = "Enter your contact number",
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  required = false
}: PhoneInputWithCodeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedCountry = countryCodes.find(country => country.code === countryCode) || countryCodes[0]

  // Filter countries based on search query
  const filteredCountries = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
        setSearchQuery("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [isDropdownOpen])

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="space-y-2">
      <label style={labelStyle}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex w-full" style={{ maxWidth: "504px" }}>
        {/* Country Code Dropdown Trigger */}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onKeyDown={handleKeyDown}
            className="flex items-center justify-between gap-2 px-3 transition-all duration-200"
            style={{
              height: "42px",
              minWidth: "110px",
              borderRadius: "4px 0 0 4px",
              border: "1px solid #E5E7EB",
              borderRight: "none",
              backgroundColor: isDropdownOpen ? "#F9FAFB" : "#FFFFFF",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "28px",
              color: "#181818",
            }}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">{selectedCountry.flag}</span>
              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
              style={{
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              role="listbox"
            >
              {/* Search Input */}
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 placeholder:text-gray-400"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "13px",
                    }}
                  />
                </div>
              </div>

              {/* Country List */}
              <div className="max-h-48 overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        onCountryCodeChange(country.code)
                        setIsDropdownOpen(false)
                        setSearchQuery("")
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        backgroundColor: selectedCountry.code === country.code ? "#F3F4F6" : "transparent",
                      }}
                      role="option"
                      aria-selected={selectedCountry.code === country.code}
                    >
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="flex-1 text-left text-gray-700">{country.name}</span>
                      <span className="text-gray-500 text-xs">{country.dialCode}</span>
                      {selectedCountry.code === country.code && (
                        <Check className="h-4 w-4 text-gray-700" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-4 text-center text-sm text-gray-500">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            // Only allow numbers and common phone characters
            const sanitized = e.target.value.replace(/[^0-9\s\-()]/g, "")
            onValueChange(sanitized)
          }}
          className="flex-1 px-4 outline-none transition-all duration-200 focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 placeholder:italic placeholder:text-gray-400"
          style={{
            ...inputStyle,
            color: value ? "#181818" : "#B3B3B3",
          }}
          onFocus={(e) => {
            e.target.style.color = "#181818"
          }}
          onBlur={(e) => {
            e.target.style.color = e.target.value ? "#181818" : "#B3B3B3"
          }}
        />
      </div>
    </div>
  )
}
