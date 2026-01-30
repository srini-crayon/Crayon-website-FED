"use client"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../lib/utils"

interface MultiSelectInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  required?: boolean
  width?: string
}

export function MultiSelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Type to search or add new...",
  required = false,
  width = "450px",
}: MultiSelectInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [isSelectedExpanded, setIsSelectedExpanded] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(option)
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options.filter(option => !value.includes(option)))
    }
  }, [inputValue, options, value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Add CSS animations
  useEffect(() => {
    const styleId = 'multi-select-animations'
    if (document.getElementById(styleId)) return

    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      const existingStyle = document.getElementById(styleId)
      if (existingStyle) {
        document.head.removeChild(existingStyle)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const addItem = (item: string) => {
    if (item.trim() && !value.includes(item.trim())) {
      onChange([...value, item.trim()])
    }
    setInputValue("")
    setIsOpen(false)
  }

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter(item => item !== itemToRemove))
  }

  const clearAll = () => {
    onChange([])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputValue.trim()) {
        addItem(inputValue)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <label 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "150%",
          letterSpacing: "0%",
          color: "#111827",
        }}
      >
        {label} {required && <span style={{ color: "#111827" }}>*</span>}
      </label>
      
      {/* Selected items - Static container with fixed width and height */}
      {value.length > 0 && (
        <div 
          className="transition-all duration-300 ease-in-out"
          style={{
            width: width,
            minWidth: "240px",
            height: isSelectedExpanded ? "140px" : "44px",
            overflow: "hidden",
            borderRadius: "4px",
            border: "1px solid #E5E7EB",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Summary header - always visible, fixed height */}
          <div 
            className="flex items-center justify-between px-4 cursor-pointer transition-all duration-200"
            onClick={() => setIsSelectedExpanded(!isSelectedExpanded)}
            style={{
              height: "44px",
              backgroundColor: isSelectedExpanded ? "#F9FAFB" : "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              if (!isSelectedExpanded) {
                e.currentTarget.style.backgroundColor = "#F9FAFB"
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelectedExpanded) {
                e.currentTarget.style.backgroundColor = "#FFFFFF"
              }
            }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span 
                className="inline-flex items-center justify-center rounded-full text-xs font-medium flex-shrink-0"
                style={{
                  backgroundColor: "#004BEC",
                  color: "#FFFFFF",
                  width: "20px",
                  height: "20px",
                  minWidth: "20px",
                }}
              >
                {value.length}
              </span>
              <span 
                className="text-sm font-medium truncate"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  color: "#111827",
                }}
              >
                {value.length === 1 ? "1 item selected" : `${value.length} items selected`}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearAll()
                  }}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 flex-shrink-0"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Clear all
                </button>
              )}
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-gray-500 transition-transform flex-shrink-0",
                  isSelectedExpanded && "rotate-180"
                )}
              />
            </div>
          </div>

          {/* Selected items container - scrollable when expanded, fixed height */}
          {isSelectedExpanded && (
            <div 
              className="px-4 pb-2 overflow-y-auto border-t pt-2"
              style={{
                height: "96px",
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 #F1F5F9",
                borderTopColor: "#E5E7EB",
                backgroundColor: "#FAFBFC",
              }}
            >
              <div 
                className="flex flex-wrap gap-2"
                style={{
                  width: "100%",
                }}
              >
                {value.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs flex-shrink-0"
                    style={{
                      backgroundColor: "#EFF6FF",
                      color: "#004BEC",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      maxWidth: "calc(100% - 8px)",
                    }}
                  >
                    <span className="truncate" style={{ maxWidth: "200px" }}>{item}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item)
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800 flex-shrink-0"
                      style={{
                        width: "14px",
                        height: "14px",
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          style={{
            width: width,
            minWidth: "240px",
            height: "44px",
            borderRadius: "4px",
            paddingTop: "11px",
            paddingRight: "40px",
            paddingBottom: "11px",
            paddingLeft: "16px",
            border: "1px solid #E5E7EB",
            borderTop: "1px solid #E5E7EB",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "150%",
            letterSpacing: "0%",
            verticalAlign: "middle",
            color: inputValue ? "#111827" : "#6B7280",
          }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              width: width,
              minWidth: "240px",
            }}
          >
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => addItem(option)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {inputValue.trim() ? "No matching options" : "No available options"}
                </div>
              )}
              
              {/* Add custom option */}
              {inputValue.trim() && !options.includes(inputValue.trim()) && !value.includes(inputValue.trim()) && (
                <button
                  type="button"
                  onClick={() => addItem(inputValue)}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
                >
                  + Add "{inputValue}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
