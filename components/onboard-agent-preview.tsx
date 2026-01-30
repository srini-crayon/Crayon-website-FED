"use client"

import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Label } from "./ui/label"
import { ExternalLink, Sparkles, TrendingUp, Users, Tag, FileText, Shield, Code, Cloud } from "lucide-react"
import ReadMore from "./read-more"
import CollapsibleList from "./collapsible-list"
import DemoAssetsViewer from "./demo-assets-viewer"

// Import the FormData interface from the onboard page
interface FormData {
  // Tab 1: Agent Details
  agentName: string
  agentDescription: string
  agentType: string
  tags: string[]
  bundledAgents?: string[]
  targetPersonas: string[]
  keyFeatures: string
  valueProposition: string
  roiInformation: string
  demoLink: string
  
  // Tab 2: Capabilities
  coreCapabilities: string[]
  coreCapabilityMap?: Record<string, string>
  
  // Tab 3: Demo Assets
  demoLinks: string[]
  bulkFiles: FileWithPreview[]
  
  // Tab 4: Documentation
  sdkDetails: string
  apiDocumentation: string
  sampleInput: string
  sampleOutput: string
  securityDetails: string
  readmeFile: File | null
  additionalRelatedFiles: string | string[]
  deploymentOptions: DeploymentOption[]
}

interface FileWithPreview {
  file: File
  name: string
  size: number
  type: string
  previewUrl?: string
  videoUrl?: string // Store original video blob URL for playback
}

interface DeploymentOption {
  serviceProvider: string
  serviceName: string
  deploymentType: string
  cloudRegion: string
  capability: string
}

interface OnboardAgentPreviewProps {
  formData: FormData
}

export function OnboardAgentPreview({ formData }: OnboardAgentPreviewProps) {
  // Transform demo assets data for DemoAssetsViewer
  const demoAssets = [
    ...formData.demoLinks.map(link => ({ demo_link: link })),
    ...formData.bulkFiles
      .filter(f => f.previewUrl || f.videoUrl) // Include files with preview URLs or video URLs
      .map(f => ({ 
        // For videos, use videoUrl for playback, previewUrl is the thumbnail
        // For images, use previewUrl
        demo_link: f.type.startsWith('video/') && f.videoUrl ? f.videoUrl : f.previewUrl!,
        demo_asset_name: f.name, // Add file name for better display
        demo_asset_type: f.type // Add file type for video detection
      }))
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-none">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 
              className="text-2xl font-bold mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "150%",
                color: "#111827",
              }}
            >
              {formData.agentName || 'Unnamed Agent'}
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              {formData.agentType && (
                <Badge 
                  variant="outline" 
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    backgroundColor: "#E6EDFD",
                    borderColor: "#004BEC",
                    color: "#004BEC",
                    border: "2px solid #004BEC",
                  }}
                >
                  {formData.agentType}
                </Badge>
              )}
              {formData.valueProposition && (
                <div className="flex items-center gap-1.5">
                 
                  <span 
                    className="font-medium text-gray-700 text-sm"
                    style={{
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {formData.valueProposition}
                  </span>
                </div>
              )}
              {/* <Badge 
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  fontFamily: "Inter, sans-serif",
                  backgroundColor: "#FEF3C7",
                  color: "#92400E",
                  border: "1px solid #FCD34D",
                }}
              >
                Draft
              </Badge> */}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 bg-white">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Consolidated Overview Card */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                {/* Description */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <Label 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      lineHeight: "150%",
                      color: "#111827",
                      marginBottom: "8px",
                      display: "block",
                    }}
                  >
                    Description
                  </Label>
                  <ReadMore 
                    text={formData.agentDescription || 'No description provided'} 
                    className="text-gray-700 text-sm leading-relaxed"
                    style={{ 
                      fontFamily: "Inter, sans-serif",
                      fontSize: "14px",
                      lineHeight: "150%",
                      color: "#6B7280",
                    }}
                  />
                </div>

                {/* Metadata Grid - All in one card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags */}
                  {formData.tags.length > 0 && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Categories
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              backgroundColor: "#F3F4F6",
                              color: "#4B5563",
                              border: "1px solid #E5E7EB",
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Target Personas */}
                  {formData.targetPersonas.length > 0 && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Target Personas
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.targetPersonas.map((persona, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              backgroundColor: "#E6EDFD",
                              borderColor: "#004BEC",
                              color: "#004BEC",
                              border: "2px solid #004BEC",
                            }}
                          >
                            {persona}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bundled Agents */}
                  {formData.bundledAgents && formData.bundledAgents.length > 0 && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Bundled Agents
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.bundledAgents.map((agent, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="text-xs font-medium px-3 py-1 rounded-full"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              backgroundColor: "#F3E8FF",
                              borderColor: "#C084FC",
                              color: "#7C3AED",
                              border: "2px solid #C084FC",
                            }}
                          >
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Demo Link */}
                  {formData.demoLink && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Demo Link
                      </Label>
                      <a
                        href={formData.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate block"
                        style={{
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {formData.demoLink}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList 
                className="grid w-full grid-cols-4 bg-transparent p-0 gap-6 h-12 rounded-none border-0"
              >
                <TabsTrigger 
                  value="features"
                  className="data-[state=active]:text-blue-600 font-medium text-sm"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  Features
                </TabsTrigger>
                <TabsTrigger 
                  value="roi"
                  className="data-[state=active]:text-blue-600 font-medium text-sm"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  ROI
                </TabsTrigger>
                <TabsTrigger 
                  value="deployment"
                  className="data-[state=active]:text-blue-600 font-medium text-sm"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  Deployment
                </TabsTrigger>
                <TabsTrigger 
                  value="docs"
                  className="data-[state=active]:text-blue-600 font-medium text-sm"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#6B7280",
                  }}
                >
                  Docs
                </TabsTrigger>
              </TabsList>
              <div className="h-px bg-gray-200 -mx-6 mt-0" />

              <TabsContent value="features" className="mt-6">
                {formData.keyFeatures.trim() ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "150%", color: "#6B7280" }}>
                    {formData.keyFeatures.split(/[;,]|\n/).map((f, i) => {
                      const feature = f.trim()
                      return feature.length > 0 ? (
                        <li key={i} className="leading-relaxed">{feature}</li>
                      ) : null
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6B7280" }}>
                    Features information is not available for this agent.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="roi" className="mt-6">
                {formData.roiInformation?.trim() ? (
                  <ul className="list-disc pl-5 space-y-2 text-gray-700" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", lineHeight: "150%", color: "#6B7280" }}>
                    {formData.roiInformation.split(/[;]|\n/).map((item, i) => {
                      const roiItem = item.trim()
                      return roiItem.length > 0 ? (
                        <li key={i} className="leading-relaxed">{roiItem}</li>
                      ) : null
                    })}
                  </ul>
                ) : (
                  <p className="text-muted-foreground" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6B7280" }}>
                    ROI information is not available for this agent.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="deployment" className="mt-6">
                {formData.deploymentOptions && formData.deploymentOptions.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {formData.deploymentOptions.map((option, index) => {
                      const providerColors: Record<string, { bg: string; border: string; text: string }> = {
                        "AWS": { bg: "#FFF4E6", border: "#FF9900", text: "#B45309" },
                        "Azure": { bg: "#E3F2FD", border: "#0078D4", text: "#01579B" },
                        "GCP": { bg: "#E8F0FE", border: "#4285F4", text: "#1A73E8" },
                        "Open-Source": { bg: "#E8F5E9", border: "#28A745", text: "#1B5E20" },
                        "SaaS": { bg: "#F3E5F5", border: "#9C27B0", text: "#4A148C" },
                      }
                      const colors = providerColors[option.serviceProvider] || { bg: "#F3F4F6", border: "#6B7280", text: "#374151" }
                      
                      return (
                        <AccordionItem 
                          key={index}
                          value={`item-${index}`}
                          className="border rounded-lg px-4 py-3"
                          style={{
                            borderColor: colors.border,
                            backgroundColor: colors.bg,
                          }}
                        >
                          <AccordionTrigger className="text-sm font-medium hover:no-underline py-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="px-2 py-1 rounded text-xs font-semibold"
                                style={{
                                  backgroundColor: colors.border,
                                  color: "#FFFFFF",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {option.serviceProvider}
                              </div>
                              <span style={{ color: colors.text, fontFamily: "Inter, sans-serif" }} className="text-sm">{option.serviceName}</span>
                              {option.deploymentType && (
                                <span className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>• {option.deploymentType}</span>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm pt-3 pb-2" style={{ fontFamily: "Inter, sans-serif" }}>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <span className="font-semibold text-gray-700 text-sm">Provider:</span>
                                <p className="text-gray-600 text-sm mt-1">{option.serviceProvider}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 text-sm">Service:</span>
                                <p className="text-gray-600 text-sm mt-1">{option.serviceName}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 text-sm">Type:</span>
                                <p className="text-gray-600 text-sm mt-1">{option.deploymentType}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 text-sm">Region:</span>
                                <p className="text-gray-600 text-sm mt-1">{option.cloudRegion || "N/A"}</p>
                              </div>
                              {option.capability && (
                                <div className="col-span-2">
                                  <span className="font-semibold text-gray-700 text-sm">Capability:</span>
                                  <p className="text-gray-600 text-sm mt-1">{option.capability}</p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6B7280" }}>
                    Deployment options are not available for this agent.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="docs" className="mt-6">
                <div className="space-y-4">
                  {formData.sdkDetails && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        SDK Details
                      </Label>
                      <ReadMore 
                        text={formData.sdkDetails} 
                        className="text-gray-700"
                        style={{ 
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#6B7280",
                        }}
                      />
                    </div>
                  )}
                  {formData.apiDocumentation && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        API Documentation
                      </Label>
                      <a
                        href={formData.apiDocumentation}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1.5"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="truncate max-w-xs">{formData.apiDocumentation}</span>
                      </a>
                    </div>
                  )}
                  {formData.sampleInput && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Sample Input
                      </Label>
                      <div className="bg-gray-900 rounded p-3 text-sm font-mono text-gray-100 overflow-x-auto" style={{ fontFamily: "monospace" }}>
                        {formData.sampleInput}
                      </div>
                    </div>
                  )}
                  {formData.sampleOutput && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Sample Output
                      </Label>
                      <div className="bg-gray-900 rounded p-3 text-sm font-mono text-gray-100 overflow-x-auto" style={{ fontFamily: "monospace" }}>
                        {formData.sampleOutput}
                      </div>
                    </div>
                  )}
                  {formData.securityDetails && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Security Details
                      </Label>
                      <ReadMore 
                        text={formData.securityDetails} 
                        className="text-gray-700"
                        style={{ 
                          fontFamily: "Inter, sans-serif",
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#6B7280",
                        }}
                      />
                    </div>
                  )}
                  {formData.additionalRelatedFiles && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Additional Files ({Array.isArray(formData.additionalRelatedFiles) ? formData.additionalRelatedFiles.length : 1})
                      </Label>
                      {Array.isArray(formData.additionalRelatedFiles) ? (
                        <ul className="list-none space-y-2" style={{ fontFamily: "Inter, sans-serif" }}>
                          {formData.additionalRelatedFiles.map((link, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <a 
                                href={link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate"
                              >
                                {link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ReadMore 
                          text={formData.additionalRelatedFiles} 
                          className="text-gray-700"
                          style={{ 
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            lineHeight: "150%",
                            color: "#6B7280",
                          }}
                        />
                      )}
                    </div>
                  )}
                  {!formData.sdkDetails && !formData.apiDocumentation && 
                   !formData.sampleInput && !formData.sampleOutput && 
                   !formData.securityDetails && (!formData.additionalRelatedFiles || 
                   (Array.isArray(formData.additionalRelatedFiles) && formData.additionalRelatedFiles.length === 0)) && (
                    <p className="text-muted-foreground" style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#6B7280" }}>
                      Documentation is not available for this agent.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Consolidated Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Core Capabilities */}
                  {formData.coreCapabilities.length > 0 && (
                    <div className="pb-6 border-b border-gray-200">
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Core Capabilities ({formData.coreCapabilities.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.coreCapabilities.map((capabilityId, index) => {
                          const capabilityName = formData.coreCapabilityMap?.[capabilityId] || capabilityId
                          return (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className="text-xs font-medium px-3 py-1 rounded-full"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                backgroundColor: "#F3E8FF",
                                borderColor: "#C084FC",
                                color: "#7C3AED",
                                border: "2px solid #C084FC",
                              }}
                            >
                              {capabilityName}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Demo Assets */}
                  {demoAssets.length > 0 && (
                    <div className="pb-6 border-b border-gray-200">
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Demo Assets ({demoAssets.length})
                      </Label>
                      <DemoAssetsViewer assets={demoAssets} />
                    </div>
                  )}

                  {/* Uploaded Files Summary */}
                  {formData.bulkFiles.length > 0 && (
                    <div className="pb-6 border-b border-gray-200">
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        Uploaded Files ({formData.bulkFiles.length})
                      </Label>
                      <div className="space-y-2">
                        {formData.bulkFiles.map((file, index) => (
                          <div 
                            key={index} 
                            className="text-sm p-2 rounded bg-gray-50 border border-gray-200"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            <span className="font-medium text-gray-900">{file.name}</span>
                            <span className="text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* README File */}
                  {formData.readmeFile && (
                    <div>
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: "#111827",
                          marginBottom: "8px",
                          display: "block",
                        }}
                      >
                        README File
                      </Label>
                      <div className="text-sm p-2 rounded bg-gray-50 border border-gray-200" style={{ fontFamily: "Inter, sans-serif" }}>
                        <span className="font-medium text-gray-900">{formData.readmeFile.name}</span>
                        <span className="text-gray-500 ml-2">({(formData.readmeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
