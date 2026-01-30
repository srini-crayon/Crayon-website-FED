"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { ArrowLeft, ArrowRight, Check, ChevronRight, X, Upload, FileText, Image as ImageIcon, Code, Megaphone, TrendingUp, Users, DollarSign, Headphones, BarChart3, FolderKanban, Briefcase, Package, Palette, Search, MessageSquare, Video, Mic, Sparkles, Zap, Brain, CheckCircle2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"
import { MultiSelectInput } from "./multi-select-input"
import { DropdownWithCustom } from "./dropdown-with-custom"
import { useAuthStore } from "../lib/store/auth.store"
import { OnboardAgentPreview } from "./onboard-agent-preview"
import { UploadSuccessModal } from "./upload-success-modal"
import DemoAssetsViewer from "./demo-assets-viewer"

type Step = 1 | 2 | 3 | 4 | 5

// Predefined options for multi-select fields - will be populated from API
let tagOptions = [
  "AI/ML", "Automation", "Productivity", "Analytics", "Integration",
  "Cloud", "Enterprise", "Open Source", "Machine Learning", "Deep Learning",
  "Natural Language Processing", "Computer Vision", "Robotics", "IoT"
]

let targetPersonaOptions = [
  "Developer", "Marketing Professional", "Sales Professional", "HR Professional",
  "Finance Professional", "Customer Service Representative", "Data Analyst",
  "Project Manager", "Executive", "Product Manager", "Designer", "Researcher"
]

// Icon mapping for Target Personas
const personaIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Developer": Code,
  "Marketing Professional": Megaphone,
  "Sales Professional": TrendingUp,
  "HR Professional": Users,
  "Finance Professional": DollarSign,
  "Customer Service Representative": Headphones,
  "Data Analyst": BarChart3,
  "Project Manager": FolderKanban,
  "Executive": Briefcase,
  "Product Manager": Package,
  "Designer": Palette,
  "Researcher": Search,
}

// Icon mapping for Core Capabilities
const capabilityIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Conversational AI & Advisory": MessageSquare,
  "Document Processing & Analysis": FileText,
  "Image Processing": ImageIcon,
  "Video Processing": Video,
  "Voice & Meetings": Mic,
  "Data Analysis & Insights": BarChart3,
  "Content Generation": Sparkles,
  "Process Automation": Zap,
  "Predictive Analytics": TrendingUp,
  "Machine Learning": Brain,
}

const keyFeatureOptions = [
  "Real-time Processing", "Multi-language Support", "API Integration",
  "Customizable Workflows", "Advanced Analytics", "Enterprise Security",
  "Auto-scaling", "Mobile Ready", "Cloud Native", "On-premise Deployment"
]

const capabilityOptions = [
  "Conversational AI & Advisory", "Document Processing & Analysis", "Image Processing",
  "Video Processing", "Voice & Meetings", "Data Analysis & Insights",
  "Content Generation", "Process Automation", "Predictive Analytics", "Machine Learning"
]

// Dropdown options - will be populated from API
let agentTypeOptions = ["Agent", "Solution", "Platform", "Tool", "Service"]
let valuePropositionOptions = ["Analytics", "Customer Experience", "Data", "Productivity"]

const serviceProviderOptions = ["AWS", "Azure", "GCP", "Open-Source", "SaaS"]

const bundledAgentOptions = [
  "Text Analyzer", "Image Processor", "Voice Recognition", "Data Extractor",
  "Content Generator", "Sentiment Analyzer", "Document Parser", "Chat Assistant",
  "Translation Agent", "Summarization Agent", "Question Answering", "Entity Extractor"
]

const serviceNameOptions = [
  "ABBYY FlexiCapture", "Amazon Athena", "Amazon Chime SDK Amazon Transcribe",
  "Amazon Comprehend", "Amazon EMR", "Amazon Kendra", "Amazon Kinesis Video Streams",
  "Amazon Lex", "Amazon Polly", "Amazon Redshift", "Amazon Rekognition Video",
  "Amazon Textract", "Amazon Transcribe", "Anthropic Claude", "Apache Spark",
  "AssemblyAI", "Azure AI Bot Service", "Azure AI Document Intelligence",
  "Azure AI Search", "Azure AI Speech", "Azure AI Video Indexer",
  "Azure Communication Services", "Azure Databricks", "Azure Media Services",
  "Azure OpenAI Service", "Azure Synapse Analytics", "BigQuery", "Botpress",
  "Camelot", "Cloud Speech-to-Text", "Cloud Video Intelligence API",
  "Coqui STT", "Dask", "Databricks (non-AWS)", "Dataproc", "DeepDoctection",
  "Deepgram Video API", "Detectron2", "Dialogflow", "Diffbot", "DocMind AI",
  "DocQuery", "Docling", "Document AI", "Excalibur", "GPT-4 Open-Source Variants",
  "Google Meet", "Grobid", "Haystack", "Import.io", "LangChain", "LayoutLMv3",
  "Media CDN", "MediaPipe", "Milvus", "OpenAI GPT APIs", "OpenAI Whisper (open-source variant)",
  "OpenAssistant", "OpenCV", "OpenSemanticSearch", "Pandas", "Pinecone",
  "PyTorchVideo", "Qdrant", "Rasa", "Rev.ai", "Rossum", "Snowflake (multi-cloud)",
  "TableFormer", "Tesseract OCR", "Vaex", "Vertex AI Search and Conversation",
  "Vosk", "Weaviate", "Zubtitle"
]
const deploymentTypeOptions = ["Cloud", "On-Prem", "Hybrid", "Edge", "Serverless"]

// Capability interface
interface Capability {
  by_capability_id: string
  by_capability: string
}

// Form data interface
interface AgentFormData {
  // Tab 1: Agent Details
  agentName: string
  agentDescription: string
  agentType: string
  tags: string[]
  bundledAgents: string[]
  targetPersonas: string[]
  keyFeatures: string
  valueProposition: string
  roiInformation: string
  demoLink: string

  // Tab 2: Capabilities - store both ID and name
  coreCapabilities: string[] // Store capability IDs
  coreCapabilityMap: Record<string, string> // Map capability ID to name

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
  additionalRelatedFiles: string[]
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
  capabilityId?: string // Store capability ID for reference
  isManual?: boolean // Flag to track if this is a manually created option
}

// API response interface for deployments
interface DeploymentApiResponse {
  capability_id: string
  capability_name: string
  options: Array<{
    service_provider: string
    service_name: string
    deployment: string
    cloud_region: string
  }>
}

interface CustomOnboardModalProps {
  isOpen: boolean
  onClose: () => void
  agent?: any // AgentAPIResponse for edit mode
  onSave?: () => void // Callback for edit mode after successful save
}

export function CustomOnboardModal({ isOpen, onClose, agent, onSave }: CustomOnboardModalProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const isEditMode = !!agent
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoadingAgentData, setIsLoadingAgentData] = useState(false)
  const [apiDemoAssets, setApiDemoAssets] = useState<any[]>([])
  const [demoPreview, setDemoPreview] = useState<string>("")
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [isLoadingCapabilities, setIsLoadingCapabilities] = useState(false)
  const [loadingDeployments, setLoadingDeployments] = useState<Record<string, boolean>>({})
  const [deploymentData, setDeploymentData] = useState<Record<string, DeploymentApiResponse>>({})
  const [agentCapabilitiesFromAPI, setAgentCapabilitiesFromAPI] = useState<any[]>([])
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  const [newDemoLink, setNewDemoLink] = useState("")
  const [newAdditionalLink, setNewAdditionalLink] = useState("")
  const [editingManualOptions, setEditingManualOptions] = useState<Set<number>>(new Set())

  // State for onboarding filter options from API
  const [onboardingFilters, setOnboardingFilters] = useState<{
    agent_types: string[]
    value_propositions: string[]
    tags: string[]
    target_personas: string[]
  }>({
    agent_types: agentTypeOptions,
    value_propositions: valuePropositionOptions,
    tags: tagOptions,
    target_personas: targetPersonaOptions,
  })
  const [isLoadingFilters, setIsLoadingFilters] = useState(false)

  // State to track selected deployment options (by index)
  const [selectedDeploymentIndices, setSelectedDeploymentIndices] = useState<Set<number>>(new Set())

  // Function to toggle deployment option selection
  const toggleDeploymentSelection = (index: number) => {
    setSelectedDeploymentIndices(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Function to save custom values to API
  const saveCustomValueToAPI = async (fieldType: 'agent_type' | 'value_proposition' | 'tags', value: string | string[]) => {
    try {
      // Use URLSearchParams for application/x-www-form-urlencoded
      const params = new URLSearchParams()

      // Initialize all fields as empty strings (required by backend API)
      params.append('agent_type', '')
      params.append('value_proposition', '')
      params.append('tags', '')
      params.append('target_personas', '')

      // Override the field being updated
      if (fieldType === 'agent_type') {
        params.set('agent_type', value as string || '')
      } else if (fieldType === 'value_proposition') {
        params.set('value_proposition', value as string || '')
      } else if (fieldType === 'tags') {
        params.set('tags', Array.isArray(value) && value.length > 0 ? value.join(',') : '')
      }

      const response = await fetch('/api/agent-onboarding-filters', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      })

      if (!response.ok) {
        console.error('Failed to save custom value to API:', response.status)
      } else {
        // Optionally refresh the filters after saving
        // This ensures the new custom value appears in the dropdown
        const filtersResponse = await fetch('/api/agent-onboarding-filters', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        })

        if (filtersResponse.ok) {
          const data = await filtersResponse.json()
          setOnboardingFilters(prev => ({
            agent_types: data.agent_types || prev.agent_types,
            value_propositions: data.value_propositions || prev.value_propositions,
            tags: data.tags || prev.tags,
            target_personas: data.target_personas || prev.target_personas,
          }))
        }
      }
    } catch (error) {
      console.error('Error saving custom value to API:', error)
    }
  }

  // Function to fetch deployments for a specific capability
  const fetchDeploymentsForCapability = async (capabilityId: string, capabilityName: string) => {
    setLoadingDeployments(prev => ({ ...prev, [capabilityId]: true }))

    try {
      const { createApiUrl } = await import('../lib/api/config')
      const apiUrl = createApiUrl(`/api/capabilities/${capabilityId}/deployments`)

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch deployments: ${response.status}`)
      }

      const data: DeploymentApiResponse = await response.json()

      // Store deployment data
      setDeploymentData(prev => ({
        ...prev,
        [capabilityId]: data,
      }))

      // Auto-populate deployment options
      if (data.options && data.options.length > 0) {
        const newDeploymentOptions: DeploymentOption[] = data.options.map(option => ({
          serviceProvider: option.service_provider,
          serviceName: option.service_name,
          deploymentType: option.deployment,
          cloudRegion: option.cloud_region,
          capability: capabilityName,
          capabilityId: capabilityId,
          isManual: false, // Explicitly mark as fetched, not manual
        }))

        // Add new options, avoiding duplicates
        setFormData(prev => {
          const existingOptions = prev.deploymentOptions
          const existingKeys = new Set(
            existingOptions.map(opt =>
              `${opt.capabilityId}-${opt.serviceProvider}-${opt.serviceName}-${opt.deploymentType}`
            )
          )

          const uniqueNewOptions = newDeploymentOptions.filter(opt => {
            const key = `${opt.capabilityId}-${opt.serviceProvider}-${opt.serviceName}-${opt.deploymentType}`
            return !existingKeys.has(key)
          })

          return {
            ...prev,
            deploymentOptions: [...existingOptions, ...uniqueNewOptions],
          }
        })
      }
    } catch (error) {
      console.error(`Error fetching deployments for capability ${capabilityId}:`, error)
    } finally {
      setLoadingDeployments(prev => ({ ...prev, [capabilityId]: false }))
    }
  }

  // Fetch onboarding filters from API
  useEffect(() => {
    const fetchOnboardingFilters = async () => {
      setIsLoadingFilters(true)
      try {
        console.log('Fetching onboarding filters from /api/agent-onboarding-filters...')
        const response = await fetch('/api/agent-onboarding-filters', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          cache: 'no-store',
        })

        console.log('Response status:', response.status, response.statusText)

        if (!response.ok) {
          const errorText = await response.text()
          console.error('API Error Response:', errorText)
          throw new Error(`Failed to fetch onboarding filters: ${response.status} - ${errorText}`)
        }

        const data = await response.json()

        // Debug logging - detailed response inspection
        console.log('=== Onboarding Filters API Response ===')
        console.log('Full response data:', JSON.stringify(data, null, 2))
        console.log('Response keys:', Object.keys(data))
        console.log('Agent types:', data.agent_types, 'Type:', typeof data.agent_types, 'Is Array:', Array.isArray(data.agent_types))
        console.log('Value propositions:', data.value_propositions, 'Type:', typeof data.value_propositions, 'Is Array:', Array.isArray(data.value_propositions))
        console.log('Tags:', data.tags, 'Type:', typeof data.tags, 'Is Array:', Array.isArray(data.tags))
        console.log('Target personas:', data.target_personas, 'Type:', typeof data.target_personas, 'Is Array:', Array.isArray(data.target_personas))

        // Check if data exists and has the expected structure
        if (!data || typeof data !== 'object') {
          console.warn('Invalid response data structure, using defaults')
          throw new Error('Invalid response data structure')
        }

        // Ensure all values are arrays - handle various response formats
        const agentTypes = Array.isArray(data.agent_types)
          ? data.agent_types
          : (data.agent_types ? [String(data.agent_types)] : agentTypeOptions)

        const valuePropositions = Array.isArray(data.value_propositions)
          ? data.value_propositions
          : (data.value_propositions ? [String(data.value_propositions)] : valuePropositionOptions)

        const tags = Array.isArray(data.tags)
          ? data.tags
          : (data.tags ? [String(data.tags)] : tagOptions)

        const targetPersonas = Array.isArray(data.target_personas)
          ? data.target_personas
          : (data.target_personas ? [String(data.target_personas)] : targetPersonaOptions)

        // Validate that we have actual data (not just empty arrays)
        if (agentTypes.length === 0 && valuePropositions.length === 0 && tags.length === 0 && targetPersonas.length === 0) {
          console.warn('API returned empty arrays for all fields, using defaults')
          throw new Error('API returned empty data')
        }

        // Update state with fetched data
        setOnboardingFilters({
          agent_types: agentTypes,
          value_propositions: valuePropositions,
          tags: tags,
          target_personas: targetPersonas,
        })

        console.log('✅ Successfully updated onboarding filters state:', {
          agent_types: agentTypes.length,
          value_propositions: valuePropositions.length,
          tags: tags.length,
          target_personas: targetPersonas.length,
        })
        console.log('Sample data - First 3 items:', {
          agent_types: agentTypes.slice(0, 3),
          value_propositions: valuePropositions.slice(0, 3),
          tags: tags.slice(0, 3),
          target_personas: targetPersonas.slice(0, 3),
        })
      } catch (error) {
        console.error('❌ Error fetching onboarding filters:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        })
        // Keep default values if API fails
        console.log('Using default filter options as fallback')
        setOnboardingFilters({
          agent_types: agentTypeOptions,
          value_propositions: valuePropositionOptions,
          tags: tagOptions,
          target_personas: targetPersonaOptions,
        })
      } finally {
        setIsLoadingFilters(false)
      }
    }

    if (isOpen) {
      fetchOnboardingFilters()
    }
  }, [isOpen])

  // Fetch capabilities from API
  useEffect(() => {
    const fetchCapabilities = async () => {
      setIsLoadingCapabilities(true)
      try {
        const { createApiUrl } = await import('../lib/api/config')
        const apiUrl = createApiUrl('/api/capabilities')

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch capabilities: ${response.status}`)
        }

        const data = await response.json()

        // Extract unique capabilities (deduplicate by capability name)
        // Keep the first occurrence of each unique capability name
        const uniqueCapabilitiesMap = new Map<string, Capability>()

        if (data.capabilities && Array.isArray(data.capabilities)) {
          data.capabilities.forEach((cap: Capability) => {
            // Use capability name as key to ensure uniqueness
            // If duplicate name exists, keep the first one
            if (!uniqueCapabilitiesMap.has(cap.by_capability)) {
              uniqueCapabilitiesMap.set(cap.by_capability, cap)
            }
          })
        }

        const uniqueCapabilities = Array.from(uniqueCapabilitiesMap.values())
        // Sort by capability name for better UX
        uniqueCapabilities.sort((a, b) => a.by_capability.localeCompare(b.by_capability))
        setCapabilities(uniqueCapabilities)
      } catch (error) {
        console.error('Error fetching capabilities:', error)
        // Fallback to hardcoded capabilities if API fails
        setCapabilities([
          { by_capability_id: "capa_001", by_capability: "Conversational AI & Advisory" },
          { by_capability_id: "capa_002", by_capability: "Document Processing & Analysis" },
          { by_capability_id: "capa_003", by_capability: "Image Processing" },
          { by_capability_id: "capa_004", by_capability: "Video Processing" },
          { by_capability_id: "capa_005", by_capability: "Voice & Meetings" },
          { by_capability_id: "capa_006", by_capability: "Data Analysis & Insights" },
          { by_capability_id: "capa_007", by_capability: "Content Generation" },
          { by_capability_id: "capa_008", by_capability: "Process Automation" },
          { by_capability_id: "capa_009", by_capability: "Predictive Analytics" },
          { by_capability_id: "capa_010", by_capability: "Machine Learning" },
        ])
      } finally {
        setIsLoadingCapabilities(false)
      }
    }

    if (isOpen) {
      fetchCapabilities()
    }
  }, [isOpen])

  // Add smooth step transitions
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [currentStep])

  const [formData, setFormData] = useState<AgentFormData>({
    // Tab 1: Agent Details
    agentName: "",
    agentDescription: "",
    agentType: "",
    tags: [],
    bundledAgents: [],
    targetPersonas: [],
    keyFeatures: "",
    valueProposition: "",
    roiInformation: "",
    demoLink: "",

    // Tab 2: Capabilities
    coreCapabilities: [], // Store capability IDs
    coreCapabilityMap: {}, // Map capability ID to name

    // Tab 3: Demo Assets
    demoLinks: [],
    bulkFiles: [],

    // Tab 4: Documentation
    sdkDetails: "",
    apiDocumentation: "",
    sampleInput: "",
    sampleOutput: "",
    securityDetails: "",
    readmeFile: null,
    additionalRelatedFiles: [],
    deploymentOptions: [],
  })

  // Merge agent personas with filter personas in edit mode to ensure all unique values are available
  useEffect(() => {
    if (isEditMode && isOpen && formData.targetPersonas.length > 0 && onboardingFilters.target_personas.length > 0) {
      // Merge personas from filters with agent personas to ensure all unique values are available
      const agentPersonas = formData.targetPersonas
      const filterPersonas = onboardingFilters.target_personas || []
      const allUniquePersonas = [...new Set([...filterPersonas, ...agentPersonas])]

      // Update onboarding filters to include merged unique values
      if (allUniquePersonas.length > filterPersonas.length) {
        setOnboardingFilters(prev => ({
          ...prev,
          target_personas: allUniquePersonas,
        }))
      }
    }
  }, [isEditMode, isOpen, formData.targetPersonas, onboardingFilters.target_personas])

  // Sync agent capabilities with capabilities list once both are loaded
  useEffect(() => {
    if (isEditMode && capabilities.length > 0 && agentCapabilitiesFromAPI.length > 0) {
      const capabilityIds: string[] = []
      const capabilityMap: Record<string, string> = {}

      agentCapabilitiesFromAPI.forEach((cap: any) => {
        const capabilityName = cap.by_capability || cap.capability_name
        if (capabilityName) {
          // Find matching capability from the loaded capabilities list by name
          const matchingCapability = capabilities.find(
            (c: Capability) => c.by_capability === capabilityName
          )

          if (matchingCapability && matchingCapability.by_capability_id) {
            const id = matchingCapability.by_capability_id
            capabilityIds.push(id)
            capabilityMap[id] = capabilityName
          } else {
            // Fallback: try to use ID from API response if name matching fails
            const id = cap.by_capability_id || cap.capability_id || cap.serial_id
            if (id) {
              capabilityIds.push(id)
              capabilityMap[id] = capabilityName
            }
          }
        }
      })

      // Only update if we have matching capabilities and they're different from current
      if (capabilityIds.length > 0) {
        const currentIds = formData.coreCapabilities.sort().join(',')
        const newIds = capabilityIds.sort().join(',')
        if (currentIds !== newIds) {
          setFormData(prev => ({
            ...prev,
            coreCapabilities: capabilityIds,
            coreCapabilityMap: capabilityMap,
          }))
        }
      }
    }
  }, [capabilities, agentCapabilitiesFromAPI, isEditMode, formData.coreCapabilities])

  // Fetch and populate agent data when in edit mode
  useEffect(() => {
    if (isOpen && isEditMode && agent?.agent_id && !isLoadingAgentData) {
      const fetchAgentDetails = async () => {
        setIsLoadingAgentData(true)
        try {
          const { createApiUrl } = await import('../lib/api/config')
          const apiUrl = createApiUrl(`/api/agents/${agent.agent_id}`)
          const response = await fetch(apiUrl, {
            cache: "no-store"
          })
          if (!response.ok) {
            throw new Error(`Failed to fetch agent details: ${response.statusText}`)
          }
          const data = await response.json()

          if (data?.agent) {
            const agentData = data.agent

            // Parse tags, personas, features
            const tags = agentData.tags ? agentData.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : []
            // Parse personas using semicolon separator
            const personas = agentData.by_persona ? agentData.by_persona.split(";").map((p: string) => p.trim()).filter(Boolean) : []
            // Parse features - preserve semicolon separator from DB (features are stored with semicolons in DB)
            const features = agentData.features ? agentData.features.split(/[;\n]+/).map((f: string) => f.trim()).filter(Boolean) : []

            // Get capabilities - need to map to IDs from the capabilities list
            // Match by capability name since IDs might differ between APIs
            const agentCapabilities = data.capabilities || []

            // Store agent capabilities for later matching when capabilities list is loaded
            setAgentCapabilitiesFromAPI(agentCapabilities)

            // Try to match capabilities now if capabilities list is already loaded
            const capabilityIds: string[] = []
            const capabilityMap: Record<string, string> = {}

            agentCapabilities.forEach((cap: any) => {
              const capabilityName = cap.by_capability || cap.capability_name
              if (capabilityName) {
                // Find matching capability from the loaded capabilities list by name
                const matchingCapability = capabilities.find(
                  (c: Capability) => c.by_capability === capabilityName
                )

                if (matchingCapability && matchingCapability.by_capability_id) {
                  const id = matchingCapability.by_capability_id
                  capabilityIds.push(id)
                  capabilityMap[id] = capabilityName
                } else {
                  // Fallback: try to use ID from API response if name matching fails
                  const id = cap.by_capability_id || cap.capability_id || cap.serial_id
                  if (id) {
                    capabilityIds.push(id)
                    capabilityMap[id] = capabilityName
                  }
                }
              }
            })

            // Parse deployment options
            const deploymentOptions = data.deployments?.map((d: any) => ({
              serviceProvider: d.service_provider || "",
              serviceName: d.service_name || "",
              deploymentType: d.deployment || "",
              cloudRegion: d.cloud_region || "",
              capability: d.by_capability || d.capability_name || "",
              capabilityId: d.capability_id || "",
            })) || []

            // Parse additional related files
            const additionalFiles = data.documentation?.[0]?.related_files || ""
            const additionalFilesArray = additionalFiles ? (typeof additionalFiles === 'string' ? additionalFiles.split(',').map((f: string) => f.trim()).filter(Boolean) : []) : []

            // Store demo assets and preview for display
            // Handle demo_assets from both agent object and top-level response
            const demoAssets = Array.isArray(data.demo_assets)
              ? data.demo_assets
              : (Array.isArray(agentData.demo_assets) ? agentData.demo_assets : [])
            setApiDemoAssets(demoAssets)
            setDemoPreview(agentData.demo_preview || "")

            // Parse demo links from demo_assets array
            const demoLinks = demoAssets?.map((a: any) => a.demo_link || a.demo_asset_link || a.asset_url || "").filter(Boolean) || []

            // Get demo_link with fallback to application_demo_url (backend alias)
            const demoLink = agentData.demo_link || agentData.application_demo_url || data.demo_link || data.application_demo_url || ""

            setFormData(prev => ({
              ...prev,
              agentName: agentData.agent_name || "",
              agentDescription: agentData.description || "",
              agentType: agentData.asset_type || "",
              tags,
              targetPersonas: personas, // Agent's selected personas (preselected)
              keyFeatures: features.join("; "), // Use semicolon separator to match DB format
              valueProposition: agentData.by_value || "",
              roiInformation: agentData.roi || "",
              demoLink: demoLink,
              coreCapabilities: capabilityIds,
              coreCapabilityMap: capabilityMap,
              demoLinks,
              sdkDetails: data.documentation?.[0]?.sdk_details || "",
              apiDocumentation: data.documentation?.[0]?.swagger_details || "",
              sampleInput: data.documentation?.[0]?.sample_input || "",
              sampleOutput: data.documentation?.[0]?.sample_output || "",
              securityDetails: data.documentation?.[0]?.security_details || "",
              additionalRelatedFiles: additionalFilesArray,
              deploymentOptions,
            }))

            // Update selected deployment indices - select all by default in edit mode
            const allIndices = new Set<number>(deploymentOptions.map((_: any, index: number) => index))
            setSelectedDeploymentIndices(allIndices)
          }
        } catch (err: any) {
          console.error('Error fetching agent details:', err)
          setSubmitError(err.message || "Failed to load agent details")
        } finally {
          setIsLoadingAgentData(false)
        }
      }

      fetchAgentDetails()
    } else if (isOpen && !isEditMode) {
      // Reset form when opening in create mode
      setApiDemoAssets([])
      setDemoPreview("")
      setFormData({
        agentName: "",
        agentDescription: "",
        agentType: "",
        tags: [],
        bundledAgents: [],
        targetPersonas: [],
        keyFeatures: "",
        valueProposition: "",
        roiInformation: "",
        demoLink: "",
        coreCapabilities: [],
        coreCapabilityMap: {},
        demoLinks: [],
        bulkFiles: [],
        sdkDetails: "",
        apiDocumentation: "",
        sampleInput: "",
        sampleOutput: "",
        securityDetails: "",
        readmeFile: null,
        additionalRelatedFiles: [],
        deploymentOptions: [],
      })
      setCurrentStep(1)
      setSelectedDeploymentIndices(new Set())
    }
  }, [isOpen, isEditMode, agent?.agent_id])

  const steps = isEditMode
    ? [
      { number: 1, title: "Agent Details", label: "Agent Details" },
      { number: 2, title: "Capabilities", label: "Capabilities" },
      { number: 3, title: "Demo Assets", label: "Demo Assets" },
      { number: 4, title: "Documentation", label: "Documentation" },
    ]
    : [
      { number: 1, title: "Agent Details", label: "Agent Details" },
      { number: 2, title: "Capabilities", label: "Capabilities" },
      { number: 3, title: "Demo Assets", label: "Demo Assets" },
      { number: 4, title: "Documentation", label: "Documentation" },
      { number: 5, title: "Preview & Submit", label: "Preview & Submit" },
    ]

  const handleNext = async () => {
    const maxStep = isEditMode ? 4 : 5
    if (currentStep < maxStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((currentStep + 1) as Step)
      }, 150)
    } else {
      // Submit the form
      await handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((currentStep - 1) as Step)
      }, 150)
    } else {
      // In edit mode, don't allow canceling - just close if not edit mode
      if (!isEditMode) {
        onClose()
      }
    }
  }

  const handleTabClick = (stepNumber: number) => {
    if (stepNumber !== currentStep && stepNumber <= currentStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(stepNumber as Step)
      }, 150)
    }
  }

  // Form validation function
  const validateForm = (): string[] => {
    const errors: string[] = []

    // Required fields validation
    if (!formData.agentName || !formData.agentName.trim()) {
      errors.push("Agent name is required")
    }
    if (!formData.agentDescription || !formData.agentDescription.trim()) {
      errors.push("Agent description is required")
    }
    if (!formData.agentType || !formData.agentType.trim()) {
      errors.push("Agent type is required")
    }
    if (!formData.valueProposition || !formData.valueProposition.trim()) {
      errors.push("Value proposition is required")
    }
    if (!formData.demoLink || !formData.demoLink.trim()) {
      errors.push("Demo link is required")
    }
    if (formData.targetPersonas.length === 0) {
      errors.push("At least one target persona is required")
    }
    if (formData.coreCapabilities.length === 0) {
      errors.push("At least one core capability is required")
    }

    // URL validation
    const urlRegex = /^https?:\/\/.+\..+/
    if (formData.apiDocumentation && !urlRegex.test(formData.apiDocumentation)) {
      errors.push("API documentation must be a valid URL")
    }
    if (formData.demoLink && !urlRegex.test(formData.demoLink)) {
      errors.push("Demo link must be a valid URL")
    }

    return errors
  }

  const handleSubmit = async () => {
    if (!user?.user_id) {
      setSubmitError(isEditMode ? "You must be logged in to edit an agent" : "You must be logged in to onboard an agent")
      return
    }

    // Validate form before submission
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(". "))
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Import agent service
      const { agentService } = await import("../lib/api/agent.service")

      if (isEditMode && agent?.agent_id) {
        // Edit mode: use updateAgent API with FormData
        const formDataObj = new FormData()

        // Add all text fields
        formDataObj.append('agent_name', formData.agentName || '')
        formDataObj.append('asset_type', formData.agentType || '')
        formDataObj.append('description', formData.agentDescription || '')
        const byPersonaValue = formData.targetPersonas.length > 0 ? formData.targetPersonas.join('; ') : ''
        console.log('Edit mode - by_persona value being sent:', byPersonaValue, 'from personas:', formData.targetPersonas)
        formDataObj.append('by_persona', byPersonaValue)

        // Log all FormData entries to verify by_persona is included
        console.log('FormData entries being sent:')
        formDataObj.forEach((value, key) => {
          if (key === 'by_persona') {
            console.log(`  ✅ ${key}:`, value)
          } else {
            console.log(`  ${key}:`, typeof value === 'string' ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : value)
          }
        })
        formDataObj.append('by_value', formData.valueProposition || '')
        formDataObj.append('features', formData.keyFeatures || '')
        formDataObj.append('tags', formData.tags.length > 0 ? formData.tags.join(',') : '')
        formDataObj.append('roi', formData.roiInformation || '')
        formDataObj.append('demo_link', formData.demoLink || '')
        formDataObj.append('demo_assets', formData.demoLinks.length > 0 ? formData.demoLinks.join(',') : '')
        formDataObj.append('capabilities', formData.coreCapabilities.length > 0
          ? formData.coreCapabilities.map(id => formData.coreCapabilityMap?.[id] || id).join(', ')
          : '')
        formDataObj.append('sdk_details', formData.sdkDetails || '')
        formDataObj.append('swagger_details', formData.apiDocumentation || '')
        formDataObj.append('sample_input', formData.sampleInput || '')
        formDataObj.append('sample_output', formData.sampleOutput || '')
        formDataObj.append('security_details', formData.securityDetails || '')
        formDataObj.append('related_files', Array.isArray(formData.additionalRelatedFiles) && formData.additionalRelatedFiles.length > 0
          ? formData.additionalRelatedFiles.join(', ')
          : '')
        formDataObj.append('deployments', (() => {
          const selectedDeployments = formData.deploymentOptions.filter((_, index) => selectedDeploymentIndices.has(index))
          return selectedDeployments.length > 0 ? JSON.stringify(selectedDeployments) : "[]"
        })())
        formDataObj.append('isv_id', agent.isv_id || user.user_id || '')

        // Add file uploads only if they exist
        if (formData.bulkFiles.length > 0) {
          formData.bulkFiles.forEach((fileWithPreview) => {
            formDataObj.append('demo_files', fileWithPreview.file)
          })
        }

        if (formData.readmeFile) {
          formDataObj.append('readme_file', formData.readmeFile)
        }

        try {
          const response = await agentService.updateAgent(agent.agent_id, formDataObj)
          console.log("Agent updated successfully:", response)

          setIsSubmitting(false)
          if (onSave) {
            onSave()
          }
          onClose()
        } catch (apiError: any) {
          console.error("API Error details:", {
            message: apiError.message,
            status: apiError.status,
            code: apiError.code,
            fullError: apiError
          })

          let errorMessage = "An unexpected error occurred while updating the agent"
          if (apiError.message) {
            errorMessage = apiError.message
          } else if (apiError.status === 500) {
            errorMessage = "Server error occurred. Please try again later."
          } else if (apiError.status === 422) {
            errorMessage = "Invalid data provided. Please check all required fields and try again."
          } else if (apiError.status === 401) {
            errorMessage = "Authentication failed. Please log in again."
          } else if (apiError.status === 400) {
            errorMessage = "Bad request. Please check all fields and try again."
          }

          setSubmitError(errorMessage)
          setIsSubmitting(false)
        }
      } else {
        // Create mode: use onboardAgent API
        const apiData: any = {
          agent_name: formData.agentName || "",
          asset_type: formData.agentType || "",
          description: formData.agentDescription || "",
          by_value: formData.valueProposition || "",
          tags: formData.tags.length > 0 ? formData.tags.join(", ") : "",
          by_persona: (() => {
            const byPersonaValue = formData.targetPersonas.length > 0 ? formData.targetPersonas.join("; ") : ""
            console.log('Create mode - by_persona value being sent:', byPersonaValue, 'from personas:', formData.targetPersonas)
            return byPersonaValue
          })(),
          features: formData.keyFeatures || "",
          roi: formData.roiInformation || "",
          demo_link: formData.demoLink || "",
          capabilities: formData.coreCapabilities.length > 0
            ? formData.coreCapabilities.map(id => formData.coreCapabilityMap?.[id] || id).join(", ")
            : "",
          capability_ids: formData.coreCapabilities.length > 0 ? formData.coreCapabilities.join(", ") : "",
          demo_assets: formData.demoLinks.length > 0 ? formData.demoLinks.join(", ") : "",
          sdk_details: formData.sdkDetails || "",
          swagger_details: formData.apiDocumentation || "",
          sample_input: formData.sampleInput || "",
          sample_output: formData.sampleOutput || "",
          security_details: formData.securityDetails || "",
          related_files: Array.isArray(formData.additionalRelatedFiles) && formData.additionalRelatedFiles.length > 0
            ? formData.additionalRelatedFiles.join(", ")
            : "",
          deployments: (() => {
            const selectedDeployments = formData.deploymentOptions.filter((_, index) => selectedDeploymentIndices.has(index))
            return selectedDeployments.length > 0 ? JSON.stringify(selectedDeployments) : "[]"
          })(),
          isv_id: user.user_id || "",
        }

        // Add file uploads only if they exist
        if (formData.bulkFiles.length > 0) {
          apiData.demo_files = formData.bulkFiles.map(f => f.file)
        }

        if (formData.readmeFile) {
          apiData.readme_file = formData.readmeFile
        }

        console.log("Submitting agent with data:", {
          ...apiData,
          demo_files: apiData.demo_files ? `${apiData.demo_files.length} files` : "none",
          readme_file: apiData.readme_file ? "present" : "none",
        })

        try {
          const response = await agentService.onboardAgent(apiData)
          console.log("Agent onboarded successfully:", response)

          // Stop loading first, then close modal and show success modal
          setIsSubmitting(false)
          onClose()
          // Small delay to ensure smooth transition
          setTimeout(() => {
            setIsSuccessModalOpen(true)
          }, 300)
        } catch (apiError: any) {
          console.error("API Error details:", {
            message: apiError.message,
            status: apiError.status,
            code: apiError.code,
            fullError: apiError
          })

          // Extract error message from backend response
          let errorMessage = "An unexpected error occurred while submitting the agent"

          // Try to get detailed error from response
          if (apiError.detail) {
            errorMessage = apiError.detail
          } else if (apiError.message) {
            errorMessage = apiError.message
          } else if (apiError.status === 500) {
            errorMessage = "Server error occurred. The backend returned: " + (apiError.detail || apiError.message || "Unknown error. Please check the server logs.")
          } else if (apiError.status === 422) {
            errorMessage = "Invalid data provided. Please check all required fields and try again."
          } else if (apiError.status === 401) {
            errorMessage = "Authentication failed. Please log in again."
          } else if (apiError.status === 400) {
            errorMessage = "Bad request. Please check all fields and try again."
          }

          setSubmitError(errorMessage)
          setIsSubmitting(false)
        }
      }
    } catch (error: any) {
      console.error("Error submitting agent:", error)
      setSubmitError(error.message || "An unexpected error occurred while submitting the agent")
      setIsSubmitting(false)
    }
  }


  // File handling functions
  const handleFileUpload = (file: File, type: 'readme') => {
    setFormData(prev => ({ ...prev, readmeFile: file }))
  }

  const handleBulkFileUpload = async (files: FileList) => {
    const processFile = async (file: File): Promise<FileWithPreview> => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')

      if (isImage) {
        // Images get direct preview URL
        return {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: URL.createObjectURL(file)
        }
      } else if (isVideo) {
        // Generate thumbnail for videos
        try {
          const video = document.createElement('video')
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const videoUrl = URL.createObjectURL(file)

          return new Promise((resolve) => {
            video.preload = 'metadata'
            video.muted = true
            video.playsInline = true

            video.onloadedmetadata = () => {
              // Seek to a small time to get a frame
              video.currentTime = 0.1
            }

            video.onseeked = () => {
              if (ctx && video.videoWidth > 0 && video.videoHeight > 0) {
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

                // Convert canvas to blob URL
                canvas.toBlob((blob) => {
                  if (blob) {
                    const thumbnailUrl = URL.createObjectURL(blob)
                    resolve({
                      file,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      previewUrl: thumbnailUrl,
                      videoUrl: videoUrl // Store original video URL for playback
                    })
                  } else {
                    // Fallback if thumbnail generation fails
                    resolve({
                      file,
                      name: file.name,
                      size: file.size,
                      type: file.type,
                      previewUrl: undefined,
                      videoUrl: videoUrl
                    })
                  }
                }, 'image/jpeg', 0.8)
              } else {
                resolve({
                  file,
                  name: file.name,
                  size: file.size,
                  type: file.type,
                  previewUrl: undefined,
                  videoUrl: videoUrl
                })
              }
            }

            video.onerror = () => {
              resolve({
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl: undefined,
                videoUrl: videoUrl
              })
            }

            video.src = videoUrl
            video.load()
          })
        } catch (error) {
          console.error('Error generating video thumbnail:', error)
          const videoUrl = URL.createObjectURL(file)
          return {
            file,
            name: file.name,
            size: file.size,
            type: file.type,
            previewUrl: undefined,
            videoUrl: videoUrl
          }
        }
      } else {
        // Other file types (PDF, DOC, etc.) - no preview
        return {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl: undefined
        }
      }
    }

    // Process all files asynchronously
    const newFiles = await Promise.all(Array.from(files).map(processFile))

    setFormData(prev => ({
      ...prev,
      bulkFiles: [...prev.bulkFiles, ...newFiles]
    }))
  }

  const removeBulkFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.bulkFiles]
      const removedFile = newFiles[index]
      // Clean up blob URLs
      if (removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl)
      }
      if (removedFile.videoUrl) {
        URL.revokeObjectURL(removedFile.videoUrl)
      }
      newFiles.splice(index, 1)
      return { ...prev, bulkFiles: newFiles }
    })
  }

  const addDemoLink = () => {
    if (newDemoLink.trim()) {
      setFormData(prev => ({ ...prev, demoLinks: [...prev.demoLinks, newDemoLink.trim()] }))
      setNewDemoLink("")
    }
  }

  const updateDemoLink = (index: number, value: string) => {
    const oldValue = formData.demoLinks[index]
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.map((link, i) => i === index ? value : link)
    }))

    // In edit mode, if URL is cleared or changed, update preview and assets
    if (isEditMode && (!value.trim() || oldValue !== value)) {
      // If URL is cleared, remove corresponding asset and preview
      if (!value.trim() && oldValue) {
        // Find and remove the asset that matches the old URL
        setApiDemoAssets(prev => prev.filter((asset) => {
          const assetUrl = asset.demo_link || asset.demo_asset_link || asset.asset_url || ""
          return assetUrl !== oldValue
        }))

        // Update demoPreview - remove the URL (comma-separated)
        setDemoPreview(prev => {
          if (!prev) return ""
          const urls = prev.split(',').map(u => u.trim()).filter(Boolean)
          const filteredUrls = urls.filter(url => url !== oldValue)
          return filteredUrls.join(',')
        })
      }
    }
  }

  const removeDemoLink = (index: number) => {
    const removedUrl = formData.demoLinks[index]
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.filter((_, i) => i !== index)
    }))

    // In edit mode, also update preview and assets when removing a link
    if (isEditMode && removedUrl) {
      // Find and remove the asset that matches the removed URL
      setApiDemoAssets(prev => prev.filter((asset) => {
        const assetUrl = asset.demo_link || asset.demo_asset_link || asset.asset_url || ""
        return assetUrl !== removedUrl
      }))

      // Update demoPreview - remove the URL (comma-separated)
      setDemoPreview(prev => {
        if (!prev) return ""
        const urls = prev.split(',').map(u => u.trim()).filter(Boolean)
        const filteredUrls = urls.filter(url => url !== removedUrl)
        return filteredUrls.join(',')
      })
    }
  }

  const addAdditionalLink = () => {
    if (newAdditionalLink.trim()) {
      setFormData(prev => ({ ...prev, additionalRelatedFiles: [...prev.additionalRelatedFiles, newAdditionalLink.trim()] }))
      setNewAdditionalLink("")
    }
  }

  const updateAdditionalLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalRelatedFiles: prev.additionalRelatedFiles.map((link, i) => i === index ? value : link)
    }))
  }

  const removeAdditionalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalRelatedFiles: prev.additionalRelatedFiles.filter((_, i) => i !== index)
    }))
  }

  const addDeploymentOption = () => {
    const newIndex = formData.deploymentOptions.length
    setFormData(prev => ({
      ...prev,
      deploymentOptions: [...prev.deploymentOptions, {
        serviceProvider: "",
        serviceName: "",
        deploymentType: "",
        cloudRegion: "",
        capability: "",
        isManual: true // Mark as manual option
      }]
    }))
    // Auto-select the new manual option so it's clear to the user
    setSelectedDeploymentIndices(prev => new Set(prev).add(newIndex))
    // Start in edit mode for new manual options
    setEditingManualOptions(prev => new Set(prev).add(newIndex))
  }

  const updateDeploymentOption = (index: number, field: keyof DeploymentOption, value: string) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.map((option, i) =>
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const removeDeploymentOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.filter((_, i) => i !== index)
    }))
  }

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <>
      {/* Loading Overlay - Shows while submitting */}
      {isSubmitting && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8"
            style={{
              minWidth: "400px",
              maxWidth: "500px",
              margin: "auto",
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "150%",
                  color: "#111827",
                  textAlign: "center",
                }}
              >
                Uploading your agent...
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "150%",
                  color: "#6B7280",
                  textAlign: "center",
                }}
              >
                Please wait while we process your submission.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 overflow-y-auto scrollbar-hide"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0)",
            backdropFilter: "blur(0px)",
            animation: "fadeIn 0.3s ease-out forwards",
          }}
        >
          <style dangerouslySetInnerHTML={{
            __html: `
        @keyframes fadeIn {
          from {
            background-color: rgba(0, 0, 0, 0);
            backdrop-filter: blur(0px);
          }
          to {
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes stepFadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes buttonSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col my-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
              animation: "modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
          >
            {/* Header with gradient background */}
            <div
              className="px-6 py-5 flex items-start justify-between relative"
              style={{
                background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex flex-col gap-2">
                <h1
                  className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "28px",
                    lineHeight: "130%",
                    letterSpacing: "-0.5px",
                    margin: 0,
                  }}
                >
                  {isEditMode ? "Edit Agent" : "Onboard a new agent"}
                </h1>
                <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  {isLoadingAgentData ? "Loading agent details..." : `Step ${currentStep} of ${steps.length} • ${Math.round(progressPercentage)}% complete`}
                </p>
              </div>
              <button
                onClick={onClose}
                className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200 group"
                style={{
                  border: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F3F4F6"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.borderColor = "transparent"
                }}
              >
                <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
              </button>
            </div>

            {/* Enhanced Progress Steps with animated progress bar */}
            <div
              className="relative px-6"
              style={{
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
              }}
            >
              {/* Animated progress bar */}
              <div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                style={{
                  width: `${progressPercentage}%`,
                  boxShadow: "0 0 8px rgba(0, 75, 236, 0.4)",
                }}
              />

              <div className="flex items-center justify-between w-full py-4">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.number
                  const isCompleted = currentStep > step.number

                  return (
                    <div
                      key={step.number}
                      className="flex items-center flex-1 group"
                      style={{
                        position: "relative",
                      }}
                    >
                      {index > 0 && (
                        <div
                          className="mr-3 transition-all duration-300"
                          style={{
                            width: "32px",
                            height: "2px",
                            backgroundColor: isCompleted ? "#004BEC" : "#E5E7EB",
                            borderRadius: "2px",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        />
                      )}
                      <button
                        onClick={() => handleTabClick(step.number)}
                        className="flex items-center gap-3 transition-all duration-200"
                        style={{
                          minWidth: "fit-content",
                        }}
                      >
                        {/* Step indicator circle */}
                        <div
                          className="flex items-center justify-center rounded-full transition-all duration-300"
                          style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: isActive
                              ? "#004BEC"
                              : isCompleted
                                ? "#10B981"
                                : "#F3F4F6",
                            border: isActive ? "2px solid #004BEC" : "2px solid transparent",
                            boxShadow: isActive
                              ? "0 0 0 4px rgba(0, 75, 236, 0.1)"
                              : "none",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          {isCompleted ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : (
                            <span
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 600,
                                fontSize: "13px",
                                color: isActive ? "#FFFFFF" : "#6B7280",
                              }}
                            >
                              {step.number}
                            </span>
                          )}
                        </div>

                        <div className="hidden md:block">
                          <div
                            className="transition-all duration-200"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: isActive ? 600 : 400,
                              fontSize: "13px",
                              lineHeight: "150%",
                              color: isActive
                                ? "#004BEC"
                                : isCompleted
                                  ? "#10B981"
                                  : "#6B7280",
                              textAlign: "left",
                              transition: "all 0.2s",
                            }}
                          >
                            Step {step.number}
                          </div>
                          <div
                            className="transition-all duration-200"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: isActive ? 600 : 500,
                              fontSize: "14px",
                              lineHeight: "150%",
                              color: isActive
                                ? "#004BEC"
                                : isCompleted
                                  ? "#059669"
                                  : "#9CA3AF",
                              whiteSpace: "nowrap",
                              textAlign: "left",
                              marginTop: "2px",
                            }}
                          >
                            {step.label}
                          </div>
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content - Scrollable with smooth transitions */}
            <div
              className="flex-1 overflow-y-auto relative scrollbar-hide px-6 pt-6 pb-6"
              style={{
                backgroundColor: "#FFFFFF",
                scrollbarWidth: "none", /* Firefox */
                msOverflowStyle: "none", /* IE and Edge */
              }}
            >
              <div className="mx-auto max-w-none">
                {/* Step transition animation wrapper */}
                <div
                  key={currentStep}
                  style={{
                    animation: "stepFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
                  }}
                >
                  {/* Tab 1: Agent Details */}
                  {isLoadingAgentData ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading agent details...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {currentStep === 1 && (
                        <div>
                          <div className="space-y-6">
                            {/* 1. Agent Name */}
                            <div>
                              <Label
                                htmlFor="agentName"
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
                                Agent Name <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <Input
                                id="agentName"
                                placeholder="Enter your product name."
                                value={formData.agentName}
                                onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                                className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                style={{
                                  width: "100%",
                                  maxWidth: "940px",
                                  height: "48px",
                                  minWidth: "240px",
                                  borderRadius: "8px",
                                  paddingTop: "12px",
                                  paddingRight: "16px",
                                  paddingBottom: "12px",
                                  paddingLeft: "16px",
                                  border: "1.5px solid #E5E7EB",
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 400,
                                  fontSize: "14px",
                                  lineHeight: "150%",
                                  color: "#111827",
                                  backgroundColor: "#FFFFFF",
                                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                                onFocus={(e) => {
                                  e.currentTarget.style.borderColor = "#004BEC"
                                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 75, 236, 0.1)"
                                }}
                                onBlur={(e) => {
                                  e.currentTarget.style.borderColor = "#E5E7EB"
                                  e.currentTarget.style.boxShadow = "none"
                                }}
                              />
                            </div>

                            {/* 2. Agent Description */}
                            <div>
                              <Label
                                htmlFor="agentDescription"
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
                                Agent Description <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <Textarea
                                id="agentDescription"
                                placeholder="Add description about your agent."
                                value={formData.agentDescription}
                                onChange={(e) => setFormData({ ...formData, agentDescription: e.target.value })}
                                className="mt-2 min-h-[120px]"
                                style={{
                                  width: "100%",
                                  maxWidth: "940px",
                                  minWidth: "240px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
                                  paddingBottom: "11px",
                                  paddingLeft: "16px",
                                  border: "1px solid #E5E7EB",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 400,
                                  fontStyle: "normal",
                                  fontSize: "14px",
                                  lineHeight: "150%",
                                  letterSpacing: "0%",
                                  verticalAlign: "middle",
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            {/* 3. Key Features */}
                            <div>
                              <Label
                                htmlFor="keyFeatures"
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
                                Key Features <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <Input
                                id="keyFeatures"
                                placeholder="Add agent key features. Add multiple using [;] separated"
                                value={formData.keyFeatures}
                                onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "940px",
                                  minWidth: "240px",
                                  height: "44px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            {/* 4. ROI Information */}
                            <div>
                              <Label
                                htmlFor="roiInformation"
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
                                ROI Information <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <Textarea
                                id="roiInformation"
                                placeholder="Add ROI of your agent. Add multiple ROI using [;] separated"
                                value={formData.roiInformation}
                                onChange={(e) => setFormData({ ...formData, roiInformation: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "940px",
                                  height: "97px",
                                  minWidth: "240px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            {/* 5, 6. Agent Type and Value Proposition - Side by Side */}
                            <div className="flex flex-col md:flex-row" style={{ gap: "40px" }}>
                              <div>
                                <DropdownWithCustom
                                  label="Agent Type"
                                  value={formData.agentType}
                                  onChange={(value) => {
                                    setFormData({ ...formData, agentType: value })
                                    // Check if it's a custom value (not in options)
                                    if (value && !onboardingFilters.agent_types.includes(value)) {
                                      saveCustomValueToAPI('agent_type', value)
                                    }
                                  }}
                                  options={onboardingFilters.agent_types}
                                  placeholder="Select agent asset type"
                                  required
                                />
                              </div>

                              <div>
                                <DropdownWithCustom
                                  label="Value Proposition"
                                  value={formData.valueProposition}
                                  onChange={(value) => {
                                    setFormData({ ...formData, valueProposition: value })
                                    // Check if it's a custom value (not in options)
                                    if (value && !onboardingFilters.value_propositions.includes(value)) {
                                      saveCustomValueToAPI('value_proposition', value)
                                    }
                                  }}
                                  options={onboardingFilters.value_propositions}
                                  placeholder="Select agent asset type"
                                  required
                                />
                              </div>
                            </div>

                            {/* 7. Tags and Bundled Agent - Side by Side */}
                            <div className="flex flex-col md:flex-row" style={{ gap: "40px" }}>
                              <div>
                                <MultiSelectInput
                                  label="Tags"
                                  value={formData.tags}
                                  onChange={(value) => {
                                    const previousTags = formData.tags
                                    setFormData({ ...formData, tags: value })
                                    // Check if any newly added tags are custom (not in options)
                                    const newTags = value.filter(tag => !previousTags.includes(tag))
                                    const customNewTags = newTags.filter(tag => !onboardingFilters.tags.includes(tag))
                                    if (customNewTags.length > 0) {
                                      // Send all tags (including the new custom ones)
                                      saveCustomValueToAPI('tags', value)
                                    }
                                  }}
                                  options={onboardingFilters.tags}
                                  placeholder="Select agent asset type"
                                  required
                                />
                              </div>

                              <div>
                                <MultiSelectInput
                                  label="Bundled agent"
                                  value={formData.bundledAgents}
                                  onChange={(value) => setFormData({ ...formData, bundledAgents: value })}
                                  options={bundledAgentOptions}
                                  placeholder="Select one or more micro agents used in building"
                                  required
                                />
                              </div>
                            </div>

                            {/* 8. Target Personas */}
                            <div className="space-y-2">
                              <Label
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
                                Target Personas <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {onboardingFilters.target_personas.map((persona) => {
                                  const isSelected = formData.targetPersonas.includes(persona)
                                  const IconComponent = personaIconMap[persona] || Users
                                  return (
                                    <button
                                      key={persona}
                                      type="button"
                                      onClick={() => {
                                        if (isSelected) {
                                          setFormData({
                                            ...formData,
                                            targetPersonas: formData.targetPersonas.filter(p => p !== persona)
                                          })
                                        } else {
                                          setFormData({
                                            ...formData,
                                            targetPersonas: [...formData.targetPersonas, persona]
                                          })
                                        }
                                      }}
                                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 500,
                                        fontSize: "14px",
                                        lineHeight: "150%",
                                        border: isSelected ? "2px solid #004BEC" : "1.5px solid #E5E7EB",
                                        backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                                        color: isSelected ? "#004BEC" : "#6B7280",
                                        cursor: "pointer",
                                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: isSelected ? "0 2px 8px rgba(0, 75, 236, 0.15)" : "none",
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.borderColor = "#004BEC"
                                          e.currentTarget.style.backgroundColor = "#F0F5FF"
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected) {
                                          e.currentTarget.style.borderColor = "#E5E7EB"
                                          e.currentTarget.style.backgroundColor = "#FFFFFF"
                                        }
                                      }}
                                    >
                                      <IconComponent className="h-4 w-4 shrink-0" />
                                      <span>{persona}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            </div>

                            {/* 9. Agent Demo link */}
                            <div>
                              <Label
                                htmlFor="demoLink"
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
                                Agent Demo link <span style={{ color: "#111827" }}>*</span>
                              </Label>
                              <Input
                                id="demoLink"
                                placeholder="Enter your demo link."
                                value={formData.demoLink}
                                onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "863px",
                                  minWidth: "240px",
                                  height: "44px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 2: Capabilities */}
                      {currentStep === 2 && (
                        <div>
                          <div className="space-y-6">
                            {/* Core Capabilities */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label
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
                                  Core Capabilities
                                </Label>
                                {isLoadingCapabilities && (
                                  <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Loading capabilities...
                                  </span>
                                )}
                              </div>
                              {isLoadingCapabilities ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {capabilities.map((capability) => {
                                    const isSelected = formData.coreCapabilities.includes(capability.by_capability_id)
                                    const IconComponent = capabilityIconMap[capability.by_capability] || BarChart3
                                    return (
                                      <button
                                        key={capability.by_capability_id}
                                        type="button"
                                        onClick={async () => {
                                          if (isSelected) {
                                            // Remove capability
                                            const newCapabilities = formData.coreCapabilities.filter(
                                              id => id !== capability.by_capability_id
                                            )
                                            const newMap = { ...formData.coreCapabilityMap }
                                            delete newMap[capability.by_capability_id]

                                            // Remove deployment options for this capability
                                            const newDeploymentOptions = formData.deploymentOptions.filter(
                                              opt => opt.capabilityId !== capability.by_capability_id
                                            )

                                            setFormData({
                                              ...formData,
                                              coreCapabilities: newCapabilities,
                                              coreCapabilityMap: newMap,
                                              deploymentOptions: newDeploymentOptions,
                                            })

                                            // Remove deployment data
                                            const newDeploymentData = { ...deploymentData }
                                            delete newDeploymentData[capability.by_capability_id]
                                            setDeploymentData(newDeploymentData)
                                          } else {
                                            // Add capability
                                            setFormData({
                                              ...formData,
                                              coreCapabilities: [...formData.coreCapabilities, capability.by_capability_id],
                                              coreCapabilityMap: {
                                                ...formData.coreCapabilityMap,
                                                [capability.by_capability_id]: capability.by_capability,
                                              },
                                            })

                                            // Fetch deployments for this capability
                                            await fetchDeploymentsForCapability(capability.by_capability_id, capability.by_capability)
                                          }
                                        }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                                        style={{
                                          fontFamily: "Inter, sans-serif",
                                          fontWeight: 500,
                                          fontSize: "14px",
                                          lineHeight: "150%",
                                          border: isSelected ? "2px solid #004BEC" : "1.5px solid #E5E7EB",
                                          backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                                          color: isSelected ? "#004BEC" : "#6B7280",
                                          cursor: "pointer",
                                          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                          boxShadow: isSelected ? "0 2px 8px rgba(0, 75, 236, 0.15)" : "none",
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.borderColor = "#004BEC"
                                            e.currentTarget.style.backgroundColor = "#F0F5FF"
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected) {
                                            e.currentTarget.style.borderColor = "#E5E7EB"
                                            e.currentTarget.style.backgroundColor = "#FFFFFF"
                                          }
                                        }}
                                      >
                                        <IconComponent className="h-4 w-4 shrink-0" />
                                        <span>{capability.by_capability}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                              {capabilities.length === 0 && !isLoadingCapabilities && (
                                <p className="text-sm text-gray-500 py-4" style={{ fontFamily: "Inter, sans-serif" }}>
                                  No capabilities available. Please try again later.
                                </p>
                              )}
                            </div>

                            {/* Deployment Options */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <Label
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 600,
                                      fontStyle: "normal",
                                      fontSize: "16px",
                                      lineHeight: "150%",
                                      letterSpacing: "0%",
                                      color: "#111827",
                                    }}
                                  >
                                    Deployment Options
                                  </Label>
                                  <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                                    Automatically populated based on selected capabilities
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={addDeploymentOption}
                                  className="text-green-600 border-green-600 hover:bg-green-50 transition-all duration-200"
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                  }}
                                >
                                  + Add Manual Option
                                </Button>
                              </div>

                              {/* Loading states for capabilities */}
                              {formData.coreCapabilities.some(id => loadingDeployments[id]) && (
                                <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                  <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                    <span className="text-sm text-blue-700" style={{ fontFamily: "Inter, sans-serif" }}>
                                      Loading deployment options...
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Group deployments by capability */}
                              {(() => {
                                const groupedByCapability = formData.deploymentOptions.reduce((acc, option, index) => {
                                  // Check if it's a manual option (marked as manual)
                                  const isManual = option.isManual === true
                                  const key = isManual ? 'manual' : (option.capabilityId || option.capability || 'other')
                                  if (!acc[key]) {
                                    acc[key] = {
                                      capabilityName: isManual ? 'Manual Options' : (option.capability || 'Other'),
                                      capabilityId: option.capabilityId,
                                      options: [],
                                    }
                                  }
                                  acc[key].options.push({ option, index })
                                  return acc
                                }, {} as Record<string, { capabilityName: string; capabilityId?: string; options: Array<{ option: DeploymentOption; index: number }> }>)

                                // Sort groups to ensure "Manual Options" always appears first
                                const groups = Object.entries(groupedByCapability).sort(([keyA], [keyB]) => {
                                  if (keyA === 'manual') return -1
                                  if (keyB === 'manual') return 1
                                  return 0
                                })

                                if (groups.length === 0) {
                                  return (
                                    <div className="text-center py-8 text-gray-500 rounded-lg border-2 border-dashed border-gray-200">
                                      <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                                        No deployment options yet. Select capabilities above to auto-populate options.
                                      </p>
                                    </div>
                                  )
                                }

                                return (
                                  <div className="space-y-4">
                                    {groups.map(([key, group]) => (
                                      <div
                                        key={key}
                                        className="rounded-lg border border-gray-200 bg-white"
                                        style={{ overflow: 'visible' }}
                                      >
                                        {/* Capability Header */}
                                        <div
                                          className="px-4 py-3"
                                          style={{
                                            background: "linear-gradient(135deg, #F0F5FF 0%, #E6EDFD 100%)",
                                            borderBottom: "1px solid #E5E7EB",
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                            <h4
                                              className="font-semibold"
                                              style={{
                                                fontFamily: "Poppins, sans-serif",
                                                fontSize: "15px",
                                                color: "#111827",
                                              }}
                                            >
                                              {group.capabilityName}
                                            </h4>
                                            <span
                                              className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                                              style={{ fontFamily: "Inter, sans-serif" }}
                                            >
                                              {group.options.length} {group.options.length === 1 ? 'option' : 'options'}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Deployment Options List with Checkboxes */}
                                        <div className="divide-y divide-gray-200">
                                          {group.options.map(({ option, index }) => {
                                            const isSelected = selectedDeploymentIndices.has(index)
                                            const isManual = option.isManual === true

                                            return (
                                              <div
                                                key={index}
                                                className={`px-4 py-3 ${isManual ? 'bg-blue-50/30 border-l-4 border-blue-500' : 'hover:bg-gray-50'} transition-colors`}
                                                style={isManual ? {
                                                  backgroundColor: '#F8FAFF',
                                                  borderLeft: '4px solid #004BEC',
                                                } : {}}
                                              >
                                                <div className="flex items-start gap-3">
                                                  <div
                                                    className="flex-shrink-0"
                                                    onClick={(e: React.MouseEvent) => {
                                                      // Only stop propagation, don't prevent default
                                                      e.stopPropagation()
                                                    }}
                                                  >
                                                    <Checkbox
                                                      checked={isSelected}
                                                      onCheckedChange={(checked: boolean) => {
                                                        toggleDeploymentSelection(index)
                                                      }}
                                                      className="mt-1 cursor-pointer"
                                                    />
                                                  </div>
                                                  {isManual ? (
                                                    // Check if manual option is complete (has all required fields)
                                                    (() => {
                                                      const isComplete = option.serviceProvider && option.serviceName && option.deploymentType
                                                      const isEditing = editingManualOptions.has(index)

                                                      if (isComplete && !isEditing) {
                                                        // Display in read-only format like API-fetched options
                                                        return (
                                                          <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                              <div
                                                                className="px-2 py-1 rounded text-xs font-medium"
                                                                style={{
                                                                  backgroundColor: option.serviceProvider === "AWS" ? "#FF9900" :
                                                                    option.serviceProvider === "Azure" ? "#0078D4" :
                                                                      option.serviceProvider === "GCP" ? "#4285F4" :
                                                                        option.serviceProvider === "Open-Source" ? "#28A745" :
                                                                          "#6B7280",
                                                                  color: "#FFFFFF",
                                                                }}
                                                              >
                                                                {option.serviceProvider}
                                                              </div>
                                                              <span
                                                                className="font-medium text-sm"
                                                                style={{
                                                                  color: "#111827",
                                                                }}
                                                              >
                                                                {option.serviceName}
                                                              </span>
                                                              <span
                                                                className="text-xs font-medium px-2 py-1 rounded ml-auto"
                                                                style={{
                                                                  color: '#004BEC',
                                                                  backgroundColor: '#E6EDFD',
                                                                  fontFamily: "Inter, sans-serif",
                                                                }}
                                                              >
                                                                Manual
                                                              </span>
                                                              <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e: React.MouseEvent) => {
                                                                  e.stopPropagation()
                                                                  setEditingManualOptions(prev => new Set(prev).add(index))
                                                                }}
                                                                className="h-6 w-6 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                                              >
                                                                <Edit className="h-3 w-3" />
                                                              </Button>
                                                              <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={(e: React.MouseEvent) => {
                                                                  e.stopPropagation()
                                                                  removeDeploymentOption(index)
                                                                  setSelectedDeploymentIndices(prev => {
                                                                    const newSet = new Set(prev)
                                                                    newSet.delete(index)
                                                                    const adjusted = new Set<number>()
                                                                    newSet.forEach(i => {
                                                                      if (i > index) {
                                                                        adjusted.add(i - 1)
                                                                      } else if (i < index) {
                                                                        adjusted.add(i)
                                                                      }
                                                                    })
                                                                    return adjusted
                                                                  })
                                                                  setEditingManualOptions(prev => {
                                                                    const newSet = new Set(prev)
                                                                    newSet.delete(index)
                                                                    const adjusted = new Set<number>()
                                                                    newSet.forEach(i => {
                                                                      if (i > index) {
                                                                        adjusted.add(i - 1)
                                                                      } else if (i < index) {
                                                                        adjusted.add(i)
                                                                      }
                                                                    })
                                                                    return adjusted
                                                                  })
                                                                }}
                                                                className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                              >
                                                                <X className="h-3 w-3" />
                                                              </Button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                              <span>
                                                                <strong>Deployment:</strong> {option.deploymentType}
                                                              </span>
                                                              {option.cloudRegion && (
                                                                <>
                                                                  <span>•</span>
                                                                  <span>
                                                                    <strong>Region:</strong> {option.cloudRegion}
                                                                  </span>
                                                                </>
                                                              )}
                                                            </div>
                                                          </div>
                                                        )
                                                      }

                                                      // Show editable form
                                                      return (
                                                        <div className="flex-1 space-y-3">
                                                          <div className="flex items-center gap-2 mb-2">
                                                            <span
                                                              className="text-xs font-medium px-2 py-1 rounded"
                                                              style={{
                                                                color: '#004BEC',
                                                                backgroundColor: '#E6EDFD',
                                                                fontFamily: "Inter, sans-serif",
                                                              }}
                                                            >
                                                              Manual Entry
                                                            </span>
                                                            <Button
                                                              type="button"
                                                              variant="ghost"
                                                              size="icon"
                                                              onClick={(e: React.MouseEvent) => {
                                                                e.stopPropagation()
                                                                removeDeploymentOption(index)
                                                                setSelectedDeploymentIndices(prev => {
                                                                  const newSet = new Set(prev)
                                                                  newSet.delete(index)
                                                                  // Adjust indices after removal
                                                                  const adjusted = new Set<number>()
                                                                  newSet.forEach(i => {
                                                                    if (i > index) {
                                                                      adjusted.add(i - 1)
                                                                    } else if (i < index) {
                                                                      adjusted.add(i)
                                                                    }
                                                                  })
                                                                  return adjusted
                                                                })
                                                                setEditingManualOptions(prev => {
                                                                  const newSet = new Set(prev)
                                                                  newSet.delete(index)
                                                                  const adjusted = new Set<number>()
                                                                  newSet.forEach(i => {
                                                                    if (i > index) {
                                                                      adjusted.add(i - 1)
                                                                    } else if (i < index) {
                                                                      adjusted.add(i)
                                                                    }
                                                                  })
                                                                  return adjusted
                                                                })
                                                              }}
                                                              className="h-6 w-6 text-red-600 hover:text-red-800 hover:bg-red-50 ml-auto"
                                                            >
                                                              <X className="h-3 w-3" />
                                                            </Button>
                                                          </div>
                                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="space-y-2">
                                                              <div className="flex items-center gap-2">
                                                                <span
                                                                  style={{
                                                                    fontFamily: "Poppins, sans-serif",
                                                                    fontWeight: 500,
                                                                    fontSize: "14px",
                                                                    color: "#111827",
                                                                  }}
                                                                >
                                                                  Service Provider
                                                                </span>
                                                                {option.serviceProvider && (
                                                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                                )}
                                                              </div>
                                                              <DropdownWithCustom
                                                                label=""
                                                                value={option.serviceProvider}
                                                                onChange={(value) => {
                                                                  updateDeploymentOption(index, 'serviceProvider', value)
                                                                  // Auto-exit edit mode when all fields are complete
                                                                  const updatedOption = { ...option, serviceProvider: value }
                                                                  if (updatedOption.serviceProvider && updatedOption.serviceName && updatedOption.deploymentType) {
                                                                    setEditingManualOptions(prev => {
                                                                      const newSet = new Set(prev)
                                                                      newSet.delete(index)
                                                                      return newSet
                                                                    })
                                                                  }
                                                                }}
                                                                options={serviceProviderOptions}
                                                                placeholder="Select service provider"
                                                              />
                                                            </div>
                                                            <div className="space-y-2">
                                                              <div className="flex items-center gap-2">
                                                                <span
                                                                  style={{
                                                                    fontFamily: "Poppins, sans-serif",
                                                                    fontWeight: 500,
                                                                    fontSize: "14px",
                                                                    color: "#111827",
                                                                  }}
                                                                >
                                                                  Service Name
                                                                </span>
                                                                {option.serviceName && (
                                                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                                )}
                                                              </div>
                                                              <DropdownWithCustom
                                                                label=""
                                                                value={option.serviceName}
                                                                onChange={(value) => {
                                                                  updateDeploymentOption(index, 'serviceName', value)
                                                                  // Auto-exit edit mode when all fields are complete
                                                                  const updatedOption = { ...option, serviceName: value }
                                                                  if (updatedOption.serviceProvider && updatedOption.serviceName && updatedOption.deploymentType) {
                                                                    setEditingManualOptions(prev => {
                                                                      const newSet = new Set(prev)
                                                                      newSet.delete(index)
                                                                      return newSet
                                                                    })
                                                                  }
                                                                }}
                                                                options={serviceNameOptions}
                                                                placeholder="Select or enter service name"
                                                              />
                                                            </div>
                                                            <div className="space-y-2">
                                                              <div className="flex items-center gap-2">
                                                                <span
                                                                  style={{
                                                                    fontFamily: "Poppins, sans-serif",
                                                                    fontWeight: 500,
                                                                    fontSize: "14px",
                                                                    color: "#111827",
                                                                  }}
                                                                >
                                                                  Deployment Type
                                                                </span>
                                                                {option.deploymentType && (
                                                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                                )}
                                                              </div>
                                                              <DropdownWithCustom
                                                                label=""
                                                                value={option.deploymentType}
                                                                onChange={(value) => {
                                                                  updateDeploymentOption(index, 'deploymentType', value)
                                                                  // Auto-exit edit mode when all fields are complete
                                                                  const updatedOption = { ...option, deploymentType: value }
                                                                  if (updatedOption.serviceProvider && updatedOption.serviceName && updatedOption.deploymentType) {
                                                                    setEditingManualOptions(prev => {
                                                                      const newSet = new Set(prev)
                                                                      newSet.delete(index)
                                                                      return newSet
                                                                    })
                                                                  }
                                                                }}
                                                                options={deploymentTypeOptions}
                                                                placeholder="Select deployment type"
                                                              />
                                                            </div>
                                                            <div className="relative">
                                                              <Label
                                                                htmlFor={`cloudRegion-manual-${index}`}
                                                                style={{
                                                                  fontFamily: "Poppins, sans-serif",
                                                                  fontWeight: 500,
                                                                  fontSize: "13px",
                                                                  color: "#111827",
                                                                  marginBottom: "4px",
                                                                  display: "block",
                                                                }}
                                                              >
                                                                Cloud Region
                                                                {option.cloudRegion && (
                                                                  <CheckCircle2 className="inline-block ml-2 h-4 w-4 text-green-600" />
                                                                )}
                                                              </Label>
                                                              <Input
                                                                id={`cloudRegion-manual-${index}`}
                                                                type="text"
                                                                placeholder="e.g., us-east-1, eu-west-1"
                                                                value={option.cloudRegion}
                                                                onChange={(e) => {
                                                                  e.stopPropagation()
                                                                  updateDeploymentOption(index, 'cloudRegion', e.target.value)
                                                                }}
                                                                onKeyDown={(e) => {
                                                                  e.stopPropagation()
                                                                  if (e.key === 'Enter') {
                                                                    e.preventDefault()
                                                                  }
                                                                }}
                                                                className="mt-1"
                                                                style={{
                                                                  width: "100%",
                                                                  height: "40px",
                                                                  borderRadius: "6px",
                                                                  padding: "8px 12px",
                                                                  paddingRight: option.cloudRegion ? "40px" : "12px",
                                                                  border: "1.5px solid #E5E7EB",
                                                                  fontFamily: "Inter, sans-serif",
                                                                  fontSize: "13px",
                                                                }}
                                                              />
                                                              {option.cloudRegion && (
                                                                <CheckCircle2
                                                                  className="absolute right-3 top-9 h-5 w-5 text-green-600"
                                                                  style={{ pointerEvents: 'none' }}
                                                                />
                                                              )}
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    })()
                                                  ) : (
                                                    // Read-only display for fetched options
                                                    <div
                                                      className="flex-1 min-w-0"
                                                    >
                                                      <div className="flex items-center gap-2 mb-1">
                                                        <div
                                                          className="px-2 py-1 rounded text-xs font-medium"
                                                          style={{
                                                            backgroundColor: option.serviceProvider === "AWS" ? "#FF9900" :
                                                              option.serviceProvider === "Azure" ? "#0078D4" :
                                                                option.serviceProvider === "GCP" ? "#4285F4" :
                                                                  option.serviceProvider === "Open-Source" ? "#28A745" :
                                                                    "#6B7280",
                                                            color: "#FFFFFF",
                                                          }}
                                                        >
                                                          {option.serviceProvider}
                                                        </div>
                                                        <span
                                                          className="font-medium text-sm"
                                                          style={{
                                                            color: "#111827",
                                                          }}
                                                        >
                                                          {option.serviceName || "Service Name"}
                                                        </span>
                                                      </div>
                                                      <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                                                        <span>
                                                          <strong>Deployment:</strong> {option.deploymentType || "N/A"}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                          <strong>Region:</strong> {option.cloudRegion || "N/A"}
                                                        </span>
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )
                              })()}

                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Demo Assets */}
                      {currentStep === 3 && (
                        <div>
                          <div className="space-y-8">
                            {/* Existing Assets Preview - Show in edit mode */}
                            {isEditMode && (apiDemoAssets.length > 0 || demoPreview) && (
                              <div className="flex flex-col items-center justify-center w-full">
                                <Label
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "#111827",
                                    margin: 0,
                                    marginBottom: "12px",
                                    display: "block",
                                    textAlign: "center",
                                  }}
                                >
                                  Existing Demo Assets
                                </Label>
                                <div className="w-full max-w-4xl">
                                  <DemoAssetsViewer
                                    assets={apiDemoAssets}
                                    demoPreview={demoPreview}
                                    className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm"
                                  />
                                </div>
                              </div>
                            )}

                            {/* Demo preview URLs */}
                            <div>
                              <div
                                className="flex items-center justify-between mb-2"
                                style={{
                                  width: "937px",
                                }}
                              >
                                <Label
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "#111827",
                                    margin: 0,
                                  }}
                                >
                                  {isEditMode && apiDemoAssets.length > 0
                                    ? apiDemoAssets
                                      .filter(a => a.demo_asset_name)
                                      .map(a => a.demo_asset_name)
                                      .join(', ') || "Demo Assets"
                                    : "Demo preview URLs (youtube, video, etc)"
                                  }
                                </Label>
                                <Button
                                  type="button"
                                  onClick={addDemoLink}
                                  disabled={!newDemoLink.trim()}
                                  style={{
                                    width: "96.99999950526576px",
                                    height: "23.99999987759153px",
                                    borderRadius: "4px",
                                    paddingLeft: "6px",
                                    paddingRight: "12px",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    backgroundColor: "#E6EDFD",
                                    color: "#003CBD",
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    textAlign: "center",
                                    border: "none",
                                    whiteSpace: "nowrap",
                                    cursor: newDemoLink.trim() ? "pointer" : "not-allowed",
                                    opacity: 1,
                                    transform: "rotate(-0.28deg)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  + Add Url
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {formData.demoLinks.map((link, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <Input
                                      placeholder="https://"
                                      value={link}
                                      onChange={(e) => updateDemoLink(index, e.target.value)}
                                      className="flex-1"
                                      style={{
                                        width: "100%",
                                        maxWidth: "940px",
                                        minWidth: "240px",
                                        height: "44px",
                                        borderRadius: "4px",
                                        paddingTop: "11px",
                                        paddingRight: "16px",
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
                                        color: link ? "#111827" : "#6B7280",
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeDemoLink(index)}
                                      className="text-red-600 hover:text-red-800 h-10 w-10"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Input
                                  placeholder="https://"
                                  value={newDemoLink}
                                  onChange={(e) => setNewDemoLink(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addDemoLink()
                                    }
                                  }}
                                  style={{
                                    width: "937px",
                                    minWidth: "240px",
                                    height: "44px",
                                    borderRadius: "4px",
                                    paddingTop: "11px",
                                    paddingRight: "16px",
                                    paddingBottom: "11px",
                                    paddingLeft: "16px",
                                    border: "1px solid #E5E7EB",
                                    borderTop: "1px solid #E5E7EB",
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    verticalAlign: "middle",
                                    color: "#6B7280",
                                  }}
                                />
                              </div>
                            </div>

                            {/* Agent Demo preview Assets (File Upload) */}
                            <div>
                              <Label
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 500,
                                  fontStyle: "normal",
                                  fontSize: "14px",
                                  lineHeight: "150%",
                                  letterSpacing: "0%",
                                  color: "#111827",
                                  margin: 0,
                                }}
                              >
                                Agent Demo preview Assets (Images, Video, etc)
                              </Label>
                              <div className="mt-2">
                                <input
                                  ref={bulkFileInputRef}
                                  type="file"
                                  multiple
                                  onChange={(e) => {
                                    const files = e.target.files
                                    if (files) handleBulkFileUpload(files)
                                  }}
                                  className="hidden"
                                  accept="image/*,video/*,.pdf,.doc,.docx"
                                />
                                <div
                                  onClick={() => bulkFileInputRef.current?.click()}
                                  onDragOver={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.currentTarget.style.borderColor = "#004BEC"
                                    e.currentTarget.style.backgroundColor = "#E6EDFD"
                                    e.currentTarget.style.borderWidth = "3px"
                                  }}
                                  onDragLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#E5E7EB"
                                    e.currentTarget.style.backgroundColor = "#FAFBFC"
                                    e.currentTarget.style.borderWidth = "2px"
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    const files = e.dataTransfer.files
                                    if (files) handleBulkFileUpload(files)
                                    e.currentTarget.style.borderColor = "#E5E7EB"
                                    e.currentTarget.style.backgroundColor = "#FAFBFC"
                                    e.currentTarget.style.borderWidth = "2px"
                                  }}
                                  style={{
                                    width: "100%",
                                    maxWidth: "940px",
                                    minWidth: "240px",
                                    minHeight: "200px",
                                    border: "2px dashed #E5E7EB",
                                    borderRadius: "12px",
                                    padding: "40px 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    backgroundColor: "#FAFBFC",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#004BEC"
                                    e.currentTarget.style.backgroundColor = "#F0F5FF"
                                    e.currentTarget.style.borderWidth = "2.5px"
                                    e.currentTarget.style.transform = "scale(1.01)"
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 75, 236, 0.1)"
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#E5E7EB"
                                    e.currentTarget.style.backgroundColor = "#FAFBFC"
                                    e.currentTarget.style.borderWidth = "2px"
                                    e.currentTarget.style.transform = "scale(1)"
                                    e.currentTarget.style.boxShadow = "none"
                                  }}
                                >
                                  <Image
                                    src="/cloud-upload.png"
                                    alt="Upload"
                                    width={48}
                                    height={48}
                                    className="mb-4 transition-transform duration-200 hover:scale-110"
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                    }}
                                    unoptimized
                                  />
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 500,
                                      fontStyle: "normal",
                                      fontSize: "16px",
                                      lineHeight: "150%",
                                      letterSpacing: "0%",
                                      textAlign: "center",
                                      color: "#111827",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    Drag & drop files or{" "}
                                    <span
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 500,
                                        fontStyle: "normal",
                                        fontSize: "16px",
                                        lineHeight: "150%",
                                        letterSpacing: "0%",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        color: "#004BEC",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                      }}
                                    >
                                      Choose files
                                    </span>
                                  </p>
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "12px",
                                      lineHeight: "150%",
                                      letterSpacing: "0%",
                                      textAlign: "center",
                                      color: "#6B7280",
                                      marginTop: "8px",
                                    }}
                                  >
                                    Supports PDF, Word document file (max. 25MB file size)
                                  </p>
                                </div>
                              </div>

                              {/* File Preview */}
                              {formData.bulkFiles.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <Label
                                    className="text-sm font-medium"
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
                                    Uploaded Files
                                  </Label>
                                  <div className="grid gap-2">
                                    {formData.bulkFiles.map((fileWithPreview, index) => (
                                      <div
                                        key={index}
                                        className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                                      >
                                        {fileWithPreview.previewUrl ? (
                                          <img
                                            src={fileWithPreview.previewUrl}
                                            alt={fileWithPreview.name}
                                            className="h-8 w-8 rounded object-cover"
                                          />
                                        ) : (
                                          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                                            {fileWithPreview.type.startsWith('image/') ? (
                                              <ImageIcon className="h-4 w-4 text-gray-600" />
                                            ) : fileWithPreview.type.startsWith('video/') ? (
                                              <Video className="h-4 w-4 text-gray-600" />
                                            ) : (
                                              <FileText className="h-4 w-4 text-gray-600" />
                                            )}
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-medium text-gray-900 truncate">
                                            {fileWithPreview.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(fileWithPreview.size / 1024 / 1024).toFixed(2)} MB
                                          </p>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => removeBulkFile(index)}
                                          className="text-red-600 hover:text-red-800"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Documentation */}
                      {currentStep === 4 && (
                        <div>
                          <div className="space-y-6">
                            <div>
                              <Label
                                htmlFor="sdkDetails"
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
                                SDK Details
                              </Label>
                              <Textarea
                                id="sdkDetails"
                                placeholder="SDK installation and usage instructions"
                                value={formData.sdkDetails}
                                onChange={(e) => setFormData({ ...formData, sdkDetails: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "940px",
                                  height: "97px",
                                  minWidth: "240px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="apiDocumentation"
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
                                API Documentation (Swagger)
                              </Label>
                              <Input
                                id="apiDocumentation"
                                placeholder="https://your-swagger-docs.com"
                                value={formData.apiDocumentation}
                                onChange={(e) => setFormData({ ...formData, apiDocumentation: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "937px",
                                  minWidth: "240px",
                                  height: "44px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            <div
                              className="grid grid-cols-1 md:grid-cols-2 gap-6"
                              style={{
                                width: "940px",
                                height: "130px",
                                opacity: 1,
                              }}
                            >
                              <div>
                                <Label
                                  htmlFor="sampleInput"
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
                                  Sample Input
                                </Label>
                                <Textarea
                                  id="sampleInput"
                                  placeholder="Example input data"
                                  value={formData.sampleInput}
                                  onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                                  className="mt-2"
                                  style={{
                                    width: "450px",
                                    height: "97px",
                                    minWidth: "240px",
                                    borderRadius: "4px",
                                    paddingTop: "11px",
                                    paddingRight: "16px",
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
                                    color: "#6B7280",
                                  }}
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="sampleOutput"
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
                                  Sample Output
                                </Label>
                                <Textarea
                                  id="sampleOutput"
                                  placeholder="Example output data"
                                  value={formData.sampleOutput}
                                  onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                                  className="mt-2"
                                  style={{
                                    width: "450px",
                                    height: "97px",
                                    minWidth: "240px",
                                    borderRadius: "4px",
                                    paddingTop: "11px",
                                    paddingRight: "16px",
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
                                    color: "#6B7280",
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="securityDetails"
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
                                Security Details
                              </Label>
                              <Textarea
                                id="securityDetails"
                                placeholder="Security considerations and best practices"
                                value={formData.securityDetails}
                                onChange={(e) => setFormData({ ...formData, securityDetails: e.target.value })}
                                className="mt-2"
                                style={{
                                  width: "940px",
                                  height: "97px",
                                  minWidth: "240px",
                                  borderRadius: "4px",
                                  paddingTop: "11px",
                                  paddingRight: "16px",
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
                                  color: "#6B7280",
                                }}
                              />
                            </div>

                            {/* README File Upload */}
                            <div>
                              <Label
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
                                README File Upload
                              </Label>
                              <div className="mt-2">
                                <input
                                  ref={readmeFileInputRef}
                                  type="file"
                                  accept=".md,.txt,.pdf,.doc,.docx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file, 'readme')
                                  }}
                                  className="hidden"
                                />
                                <div
                                  onClick={() => readmeFileInputRef.current?.click()}
                                  style={{
                                    width: "100%",
                                    maxWidth: "940px",
                                    minWidth: "240px",
                                    minHeight: "200px",
                                    border: "2px dashed #E5E7EB",
                                    borderRadius: "12px",
                                    padding: "40px 20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    backgroundColor: "#FAFBFC",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#004BEC"
                                    e.currentTarget.style.backgroundColor = "#F0F5FF"
                                    e.currentTarget.style.borderWidth = "2.5px"
                                    e.currentTarget.style.transform = "scale(1.01)"
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 75, 236, 0.1)"
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#E5E7EB"
                                    e.currentTarget.style.backgroundColor = "#FAFBFC"
                                    e.currentTarget.style.borderWidth = "2px"
                                    e.currentTarget.style.transform = "scale(1)"
                                    e.currentTarget.style.boxShadow = "none"
                                  }}
                                >
                                  <Image
                                    src="/cloud-upload.png"
                                    alt="Upload"
                                    width={48}
                                    height={48}
                                    className="mb-4 transition-transform duration-200 hover:scale-110"
                                    style={{
                                      width: "48px",
                                      height: "48px",
                                    }}
                                    unoptimized
                                  />
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 600,
                                      fontStyle: "normal",
                                      fontSize: "16px",
                                      lineHeight: "150%",
                                      letterSpacing: "0%",
                                      textAlign: "center",
                                      color: "#111827",
                                      marginBottom: "4px",
                                    }}
                                  >
                                    {formData.readmeFile ? formData.readmeFile.name : "Click to upload README file"}
                                  </p>
                                  <p
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "12px",
                                      lineHeight: "150%",
                                      letterSpacing: "0%",
                                      textAlign: "center",
                                      color: "#6B7280",
                                      marginTop: "8px",
                                    }}
                                  >
                                    Upload a README file to help users understand how to use your agent. Supports markdown, Text,<br />
                                    pdf ,Word document file (max. 10MB file size)
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Additional Related Files (Links) */}
                            <div>
                              <div
                                className="flex items-center justify-between mb-2"
                                style={{
                                  width: "937px",
                                }}
                              >
                                <Label
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    color: "#111827",
                                    margin: 0,
                                  }}
                                >
                                  Additional Related Files (Links)
                                </Label>
                                <Button
                                  type="button"
                                  onClick={addAdditionalLink}
                                  disabled={!newAdditionalLink.trim()}
                                  style={{
                                    width: "96.99999950526576px",
                                    height: "23.99999987759153px",
                                    borderRadius: "4px",
                                    paddingLeft: "6px",
                                    paddingRight: "12px",
                                    paddingTop: "0px",
                                    paddingBottom: "0px",
                                    backgroundColor: "#E6EDFD",
                                    color: "#003CBD",
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 500,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    textAlign: "center",
                                    border: "none",
                                    whiteSpace: "nowrap",
                                    cursor: newAdditionalLink.trim() ? "pointer" : "not-allowed",
                                    opacity: 1,
                                    transform: "rotate(-0.28deg)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  + Add Url
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {formData.additionalRelatedFiles.map((link, index) => (
                                  <div key={index} className="flex gap-2 items-center">
                                    <Input
                                      placeholder="https://"
                                      value={link}
                                      onChange={(e) => updateAdditionalLink(index, e.target.value)}
                                      className="flex-1"
                                      style={{
                                        width: "100%",
                                        maxWidth: "940px",
                                        minWidth: "240px",
                                        height: "44px",
                                        borderRadius: "4px",
                                        paddingTop: "11px",
                                        paddingRight: "16px",
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
                                        color: link ? "#111827" : "#6B7280",
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeAdditionalLink(index)}
                                      className="text-red-600 hover:text-red-800 h-10 w-10"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                                <Input
                                  placeholder="https://"
                                  value={newAdditionalLink}
                                  onChange={(e) => setNewAdditionalLink(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addAdditionalLink()
                                    }
                                  }}
                                  style={{
                                    width: "100%",
                                    maxWidth: "940px",
                                    minWidth: "240px",
                                    height: "44px",
                                    borderRadius: "4px",
                                    paddingTop: "11px",
                                    paddingRight: "16px",
                                    paddingBottom: "11px",
                                    paddingLeft: "16px",
                                    border: "1px solid #E5E7EB",
                                    borderTop: "1px solid #E5E7EB",
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "14px",
                                    lineHeight: "150%",
                                    letterSpacing: "0%",
                                    verticalAlign: "middle",
                                    color: newAdditionalLink ? "#111827" : "#6B7280",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 5: Review & Submit */}
                      {!isEditMode && currentStep === 5 && (
                        <div>
                          <h2 className="mb-2 text-3xl font-bold">Preview & Submit</h2>
                          <p className="mb-8 text-muted-foreground">Preview your agent before submitting</p>

                          {submitError && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                              <p className="text-sm text-red-600">{submitError}</p>
                            </div>
                          )}

                          <OnboardAgentPreview
                            formData={{
                              ...formData,
                              deploymentOptions: formData.deploymentOptions.filter((_, index) => selectedDeploymentIndices.has(index))
                            }}
                          />
                        </div>
                      )}

                    </>
                  )}

                </div>
              </div>
            </div>

            {/* Fixed Navigation Buttons - Always visible at bottom */}
            <div
              className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-t border-gray-100"
              style={{
                background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.05)",
                animation: "buttonSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            >
              {!(isEditMode && currentStep === 1) && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#6B7280",
                    border: "1px solid #E5E7EB",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB"
                    e.currentTarget.style.color = "#374151"
                    e.currentTarget.style.transform = "translateX(-2px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB"
                    e.currentTarget.style.color = "#6B7280"
                    e.currentTarget.style.transform = "translateX(0)"
                  }}
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  {isEditMode ? "Previous" : (currentStep === 1 ? "Cancel" : "Previous")}
                </button>
              )}

              <Button
                onClick={handleNext}
                disabled={isSubmitting || isLoadingAgentData}
                className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  minWidth: "200px",
                  height: "48px",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  background: isSubmitting
                    ? "#9CA3AF"
                    : "linear-gradient(135deg, #181818 0%, #000000 100%)",
                  color: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 600,
                  fontSize: "15px",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 4px 12px rgba(0, 0, 0, 0.15)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)"
                    e.currentTarget.style.transform = "scale(1.02)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
                    e.currentTarget.style.transform = "scale(1)"
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    {isEditMode ? "Saving..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    {isEditMode && currentStep === 4 ? "Save Changes" : currentStep === 5 ? "Submit Agent" : "Continue"}
                    {!(isEditMode && currentStep === 4) && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <UploadSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false)
          router.push("/")
        }}
      />
    </>
  )
}

