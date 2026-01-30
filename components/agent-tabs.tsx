"use client"

import { useAuthStore } from "@/lib/store/auth.store"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { DocumentationSection } from "@/components/documentation-section"

interface Deployment {
    service_provider?: string
    service_name?: string
    service_id?: string
    by_capability?: string
    capability_name?: string
    deployment?: string
    cloud_region?: string
}

interface Documentation {
    sdk_details?: string
    swagger_details?: string
    sample_input?: string
    sample_output?: string
    security_details?: string
    related_files?: string
}

interface AgentTabsProps {
    agent: {
        features?: string
        roi?: string
    }
    deployments?: Deployment[]
    documentation?: Documentation[]
}

/**
 * AgentTabs Component - Client Component
 * 
 * Renders the Features, ROI, Deployment, and Docs tabs for agent details page.
 * Deployment and Docs tabs are only visible when user is logged in.
 */
export function AgentTabs({ agent, deployments, documentation }: AgentTabsProps) {
    const { isAuthenticated } = useAuthStore()

    // Check if there's documentation content
    const doc = documentation?.[0]
    const hasDocContent = doc && (doc.sdk_details || doc.swagger_details || doc.sample_input || doc.sample_output || doc.security_details || doc.related_files)

    // Check if there are deployments
    const hasDeployments = deployments && deployments.length > 0

    return (
        <Tabs defaultValue="features" className="w-full">
            <TabsList className="relative flex gap-8 justify-start bg-transparent p-0 h-auto rounded-none" style={{ borderBottom: "none", marginBottom: "8px" }}>
                <TabsTrigger
                    value="features"
                    className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#344054",
                        padding: "8px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "none",
                        textAlign: "left",
                    }}
                >
                    Features
                </TabsTrigger>
                <TabsTrigger
                    value="roi"
                    className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                    style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#344054",
                        padding: "8px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "none",
                        textAlign: "left",
                    }}
                >
                    ROI
                </TabsTrigger>

                {/* Deployment tab - only visible when logged in */}
                {isAuthenticated && hasDeployments && (
                    <TabsTrigger
                        value="deployment"
                        className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#344054",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "none",
                            textAlign: "left",
                        }}
                    >
                        Deployment
                    </TabsTrigger>
                )}

                {/* Docs tab - only visible when logged in */}
                {isAuthenticated && hasDocContent && (
                    <TabsTrigger
                        value="docs"
                        className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                        style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#344054",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "none",
                            textAlign: "left",
                        }}
                    >
                        Docs
                    </TabsTrigger>
                )}
            </TabsList>

            {/* Features Tab Content */}
            <TabsContent value="features" style={{ marginTop: "8px" }}>
                {agent?.features && agent.features !== "na" ? (
                    (() => {
                        const items = agent.features
                            .replace(/\\n/g, '\n')
                            .split(/[;\n]+/)
                            .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                            .filter(Boolean)

                        const scopeItems = items.filter((item) => !/^\d+\./.test(item.trim()))
                        const instructionItems = items.filter((item) => /^\d+\./.test(item.trim())).map(item => item.replace(/^\d+\.\s*/, '').trim())

                        return (
                            <div>
                                {scopeItems.length > 0 && (
                                    <div style={{ maxWidth: '640px', marginBottom: '8px' }}>
                                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '8px' }}>
                                            
                                        </h3>
                                        <ul style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, color: '#344054', lineHeight: '150%', listStyle: 'disc', paddingLeft: '21px' }} className="space-y-0">
                                            {scopeItems.map((it, i) => (
                                                <li key={i} style={{ marginBottom: i < scopeItems.length - 1 ? '8px' : '0' }}>{it}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {instructionItems.length > 0 && (
                                    <div>
                                        <h3 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontWeight: 600, color: '#101828', marginBottom: '8px' }}>
                                            Instructions
                                        </h3>
                                        <ol style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, color: '#344054', lineHeight: '150%', listStyle: 'decimal', paddingLeft: '21px' }} className="space-y-0">
                                            {instructionItems.map((it, i) => (
                                                <li key={i}>{it}</li>
                                            ))}
                                        </ol>
                                    </div>
                                )}

                                {scopeItems.length === 0 && instructionItems.length === 0 && (
                                    <ul style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, color: '#344054', lineHeight: '150%', listStyle: 'disc', paddingLeft: '21px' }} className="space-y-0">
                                        {items.map((it, i) => (
                                            <li key={i} style={{ marginBottom: i < items.length - 1 ? '8px' : '0' }}>{it}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )
                    })()
                ) : (
                    <p className="text-muted-foreground">Features information is not available for this agent.</p>
                )}
            </TabsContent>

            {/* ROI Tab Content */}
            <TabsContent value="roi" style={{ marginTop: "8px" }}>
                {agent?.roi && agent.roi !== "na" ? (
                    (() => {
                        const items = agent.roi
                            .replace(/\\n/g, '\n')
                            .split(/[;\n]+/)
                            .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                            .filter(Boolean)
                        return (
                            <ul style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, color: '#344054', lineHeight: '150%', listStyle: 'disc', paddingLeft: '21px' }} className="space-y-0">
                                {items.map((it, i) => (
                                    <li key={i} style={{ marginBottom: i < items.length - 1 ? '8px' : '0' }}>{it}</li>
                                ))}
                            </ul>
                        )
                    })()
                ) : (
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 400, color: '#6B7280', lineHeight: '150%' }}>
                        ROI information is not available for this agent.
                    </p>
                )}
            </TabsContent>

            {/* Deployment Tab Content - only rendered when logged in */}
            {isAuthenticated && hasDeployments && (
                <TabsContent value="deployment" className="mt-6">
                    {(() => {
                        const groups: Record<string, Deployment[]> = {}
                        for (const d of (deployments || [])) {
                            const key = d?.service_provider || 'Other'
                            if (!groups[key]) groups[key] = []
                            groups[key].push(d)
                        }
                        const entries = Object.entries(groups)
                        return (
                            <Accordion type="multiple" className="w-full rounded-md border">
                                {entries.map(([provider, items]) => (
                                    <AccordionItem key={provider} value={provider} className="px-4">
                                        <AccordionTrigger className="text-sm font-semibold">
                                            {provider}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid gap-3 md:grid-cols-2">
                                                {items.map((d, idx) => (
                                                    <div key={(d?.service_id || provider) + idx} className="rounded-lg border bg-white p-4">
                                                        <div className="mb-1 text-sm font-semibold text-[#101828]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                            {d?.service_name || 'Service'}
                                                        </div>
                                                        <div className="mb-3 text-xs text-[#344054]" style={{ fontFamily: 'Poppins, sans-serif', lineHeight: '150%' }}>
                                                            {d?.by_capability || d?.capability_name || 'Capability'}
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <Badge variant="outline">{d?.deployment || 'Cloud/On-Prem'}</Badge>
                                                            <Badge variant="default">{d?.cloud_region || 'Regions'}</Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )
                    })()}
                </TabsContent>
            )}

            {/* Docs Tab Content - only rendered when logged in */}
            {isAuthenticated && hasDocContent && doc && (
                <TabsContent value="docs" className="mt-6">
                    <DocumentationSection documentation={doc} />
                </TabsContent>
            )}
        </Tabs>
    )
}

export default AgentTabs
