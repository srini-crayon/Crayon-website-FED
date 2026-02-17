"use client";

import { Button } from "../../components/ui/button";
import { AgentSearchChat } from "../../components/agent-search-chat";
import { AgentCard } from "../../components/agent-card";
import { ModelCard } from "../../components/model-card";
import { AgentCardSkeleton } from "../../components/agent-card-skeleton";
import { ChevronDown, Filter, Search, MessageCircle, ArrowUpRight, Landmark, Activity, HeartHandshake, ShoppingBag, GraduationCap, Zap } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useChatStore } from "../../lib/store/chat.store";
import { useWishlistsStore } from "../../lib/store/wishlists.store";
import { useAuthStore } from "../../lib/store/auth.store";
import { useModal } from "../../hooks/use-modal";
import { FilterSidebar } from "../../components/filter-sidebar";


// Fallback mock data (minimal) in case the API fails
const fallbackAgents = [
  {
    id: "intelligent-image-analyzer",
    title: "Intelligent Image Analyzer",
    description:
      "Simplifies insurance claim assessment with AI during the insurance claims. By analyzing uploaded images, it identifies affected parts, retrieves repair costs from a database, and generates a detailed damage report.",
    badges: [{ label: "Image Processing", variant: "default" as const }],
    tags: ["CRM", "Claims", "Insurance"],
    capabilities: ["Document Intelligence"],
    providers: ["AWS"],
    deploymentType: "Solution",
    persona: "Operations Teams",
    assetType: "Solution",
  },
];

type Agent = {
  id: string;
  title: string;
  description: string;
  badges: { label: string; variant: "default" }[];
  tags: string[];
  capabilities: string[];
  providers: string[];
  deploymentType: string;
  persona: string;
  assetType: string;
  valueProposition?: string;
  agents_ordering?: number;
  demoPreview?: string;
};

type ApiAgent = {
  agent_id: string;
  agent_name: string;
  description: string;
  tags: string | null;
  by_value?: string | null;
  by_capability?: string | null;
  service_provider?: string | null;
  asset_type?: string | null;
  by_persona?: string | null;
  admin_approved?: string | null;
  agents_ordering?: string | number | null;
};

type Model = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoPreview?: string;
};

type ApiModel = {
  model_id?: string;
  id?: string;
  model_name?: string;
  name?: string;
  blog_title?: string;
  preview_text?: string;
  tag_line?: string;
  long_description?: string;
  description?: string;
  model_icon?: string;
  model_type_1?: string;
  model_type_2?: string;
  training_data_1?: string;
  training_data_2?: string;
  training_data_3?: string;
  training_data_4?: string;
  tags?: string | null;
  demo_preview?: string | null;
  admin_approved?: string | null;
  [key: string]: any;
};

async function fetchAgents() {
  try {
    const res = await fetch("https://agents-store.onrender.com/api/agents", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
    const data = await res.json();
    // Map API response to AgentCard props
    const apiAgents: ApiAgent[] = data?.agents || [];
    // Filter to only show approved agents
    return apiAgents
      .filter(a => a.admin_approved === "yes")
      .map((a) => ({
        id: a.agent_id,
        title: a.agent_name,
        description: a.description,
        // API `tags` may be a comma-separated string; convert to array
        tags: a.tags
          ? a.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
          : [],
        badges: [
          { label: (a as any).by_value || "", variant: "default" as const },
        ],
        capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
        providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
        deploymentType: a.asset_type || "",
        persona: a.by_persona || "",
        assetType: a.asset_type || "",
      }));
  } catch (err) {
    // On any error return fallback
    // eslint-disable-next-line no-console
    console.error(err);
    return fallbackAgents;
  }
}

function TypingHeading() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const str1 = "The One-Stop Agent Store.";
  const str2 = "";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    setText1("");
    setText2("");

    const typeStr1 = (i: number) => {
      if (i <= str1.length) {
        setText1(str1.substring(0, i));
        // Random typing speed for realism (30-60ms)
        const speed = 30 + Math.random() * 30;
        timeout = setTimeout(() => typeStr1(i + 1), speed);
      } else {
        setTimeout(() => typeStr2(0), 100);
      }
    };

    const typeStr2 = (i: number) => {
      if (i <= str2.length) {
        setText2(str2.substring(0, i));
        const speed = 40 + Math.random() * 40;
        timeout = setTimeout(() => typeStr2(i + 1), speed);
      }
    };

    timeout = setTimeout(() => typeStr1(0), 300); // 300ms initial delay

    return () => clearTimeout(timeout);
  }, []);

  return (
    <h1
      className="mb-3 text-center"
      style={{
        minHeight: "80px",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "52px",
          lineHeight: "1.2",
          textAlign: "center",
          color: "#091917",
          whiteSpace: "pre-wrap"
        }}
      >
        {text1}
      </span>
      <span
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          fontSize: "52px",
          lineHeight: "1.2",
          textAlign: "center",
          color: "#091917",
          whiteSpace: "pre-wrap"
        }}
      >
        {text2}
      </span>
      <span style={{
        display: "inline-block",
        width: "3px",
        height: "50px",
        backgroundColor: "#EC4899",
        marginLeft: "4px",
        animation: "blink 1s step-end infinite"
      }}></span>
    </h1>
  );
}


export default function AgentLibraryPage() {
  const { openModal } = useModal();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [agentSearchChatValue, setAgentSearchChatValue] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All");
  const [byCapabilityFilter, setByCapabilityFilter] = useState<string[]>([]);
  const [deploymentFilter, setDeploymentFilter] = useState<string>("All");
  const [personaFilter, setPersonaFilter] = useState<string[]>([]);
  const [selectedCapability, setSelectedCapability] = useState<string>("All");
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategoryTag, setSelectedCategoryTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"Recommended" | "A-Z">("Recommended");
  const [recommendedDropdownOpen, setRecommendedDropdownOpen] = useState(false);
  const [aiCurrentPage, setAiCurrentPage] = useState(1);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedWishlistId, setSelectedWishlistId] = useState<string | null>(null);

  // Mouse position state for radial hover effect
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const browseCarouselRef = useRef<HTMLDivElement>(null);
  const [browseCarouselPage, setBrowseCarouselPage] = useState(0);
  /** Only these agents are shown in the browse carousel; each card uses API data when available (id, title, description), else static fallback. */
  const BROWSE_CARDS_DATA: { id: string; title: string; description: string; image: string; background: string }[] = [
    { id: "lea", title: "LEA", description: "Legal entity and agreement management agent.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%), linear-gradient(77.09deg, rgba(0, 0, 0, 0) 5.57%, rgba(36, 4, 31, 0.4) 98.1%)" },
    { id: "account-opening", title: "Account Opening", description: "Streamlined account opening and onboarding workflows.", image: "/img/carousel-card-support.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)" },
    { id: "npa", title: "NPA", description: "NPA valuation and portfolio management assistant.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #10062D 7.68%, #007C98 94.52%)" },
    { id: "travel-ai", title: "Travel AI", description: "AI-powered travel assistant for bookings, itineraries, and recommendations.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%), linear-gradient(77.09deg, rgba(0, 0, 0, 0) 5.57%, rgba(36, 4, 31, 0.4) 98.1%)" },
    { id: "omp", title: "OMP", description: "Operations and process management agent for streamlined workflows.", image: "/img/carousel-card-support.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)" },
    { id: "test-data", title: "Test Data", description: "Generate and manage test data for QA and development.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #10062D 7.68%, #007C98 94.52%)" },
    { id: "controls-agent", title: "Controls Agent", description: "Governance and controls automation for compliance and risk.", image: "/img/carousel-card-support.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%), linear-gradient(77.09deg, rgba(0, 0, 0, 0) 5.57%, rgba(36, 4, 31, 0.4) 98.1%)" },
    { id: "data-studio", title: "Data Studio", description: "Visual analytics and data exploration for business insights.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)" },
    { id: "cxo-concierge", title: "CXO Concierge", description: "Executive-level assistant for strategy, reporting, and decision support.", image: "/img/carousel-card-support.png", background: "linear-gradient(84.65deg, #10062D 7.68%, #007C98 94.52%)" },
    { id: "ap-automation", title: "AP Automation", description: "Accounts payable automation and invoice processing.", image: "/img/carousel-card-support.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%), linear-gradient(77.09deg, rgba(0, 0, 0, 0) 5.57%, rgba(36, 4, 31, 0.4) 98.1%)" },
    { id: "wealth-rm", title: "Wealth RM", description: "Wealth and relationship management for advisors and clients.", image: "/img/carousel-card-campaign.png", background: "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)" },
  ];
  const BROWSE_CAROUSEL_PAGES = BROWSE_CARDS_DATA.length;

  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages, clearChat } = useChatStore();
  const { allFavoritedAgentIds, loadAllWishlists, wishlists } = useWishlistsStore();
  const favorites = Array.from(allFavoritedAgentIds);
  const agentIdFromUrl = searchParams.get('agentId');

  // Check if chat is in progress (has messages beyond the initial welcome message)
  // The initial message has id "m1", so if messages.length > 1, conversation has started
  const userMessages = messages.filter(m => m.role === "user");
  const hasActiveChat = messages.length > 1;
  const userMessageCount = userMessages.length;

  // Track if component is mounted (for Portal hydration safety)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load wishlists from server on page load (only if authenticated)
  const { isAuthenticated } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated) {
      loadAllWishlists();
    }
  }, [loadAllWishlists, isAuthenticated]);


  // Check if we should redirect to chat route
  useEffect(() => {
    if (searchParams.get('chat') === 'true') {
      router.replace('/agents/chat');
    }
  }, [searchParams, router]);

  // Scroll to agent filters section when hash is present
  useEffect(() => {
    if (window.location.hash === '#agent-filters') {
      // Wait for content to load before scrolling
      setTimeout(() => {
        const element = document.getElementById('agent-filters');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [loading]);

  // Handle scroll to toggle scroll indicator visibility
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
        
        // Check content-type before parsing JSON
        const contentType = res.headers.get('content-type') || '';
        let data: any;
        if (contentType.includes('application/json')) {
          try {
            data = await res.json();
          } catch (parseError) {
            console.error('Failed to parse agents response as JSON:', parseError);
            throw new Error('Server returned invalid response format');
          }
        } else {
          const text = await res.text();
          console.error('Server returned non-JSON response:', text.substring(0, 200));
          throw new Error('Server returned non-JSON response');
        }

        const apiAgents: ApiAgent[] = data?.agents || [];
        const mappedAgents = apiAgents
          .filter(a => a.admin_approved === "yes") // Only show approved agents
          .map((a) => {
            // Parse agents_ordering - handle "na", null, undefined, or numeric string
            let ordering: number | undefined;
            if (a.agents_ordering !== null && a.agents_ordering !== undefined && a.agents_ordering !== "na") {
              const parsed = typeof a.agents_ordering === 'number'
                ? a.agents_ordering
                : parseInt(String(a.agents_ordering), 10);
              ordering = isNaN(parsed) ? undefined : parsed;
            }

            // Parse demo_preview to get first image URL
            // Format: "url1,JPG,url2,JPG,..." or "url1,url2,..."
            const demoPreviewUrls = (a as any).demo_preview
              ? (a as any).demo_preview
                .split(",")
                .map((item: string) => item.trim())
                .filter((item: string) => {
                  // Filter out non-URL items (like "JPG", "PNG", etc.) and keep only URLs
                  return item && (item.startsWith("http://") || item.startsWith("https://"));
                })
              : [];
            const firstPreviewImage = demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : undefined;

            return {
              id: a.agent_id,
              title: a.agent_name,
              description: a.description,
              tags: a.tags
                ? a.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                : [],
              badges: [
                { label: (a as any).by_value || "", variant: "default" as const },
              ],
              // Add new fields for filtering
              capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
              providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
              deploymentType: a.asset_type || "",
              persona: a.by_persona || "",
              assetType: a.asset_type || "",
              valueProposition: (a as any).by_value || "",
              agents_ordering: ordering,
              demoPreview: firstPreviewImage,
            };
          })
          // Sort by agents_ordering: numeric values first (ascending), then undefined/null/"na" at the end
          .sort((a, b) => {
            const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
          });

        setAgents(mappedAgents.length > 0 ? mappedAgents : fallbackAgents);

        // Set default capability to "All"
        setSelectedCapability("All");
        setCapabilityFilter("All");
      } catch (err) {
        console.error(err);
        setError("Failed to load agents");
        setAgents(fallbackAgents);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true);
        const res = await fetch("https://agents-store.onrender.com/api/models", {
          cache: "no-store",
        });
        if (!res.ok) {
          console.warn(`Failed to fetch models: ${res.status}`);
          setModels([]);
          return;
        }
        
        // Check content-type before parsing JSON
        const contentType = res.headers.get('content-type') || '';
        let data: any;
        if (contentType.includes('application/json')) {
          try {
            data = await res.json();
          } catch (parseError) {
            console.error('Failed to parse models response as JSON:', parseError);
            setModels([]);
            return;
          }
        } else {
          console.warn('Server returned non-JSON response for models');
          setModels([]);
          return;
        }

        // Handle API response structure: { success: true, data: [...] }
        const apiModels: ApiModel[] = data?.data || data?.models || data || [];
        const mappedModels = apiModels
          .filter((m: ApiModel) => !m.admin_approved || m.admin_approved === "yes") // Only show approved models if field exists
          .map((m: ApiModel) => {
            const modelId = m.model_id || m.id || "";
            const modelName = m.blog_title || m.model_name || m.name || "";

            // Use preview_text or tag_line for description, fallback to long_description or description
            const description = m.preview_text || m.tag_line || m.long_description || m.description || "";

            // Use model_icon for preview image, fallback to demo_preview
            let previewImage: string | undefined = undefined;
            if (m.model_icon) {
              previewImage = m.model_icon;
            } else if (m.demo_preview) {
              const demoPreviewUrls = m.demo_preview
                .split(",")
                .map((item: string) => item.trim())
                .filter((item: string) => {
                  return item && (item.startsWith("http://") || item.startsWith("https://"));
                });
              previewImage = demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : undefined;
            }

            // Extract tags from model_type fields and training_data fields
            const tags: string[] = [];
            if (m.model_type_1) tags.push(m.model_type_1);
            if (m.model_type_2) tags.push(m.model_type_2);
            if (m.training_data_1) tags.push(m.training_data_1);
            if (m.training_data_2) tags.push(m.training_data_2);
            if (m.training_data_3) tags.push(m.training_data_3);
            if (m.training_data_4) tags.push(m.training_data_4);

            // Also add tags from tags field if it exists
            if (m.tags) {
              const additionalTags = m.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);
              tags.push(...additionalTags);
            }

            return {
              id: modelId,
              title: modelName,
              description: description,
              tags: tags,
              demoPreview: previewImage,
            };
          })
          .filter((m: Model) => m.id && m.title); // Filter out invalid models

        setModels(mappedModels);
      } catch (err) {
        console.error("Error fetching models:", err);
        setModels([]);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Scroll animations with IntersectionObserver - Optimized for performance
  useEffect(() => {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleObservation = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 200 });
      } else {
        setTimeout(callback, 100);
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Trigger earlier for smoother experience
    };

    const observer = new IntersectionObserver((entries) => {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Handle different animation types
            if (entry.target.classList.contains("fade-in-section")) {
              entry.target.classList.add("fade-in-visible");
            } else if (entry.target.classList.contains("slide-in-left")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("slide-in-right")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("scale-in")) {
              entry.target.classList.add("scale-in-visible");
            } else if (entry.target.classList.contains("fade-in-blur")) {
              entry.target.classList.add("fade-in-blur-visible");
            } else if (entry.target.classList.contains("stagger-item")) {
              entry.target.classList.add("stagger-visible");
            }
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    // Function to observe all animated elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    // Observe elements after DOM is ready
    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);


  const allCapabilities = useMemo(() => {
    const values = new Set<string>();
    agents.forEach(agent => {
      if (agent.valueProposition) {
        values.add(agent.valueProposition);
      }
    });
    return Array.from(values).sort();
  }, [agents]);

  // Calculate counts for each value proposition
  const capabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCapabilities.forEach(value => {
      counts[value] = agents.filter(agent =>
        agent.valueProposition === value
      ).length;
    });
    return counts;
  }, [agents, allCapabilities]);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    agents.forEach(agent => {
      agent.providers.forEach(provider => providers.add(provider));
    });
    return Array.from(providers).sort();
  }, [agents]);

  // Get all unique capabilities from by_capability field
  const allByCapabilities = useMemo(() => {
    const capabilities = new Set<string>();
    agents.forEach(agent => {
      agent.capabilities.forEach(cap => {
        if (cap) capabilities.add(cap);
      });
    });
    return Array.from(capabilities).sort();
  }, [agents]);

  // Calculate counts for each capability
  const byCapabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allByCapabilities.forEach(cap => {
      counts[cap] = agents.filter(agent =>
        agent.capabilities.includes(cap)
      ).length;
    });
    return counts;
  }, [agents, allByCapabilities]);

  // Update indicator position when selected capability changes
  useEffect(() => {
    if (!tabsContainerRef.current || !selectedCapability) {
      setIndicatorStyle(null);
      return;
    }

    const tabElement = tabRefs.current.get(selectedCapability);
    if (!tabElement) {
      setIndicatorStyle(null);
      return;
    }

    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      if (!tabsContainerRef.current || !tabElement) return;

      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedCapability, allCapabilities]);

  // Calculate grey line width to span all tabs
  const [greyLineStyle, setGreyLineStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    if (!tabsContainerRef.current) {
      setGreyLineStyle(null);
      return;
    }

    const timer = setTimeout(() => {
      if (!tabsContainerRef.current) return;

      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const allTab = tabRefs.current.get("All");
      const lastTab = allCapabilities.length > 0
        ? tabRefs.current.get(allCapabilities[allCapabilities.length - 1])
        : allTab;

      if (allTab && lastTab) {
        const firstRect = allTab.getBoundingClientRect();
        const lastRect = lastTab.getBoundingClientRect();

        setGreyLineStyle({
          left: firstRect.left - containerRect.left,
          width: (lastRect.right - firstRect.left),
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [allCapabilities]);

  // Category tags for "All Agents" section (from agent tags + capabilities)
  const allCategoryTags = useMemo(() => {
    const set = new Set<string>();
    agents.forEach(agent => {
      agent.tags.forEach(t => t && set.add(t.trim()));
      agent.capabilities.forEach(c => c && set.add(c.trim()));
    });
    const list = Array.from(set).filter(Boolean).sort();
    return list.length > 0 ? list : ["Banking", "Retail", "Customer Experience", "Productivity", "HR", "Data Accelerator", "Fashion", "Consumer", "Tech Distribution"];
  }, [agents]);

  const allPersonas = useMemo(() => {
    const personas = new Set<string>();
    agents.forEach(agent => {
      if (agent.persona) personas.add(agent.persona);
    });
    return Array.from(personas).sort();
  }, [agents]);

  // Filter options based on selected value proposition
  const filteredProviders = useMemo(() => {
    if (selectedCapability === "All" || !selectedCapability) return allProviders;
    const providers = new Set<string>();
    agents
      .filter(agent => agent.valueProposition === selectedCapability)
      .forEach(agent => {
        agent.providers.forEach(provider => providers.add(provider));
      });
    return Array.from(providers).sort();
  }, [agents, selectedCapability, allProviders]);

  const filteredPersonas = useMemo(() => {
    if (selectedCapability === "All" || !selectedCapability) return allPersonas;
    const personas = new Set<string>();
    agents
      .filter(agent => agent.valueProposition === selectedCapability)
      .forEach(agent => {
        if (agent.persona) personas.add(agent.persona);
      });
    return Array.from(personas).sort();
  }, [agents, selectedCapability, allPersonas]);

  // Update capability filter when segment is selected
  useEffect(() => {
    if (selectedCapability) {
      setCapabilityFilter(selectedCapability === "All" ? "All" : selectedCapability);
    }
  }, [selectedCapability]);

  // Get AI searched agent IDs from the latest chat message
  const aiSearchedAgentIds = useMemo(() => {
    // Accept both possible keys coming from the assistant message:
    // `filteredAgentIds` (camelCase) or `filtered_agents` (snake_case).
    const latestMessageWithAgents = messages
      .filter((msg: any) => {
        if (msg.role !== "assistant") return false;
        const hasCamel = Array.isArray(msg.filteredAgentIds) && msg.filteredAgentIds.length > 0;
        const hasSnake = Array.isArray(msg.filtered_agents) && msg.filtered_agents.length > 0;
        return hasCamel || hasSnake;
      })
      .slice(-1)[0] as any | undefined;

    if (!latestMessageWithAgents) return null;

    const ids: string[] = latestMessageWithAgents.filteredAgentIds || latestMessageWithAgents.filtered_agents || [];
    // Deduplicate while preserving order
    return Array.from(new Set(ids));
  }, [messages]);

  // Helper function to apply manual filters to agents
  const applyManualFilters = (agentList: Agent[]) => {
    let filtered = agentList;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(agent =>
        agent.title.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tags.some(tag => tag.toLowerCase().includes(q)) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(q)) ||
        agent.providers.some(prov => prov.toLowerCase().includes(q))
      );
    }

    if (capabilityFilter !== "All") {
      filtered = filtered.filter(agent =>
        agent.valueProposition === capabilityFilter
      );
    }

    if (byCapabilityFilter.length > 0) {
      filtered = filtered.filter(agent =>
        byCapabilityFilter.some(filter => agent.capabilities.includes(filter))
      );
    }

    if (deploymentFilter && deploymentFilter !== "All") {
      filtered = filtered.filter(agent =>
        agent.deploymentType === deploymentFilter
      );
    }

    if (personaFilter.length > 0) {
      filtered = filtered.filter(agent =>
        personaFilter.includes(agent.persona)
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(agent => favorites.includes(agent.id));
    }

    // Wishlist filter - filter by selected wishlist
    if (selectedWishlistId) {
      const selectedWishlist = wishlists.find(w => w.id === selectedWishlistId);
      if (selectedWishlist) {
        filtered = filtered.filter(agent => selectedWishlist.agents.includes(agent.id));
      }
    }

    // Category tag filter (All Agents section)
    if (selectedCategoryTag) {
      filtered = filtered.filter(agent =>
        agent.tags.some(t => t.trim() === selectedCategoryTag) ||
        agent.capabilities.some(c => c.trim() === selectedCategoryTag)
      );
    }

    return filtered;
  };

  // Helper function to apply manual filters to models
  const applyModelFilters = (modelList: Model[]) => {
    let filtered = modelList;

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(model =>
        model.title.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q) ||
        model.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Note: Models don't have provider, capability, or persona filters
    // But we keep the function structure for consistency

    return filtered;
  };

  // AI searched agents (filtered by manual filters)
  const aiSearchedAgents = useMemo(() => {
    if (!aiSearchedAgentIds) return [];

    // Preserve the order from aiSearchedAgentIds and avoid duplicate agent objects
    const idSet = new Set(aiSearchedAgentIds);
    const uniqueAgentsMap = new Map<string, Agent>();
    agents.forEach(agent => {
      if (idSet.has(agent.id) && !uniqueAgentsMap.has(agent.id)) {
        uniqueAgentsMap.set(agent.id, agent);
      }
    });

    const aiAgents = Array.from(uniqueAgentsMap.values());
    const filtered = applyManualFilters(aiAgents);
    // Sort by agents_ordering to maintain ordering where present
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, aiSearchedAgentIds, search, capabilityFilter, byCapabilityFilter, deploymentFilter, personaFilter]);

  // All agents (filtered by manual filters)
  const allFilteredAgents = useMemo(() => {
    // Filter by agent ID from URL parameter (highest priority)
    if (agentIdFromUrl) {
      return agents.filter(agent => agent.id === agentIdFromUrl);
    }

    // When AI search results are active, exclude those agents from the main list
    const baseList = (aiSearchedAgentIds && aiSearchedAgentIds.length > 0)
      ? agents.filter(a => !aiSearchedAgentIds.includes(a.id))
      : agents;

    const filtered = applyManualFilters(baseList);
    // Sort by agents_ordering (already sorted in fetchData, but re-sort after filtering to maintain order)
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, search, capabilityFilter, byCapabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl, aiSearchedAgentIds, showFavoritesOnly, favorites, selectedWishlistId, wishlists, selectedCategoryTag]);

  // Sorted list for All Agents (Recommended = order from API, A-Z = by title)
  const sortedFilteredAgents = useMemo(() => {
    if (sortBy === "A-Z") {
      return [...allFilteredAgents].sort((a, b) => a.title.localeCompare(b.title));
    }
    return allFilteredAgents;
  }, [allFilteredAgents, sortBy]);

  const aiTotalPages = Math.max(1, Math.ceil(aiSearchedAgents.length / PAGE_SIZE));
  const totalPages = Math.max(1, Math.ceil(sortedFilteredAgents.length / PAGE_SIZE));

  const paginatedAiAgents = useMemo(() => {
    const start = (aiCurrentPage - 1) * PAGE_SIZE;
    return aiSearchedAgents.slice(start, start + PAGE_SIZE);
  }, [aiSearchedAgents, aiCurrentPage, PAGE_SIZE]);

  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedFilteredAgents.slice(start, start + PAGE_SIZE);
  }, [sortedFilteredAgents, currentPage, PAGE_SIZE]);

  // Filtered models
  const filteredModels = useMemo(() => {
    return applyModelFilters(models);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, search]);

  const modelsTotalPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE));
  const [modelsCurrentPage, setModelsCurrentPage] = useState(1);

  const paginatedModels = useMemo(() => {
    const start = (modelsCurrentPage - 1) * PAGE_SIZE;
    return filteredModels.slice(start, start + PAGE_SIZE);
  }, [filteredModels, modelsCurrentPage, PAGE_SIZE]);

  useEffect(() => {
    setModelsCurrentPage(1);
  }, [search, selectedCapability]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE));
    if (modelsCurrentPage > maxPages) {
      setModelsCurrentPage(maxPages);
    }
  }, [filteredModels.length, modelsCurrentPage, PAGE_SIZE]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, capabilityFilter, byCapabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl, selectedCapability, selectedCategoryTag, sortBy]);

  useEffect(() => {
    setAiCurrentPage(1);
  }, [aiSearchedAgentIds, search, capabilityFilter, byCapabilityFilter, deploymentFilter, personaFilter, selectedCapability]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(sortedFilteredAgents.length / PAGE_SIZE));
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
  }, [sortedFilteredAgents.length, currentPage, PAGE_SIZE]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(aiSearchedAgents.length / PAGE_SIZE));
    if (aiCurrentPage > maxPages) {
      setAiCurrentPage(maxPages);
    }
  }, [aiSearchedAgents.length, aiCurrentPage, PAGE_SIZE]);

  // Mouse tracking for radial hover background effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (pageContainerRef.current) {
        const rect = pageContainerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Use requestAnimationFrame for smooth updates
        requestAnimationFrame(() => {
          setMousePosition({ x, y });
        });
      }
    };

    const container = pageContainerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove, { passive: true });
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  // Handle entering chat mode
  const handleEnterChat = (message: string) => {
    // Navigate to chat route
    if (message.trim()) {
      // Store message in sessionStorage to send after navigation
      sessionStorage.setItem('pendingChatMessage', message.trim());
    }
    router.push('/agents/chat');
  }

  const renderPaginationControls = (
    current: number,
    total: number,
    onChange: (page: number) => void
  ) => {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, idx) => idx + 1);
    return (
      <div className="mt-10 flex items-center justify-center gap-2" style={{ marginBottom: "260px" }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="pagination-button text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed px-2"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              className={`pagination-button text-sm px-2 py-1 min-w-[32px] ${page === current
                ? "text-gray-900 font-medium"
                : "text-gray-600 hover:text-gray-900"
                }`}
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="pagination-button text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed px-2"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        ref={pageContainerRef}
        className="flex flex-col relative"
        style={{
          scrollBehavior: "smooth",
          minHeight: '100vh',
        }}
      >
        {/* Cursor-based dot pattern with radial gradient reveal */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: 'hidden',
          }}
        >
          {/* Dot pattern visible only on hover near cursor */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle 5px, rgba(147, 51, 234, 0.4) 2px, transparent 2px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0',
              backgroundRepeat: 'repeat',
              maskImage: `radial-gradient(circle 230px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 50%, transparent 65%)`,
              WebkitMaskImage: `radial-gradient(circle 230px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 50%, transparent 65%)`,
              transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out',
              willChange: 'mask-image',
            }}
          />
        </div>

        {/* Content wrapper with higher z-index */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <>
            {/* Hero Section — content aligned closer to top below header */}
            <section
              className="fade-in-section flex items-center justify-center"
              style={{
                transform: "translateZ(0)",
                willChange: "scroll-position",
                contain: "layout style paint",
                minHeight: "100svh",
                paddingTop: "clamp(54px, 4vh, 54px)",
                paddingBottom: "80px",
                background: "linear-gradient(180deg, #B8E2F0 0%, #D0ECF5 18%, #E5F5FA 35%, #FFFFFF 55%, #FFFFFF 100%)",
              }}
            >
              <div className="w-full px-8 md:px-12 lg:px-16">
                <div className="mx-auto max-w-6xl text-center flex flex-col items-center">
                  {/* Chip: New + Introducing Tangram AI Store (reference pill style) */}
                  <div className="mt-2 md:mt-4 flex justify-center mb-4 md:mb-6">
                    <div
                      className="hero-chip-interactive inline-flex items-center scale-in overflow-hidden rounded-full cursor-default"
                      style={{
                        background: "#EFEFF4",
                        border: "none",
                        padding: "6px 6px 6px 6px",
                        borderRadius: "9999px",
                      }}
                    >
                      <span
                        style={{
                          width: "40.39px",
                          height: "26px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#4285F4",
                          borderRadius: "9999px",
                          opacity: 1,
                          marginRight: "10px",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "11.4px",
                          lineHeight: "18px",
                          letterSpacing: "0%",
                          textAlign: "center",
                          verticalAlign: "middle",
                          color: "#EFF6FF",
                        }}
                      >
                        New
                      </span>
                      <span
                        style={{
                          padding: "5px 14px 6px 0",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "12.9px",
                          lineHeight: "21px",
                          letterSpacing: "0%",
                          textAlign: "center",
                          verticalAlign: "middle",
                          color: "#1C1C1C",
                        }}
                      >
                        Introducing Tangram AI Store
                      </span>
                    </div>
                  </div>

                  {/* Main title */}
                  <h1
                    className="mb-3 text-center max-w-4xl mx-auto"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "42px",
                      lineHeight: "54px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      background: "linear-gradient(90deg, #091917 0%, #2E7F75 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      color: "transparent",
                    }}
                  >
                    Ready-to-Use 200+ Powerful AI
                    <br />
                    agents built for real work.
                  </h1>

                  {/* Subtitle */}
                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "18.3px",
                      lineHeight: "25px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#1C1C1C",
                      marginBottom: "48px",
                    }}
                  >
                    Discover. Try. Deploy.
                  </p>

                  {/* Search bar */}
                  <div className="hero-search-interactive flex w-full justify-center scale-in mb-6">
                    <div className="w-full max-w-5xl" style={{ willChange: "transform" }}>
                      <AgentSearchChat
                        externalValue={agentSearchChatValue}
                        onExternalValueChange={setAgentSearchChatValue}
                        onEnterChat={handleEnterChat}
                        variant="hero"
                        placeholder="Describe your requirements and instantly discover enterprise AI agents built for that outcome"
                      />
                    </div>
                  </div>

                  {/* Decorative: data-flow image — top 10% tucked under search bar */}
                  <div
                    className="flex justify-center mb-8 w-full"
                    style={{
                      minHeight: "120px",
                      marginTop: "calc(-1 * (min(520px, 100%) * 280 / 600 * 0.1))",
                    }}
                  >
                    <Image
                      src="/img/hero-data-flow.png"
                      alt=""
                      role="presentation"
                      width={600}
                      height={280}
                      className="object-contain w-full max-w-[520px] h-auto"
                      priority
                    />
                  </div>

                  {/* Scroll to second section: two chevrons + label (reference) */}
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("browse-agents-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      else window.scrollBy({ top: 550, behavior: "smooth" });
                    }}
                    className="group flex flex-col items-center gap-2.5 cursor-pointer border-0 bg-transparent p-0"
                    style={{
                      marginTop: "-72px",
                      opacity: showScrollIndicator ? 1 : 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: showScrollIndicator ? "auto" : "none",
                    }}
                    aria-label="Explore Our agent Catalogue"
                  >
                    <div className={`flex flex-col items-center gap-0.5 ${showScrollIndicator ? "scroll-indicator-bounce" : ""}`} style={{ color: "#374151" }}>
                      <ChevronDown size={24} strokeWidth={2.5} aria-hidden />
                      <ChevronDown size={24} strokeWidth={2.5} aria-hidden />
                    </div>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        color: "#374151",
                        letterSpacing: "0%",
                      }}
                    >
                      Explore Our agent Catalogue
                    </span>
                  </button>

                </div>
              </div>
            </section>

            {/* Browse 200+ Agents & Agentic Solutions — pink gradient + carousel */}
            {(() => {
              const normalize = (s: string) => s.trim().toLowerCase();
              const browseCards = BROWSE_CARDS_DATA.map((staticCard) => {
                const fromApi = agents.find(
                  (a) => normalize(a.title) === normalize(staticCard.title)
                );
                if (fromApi) {
                  return {
                    id: fromApi.id,
                    title: fromApi.title,
                    description: fromApi.description,
                    image: staticCard.image,
                    background: staticCard.background,
                  };
                }
                return { ...staticCard };
              });
              const cardWidth = 560;
              const cardHeight = 270;
              const gap = 24;
              const goToPage = (page: number) => {
                const p = Math.max(0, Math.min(page, BROWSE_CAROUSEL_PAGES - 1));
                setBrowseCarouselPage(p);
                const el = browseCarouselRef.current;
                if (el) el.scrollTo({ left: p * (cardWidth + gap), behavior: "smooth" });
              };
              return (
                <section
                  id="browse-agents-section"
                  className="w-full bg-white"
                  style={{
                    paddingTop: "64px",
                    paddingBottom: "80px",
                  }}
                >
                  <div className="mx-auto w-full" style={{ maxWidth: "1360px", paddingLeft: "24px", paddingRight: "24px" }}>
                    <div className="text-center mb-12">
                      <h2
                        className="mb-4 text-center"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "42px",
                          lineHeight: "54px",
                          letterSpacing: "0%",
                          textAlign: "center",
                          background: "linear-gradient(90deg, #091917 0%, #2E7F75 100%)",
                          WebkitBackgroundClip: "text",
                          backgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          color: "transparent",
                        }}
                      >
                        Browse through our growing{" "}
                        <span>200+ Agents & Agentic Solutions</span>
                      </h2>
                      <p
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0.17px",
                          textAlign: "center",
                          color: "#000000DE",
                          maxWidth: "640px",
                          margin: "0 auto",
                        }}
                      >
                        Explore AI-powered agents built to automate workflows — helping your team work smarter and faster every day.
                      </p>
                    </div>

                    <div className="relative">
                      <div
                        ref={browseCarouselRef}
                        className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-2 scrollbar-hide"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                          scrollSnapType: "x mandatory",
                        }}
                        onScroll={() => {
                          const el = browseCarouselRef.current;
                          if (!el) return;
                          const page = Math.round(el.scrollLeft / (cardWidth + gap));
                          setBrowseCarouselPage(Math.min(page, BROWSE_CAROUSEL_PAGES - 1));
                        }}
                      >
                        {browseCards.map((card) => (
                          <div
                            key={card.id}
                            className="browse-card-interactive flex-shrink-0 overflow-hidden"
                            style={{
                              width: cardWidth,
                              height: cardHeight,
                              borderRadius: "24px",
                              scrollSnapAlign: "start",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                              background: card.background,
                              opacity: 1,
                            }}
                          >
                            <Link
                              href={`/agents/${card.id}`}
                              className="block p-6 h-full min-h-0 flex flex-col"
                              style={{ textDecoration: "none" }}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div
                                  className="min-w-0"
                                  style={{
                                    width: 255,
                                    height: 106,
                                    opacity: 1,
                                  }}
                                >
                                  <h3
                                    className="mb-2 align-middle"
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 500,
                                      fontStyle: "normal",
                                      fontSize: "24px",
                                      lineHeight: "32px",
                                      letterSpacing: "0.17px",
                                      verticalAlign: "middle",
                                      color: "#FFFFFFDE",
                                      marginTop: 100,
                                    }}
                                  >
                                    {card.title}
                                  </h3>
                                  <p
                                    className="line-clamp-2"
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "14px",
                                      lineHeight: "18px",
                                      letterSpacing: "0.17px",
                                      color: "#FFFFFFDE",
                                      overflow: "hidden",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical" as const,
                                    }}
                                  >
                                    {card.description}
                                  </p>
                                  <div
                                    className="mt-3 inline-flex items-center gap-1.5"
                                    style={{
                                      fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "14px",
                                      lineHeight: "20px",
                                      letterSpacing: "0%",
                                      verticalAlign: "middle",
                                      color: "#FFFFFF",
                                      alignSelf: "flex-start",
                                    }}
                                  >
                                    Know More
                                    <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden style={{ width: 16, height: 16, opacity: 1, marginTop: 2 }} />
                                  </div>
                                </div>
                                <div
                                  className="flex-shrink-0 relative overflow-hidden"
                                  style={{
                                    width: 199,
                                    height: 246,
                                    borderRadius: "18px",
                                    opacity: 1,
                                  }}
                                >
                                  <Image
                                    src={card.image}
                                    alt=""
                                    role="presentation"
                                    fill
                                    className="object-contain object-right rounded-[18px]"
                                    style={{ opacity: 1 }}
                                  />
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>

                      <div
                        className="flex items-center justify-end gap-2 mt-6"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        <span
                          className="text-sm"
                          style={{ color: "#6B7280" }}
                        >
                          [{browseCarouselPage + 1}/{BROWSE_CAROUSEL_PAGES}]
                        </span>
                        <button
                          type="button"
                          onClick={() => goToPage(browseCarouselPage - 1)}
                          disabled={browseCarouselPage === 0}
                          className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ color: "#6B7280" }}
                          aria-label="Previous"
                        >
                          <span style={{ fontSize: "16px", lineHeight: 1 }}>&lt;</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => goToPage(browseCarouselPage + 1)}
                          disabled={browseCarouselPage >= BROWSE_CAROUSEL_PAGES - 1}
                          className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                          style={{ color: "#4B5563" }}
                          aria-label="Next"
                        >
                          <span style={{ fontSize: "16px", lineHeight: 1 }}>&gt;</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Browse by Industries & Sectors — grid of industry cards */}
            <section className="w-full bg-white" style={{ paddingTop: "64px", paddingBottom: "80px" }}>
              <div className="mx-auto w-full" style={{ maxWidth: "1360px", paddingLeft: "24px", paddingRight: "24px" }}>
                <div className="text-center mb-12">
                  <h2
                    className="mb-4 text-center"
                    style={{
                      fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                      fontWeight: 300,
                      fontStyle: "normal",
                      fontSize: "28px",
                      lineHeight: "40px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      background: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Browse by Industries & Sectors
                  </h2>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      textAlign: "center",
                      color: "#091917",
                      maxWidth: "640px",
                      margin: "0 auto",
                    }}
                  >
                    Streamline your non-performing asset workflow from email intake to valuation. Reduce processing.
                  </p>
                </div>

                <div
                  className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {[
                    {
                      id: "banking",
                      title: "AI for Banking",
                      description: "Conversational AI assistant tailored for banking, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: Landmark,
                      gradient: "linear-gradient(135deg, #FB923C 0%, #DC2626 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(251,146,60,0.12) 0%, rgba(220,38,38,0.06) 40%, transparent 70%)",
                      titleColor: "#EA580C",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #FFF7ED 97.78%)",
                      comingSoon: false,
                    },
                    {
                      id: "insurance",
                      title: "AI for Insurance",
                      description: "Conversational AI assistant tailored for insurance, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: Activity,
                      gradient: "linear-gradient(135deg, #86EFAC 0%, #15803D 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(21,128,61,0.06) 40%, transparent 70%)",
                      titleColor: "#15803D",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #F0FDF4 97.78%)",
                      comingSoon: true,
                    },
                    {
                      id: "healthcare",
                      title: "AI for Healthcare",
                      description: "Conversational AI assistant tailored for healthcare, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: HeartHandshake,
                      gradient: "linear-gradient(135deg, #F9A8D4 0%, #BE185D 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(244,114,182,0.12) 0%, rgba(190,24,93,0.06) 40%, transparent 70%)",
                      titleColor: "#BE185D",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #FDF2F8 97.78%)",
                      comingSoon: true,
                    },
                    {
                      id: "retail",
                      title: "AI for Retail",
                      description: "Conversational AI assistant tailored for retail, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: ShoppingBag,
                      gradient: "linear-gradient(135deg, #C4B5FD 0%, #6D28D9 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(196,181,253,0.12) 0%, rgba(109,40,217,0.06) 40%, transparent 70%)",
                      titleColor: "#6D28D9",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #F5F3FF 97.78%)",
                      comingSoon: true,
                    },
                    {
                      id: "education",
                      title: "AI for Educations",
                      description: "Conversational AI assistant tailored for education, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: GraduationCap,
                      gradient: "linear-gradient(135deg, #F472B6 0%, #9D174D 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(244,114,182,0.1) 0%, rgba(157,23,77,0.06) 40%, transparent 70%)",
                      titleColor: "#9D174D",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #FDF2F8 97.78%)",
                      comingSoon: true,
                    },
                    {
                      id: "government",
                      title: "AI for Government",
                      description: "Conversational AI assistant tailored for government, enabling seamless customer interactions through chat, voice and web with rapid deployment.",
                      icon: Zap,
                      gradient: "linear-gradient(135deg, #93C5FD 0%, #1D4ED8 100%)",
                      gradientFromCorner: "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(29,78,216,0.06) 40%, transparent 70%)",
                      titleColor: "#1D4ED8",
                      cardBackground: "linear-gradient(287.29deg, #F8F8F8 62.43%, #EFF6FF 97.78%)",
                      comingSoon: true,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isComingSoon = item.comingSoon === true;
                    return (
                      <Link
                        key={item.id}
                        href={isComingSoon ? "#" : `/industry/${item.id}`}
                        onClick={isComingSoon ? (e) => e.preventDefault() : undefined}
                        className={`industry-card-interactive block relative overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 ${isComingSoon ? "cursor-not-allowed" : ""}`}
                        style={{
                          width: "100%",
                          minHeight: "194px",
                          borderRadius: "8px",
                          background: isComingSoon ? "linear-gradient(287.29deg, #F0F0F0 62.43%, #E5E5E5 97.78%)" : item.cardBackground,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                          textDecoration: "none",
                          opacity: isComingSoon ? 0.85 : 1,
                        }}
                      >
                        {isComingSoon && (
                          <span
                            className="absolute top-3 right-3 z-10"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "11px",
                              lineHeight: "16px",
                              letterSpacing: "0.5px",
                              color: "#6B7280",
                              background: "#FFFFFF",
                              border: "1px solid #D1D5DB",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                            }}
                          >
                            Coming Soon
                          </span>
                        )}
                        <div className="relative p-6">
                          <div className="flex justify-between items-start">
                            <div
                              className="flex items-center justify-center rounded-xl flex-shrink-0"
                              style={{
                                width: "36px",
                                height: "36px",
                              }}
                            >
                              <Icon size={22} strokeWidth={2} style={{ color: isComingSoon ? "#9CA3AF" : item.titleColor }} />
                            </div>
                            {!isComingSoon && (
                              <ArrowUpRight
                                size={18}
                                className="flex-shrink-0 text-gray-400"
                                strokeWidth={2}
                                style={{ marginTop: "2px" }}
                              />
                            )}
                          </div>
                          <h3
                            className="mt-4"
                            style={{
                              fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "16px",
                              lineHeight: "100%",
                              letterSpacing: "0%",
                              verticalAlign: "middle",
                              color: isComingSoon ? "#9CA3AF" : item.titleColor,
                            }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="mt-2"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "20px",
                              letterSpacing: "0%",
                              color: isComingSoon ? "#9CA3AF" : "#475467",
                            }}
                          >
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Unified Search + Filters Bar with Home search chat */}
            <section className="bg-white w-full section-fade-in">
              {/* AI Search Results Section */}
              {aiSearchedAgentIds && aiSearchedAgentIds.length > 0 && (
                <div className="w-full" style={{ backgroundColor: "#F8F8F8", paddingTop: "32px", paddingBottom: "32px" }}>
                  <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                    <div className="mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Search Results</h2>
                          <p className="text-sm text-muted-foreground">
                            Showing {aiSearchedAgents.length} of {aiSearchedAgentIds.length} AI-recommended agents
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            // Clear the chat to remove AI search results
                            const { clearChat } = useChatStore.getState();
                            clearChat();
                          }}
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            color: "#344054",
                            background: "transparent",
                            border: "1px solid #E5E7EB",
                            borderRadius: "4px",
                            cursor: "pointer",
                            padding: "8px 16px",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#344054";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#E5E7EB";
                          }}
                        >
                          Clear AI Search
                        </button>
                      </div>

                      <div
                        className="grid gap-4 md:gap-6 lg:gap-10"
                        style={{
                          gridTemplateColumns: "repeat(3, 1fr)",
                        }}
                      >
                        {paginatedAiAgents.map((agent, index) => (
                          <div key={agent.id} className="agent-card-stagger">
                            <AgentCard {...agent} assetType={agent.assetType} demoPreview={agent.demoPreview} />
                          </div>
                        ))}
                      </div>

                      {aiSearchedAgents.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-muted-foreground">No AI-recommended agents match your current filters.</div>
                        </div>
                      )}

                      {aiTotalPages > 1 && renderPaginationControls(aiCurrentPage, aiTotalPages, setAiCurrentPage)}
                    </div>
                  </div>
                </div>
              )}

              {/* All Agents Section - Header (reference style) */}
              <div className="w-full" style={{ paddingTop: "48px", paddingBottom: "16px", backgroundColor: "#FFFFFF" }}>
                <div className="w-full mx-auto text-center" style={{ maxWidth: "1360px", paddingLeft: "24px", paddingRight: "24px" }}>
                  <h2
                    className="text-center"
                    style={{
                      fontFamily: "Geist, var(--font-geist-sans), sans-serif",
                      fontWeight: 300,
                      fontStyle: "normal",
                      fontSize: "28px",
                      lineHeight: "40px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      marginBottom: "8px",
                      background: "linear-gradient(90deg, #0023F6 0%, #008F59 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    All Agents
                  </h2>
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "24px",
                      letterSpacing: "0px",
                      textAlign: "center",
                      color: "#091917",
                      maxWidth: "560px",
                      margin: "0 auto",
                    }}
                  >
                    Streamline your non-performing asset workflow from email intake to valuation. Reduce processing.
                  </p>
                </div>
              </div>

              {/* Search + Category Tags + Recommended */}
              <div id="agent-filters" className="w-full" style={{ paddingBottom: "24px", backgroundColor: "#FFFFFF" }}>
                <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "24px", paddingRight: "24px" }}>
                  {/* Search bar + Recommended on one row (reference layout) */}
                  <div className="flex items-center gap-3 mb-6 w-full">
                    <div
                      className="relative flex-1 min-w-0 rounded-lg overflow-hidden"
                      style={{
                        height: "40px",
                        borderRadius: "8px",
                        background: "#F8F8F8",
                      }}
                    >
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: "#9CA3AF" }} />
                      <input
                        type="text"
                        placeholder="Search agents..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-full pl-10 pr-4 bg-transparent outline-none placeholder:text-[#828282]"
                        style={{
                          fontFamily: "Arial, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#828282",
                        }}
                      />
                    </div>
                    <div className="relative flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setRecommendedDropdownOpen(!recommendedDropdownOpen)}
                        className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 h-10 px-4"
                        style={{ fontFamily: "Poppins, sans-serif", minHeight: "40px" }}
                      >
                        {sortBy} <ChevronDown size={16} />
                      </button>
                      {recommendedDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setRecommendedDropdownOpen(false)} aria-hidden />
                          <div className="absolute right-0 top-full mt-1 py-1 rounded-lg border border-gray-200 bg-white shadow-lg z-20 min-w-[140px]">
                            <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ fontFamily: "Poppins, sans-serif" }} onClick={() => { setSortBy("Recommended"); setRecommendedDropdownOpen(false); }}>Recommended</button>
                            <button type="button" className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50" style={{ fontFamily: "Poppins, sans-serif" }} onClick={() => { setSortBy("A-Z"); setRecommendedDropdownOpen(false); }}>A-Z</button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 justify-between">
                    <div className="flex gap-[10px] overflow-x-auto scrollbar-hide pb-1" style={{ flex: "1 1 auto", minWidth: 0 }}>
                      {allCategoryTags.slice(0, 12).map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedCategoryTag(selectedCategoryTag === tag ? null : tag)}
                          className="flex-shrink-0 text-sm font-medium transition-colors rounded-full"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            paddingTop: "11px",
                            paddingRight: "18px",
                            paddingBottom: "11px",
                            paddingLeft: "18px",
                            border: "1px solid #EAECF0",
                            borderRadius: "999px",
                            backgroundColor: selectedCategoryTag === tag ? "#1E3A8A" : "#FFFFFF",
                            color: selectedCategoryTag === tag ? "#FFFFFF" : "#374151",
                          }}
                        >
                          {tag}
                        </button>
                      ))}
                      {allCategoryTags.length > 12 && (
                        <span className="flex-shrink-0 px-4 py-2 text-sm text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>More...</span>
                      )}
                      {/* Filters button hidden for now – not required */}
                      <button
                        type="button"
                        onClick={() => setIsFilterPanelOpen(true)}
                        className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hidden"
                        style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#F3F4F6", color: "#4B5563" }}
                      >
                        <Filter className="h-3.5 w-3.5" />
                        Filters
                        {(byCapabilityFilter.length > 0 || personaFilter.length > 0) && (
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#EF4444" }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Sidebar */}
              <FilterSidebar
                isOpen={isFilterPanelOpen}
                onClose={() => setIsFilterPanelOpen(false)}
                byCapabilityFilter={byCapabilityFilter}
                setByCapabilityFilter={setByCapabilityFilter}
                allByCapabilities={allByCapabilities}
                byCapabilityCounts={byCapabilityCounts}
                personaFilter={personaFilter}
                setPersonaFilter={setPersonaFilter}
                allPersonas={allPersonas}
                agents={agents}
                onClearAll={() => {
                  setCapabilityFilter("All");
                  setByCapabilityFilter([]);
                  setPersonaFilter([]);
                  setSelectedCapability("All");
                  setSearch("");
                  setShowFavoritesOnly(false);
                  setSelectedWishlistId(null);
                  setSelectedCategoryTag(null);
                }}
                hasActiveFilters={
                  capabilityFilter !== "All" ||
                  byCapabilityFilter.length > 0 ||
                  personaFilter.length > 0 ||
                  search !== "" ||
                  showFavoritesOnly ||
                  selectedWishlistId !== null ||
                  selectedCategoryTag !== null
                }
                showFavoritesOnly={showFavoritesOnly}
                setShowFavoritesOnly={setShowFavoritesOnly}
                favoritesCount={favorites.length}
                selectedWishlistId={selectedWishlistId}
                setSelectedWishlistId={setSelectedWishlistId}
              />

              {/* Agent Grid */}
              <div id="agent-cards" className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
                {loading && (
                  <div
                    className="grid gap-4 md:gap-6 lg:gap-10"
                    style={{
                      gridTemplateColumns: "repeat(3, 1fr)",
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, index) => (
                      <AgentCardSkeleton key={index} />
                    ))}
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <div className="text-red-600">{error}</div>
                  </div>
                )}

                {!loading && !error && (
                  <>
                    <div className={aiSearchedAgentIds && aiSearchedAgentIds.length > 0 ? "border-t pt-12" : ""}>
                      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {paginatedAgents.map((agent, index) => {
                          const isFirstCard = index === 0 && currentPage === 1;
                          const categoryLabel = agent.assetType === "Solution" ? "Agentic AI Solution" : agent.assetType === "Use case" || (agent as any).deploymentType === "Use case" ? "Agentic AI Use case" : "AI Agent";
                          const isUseCase = categoryLabel === "Agentic AI Use case";
                          return (
                            <Link
                              key={agent.id}
                              href={`/agents/${agent.id}`}
                              scroll
                              className="group block relative rounded-xl overflow-hidden transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                              style={{
                                width: "100%",
                                minHeight: "257px",
                                background: "#F5F5F5",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                                textDecoration: "none",
                              }}
                            >
                              {/* Gradient overlay visible only on hover — smooth transition */}
                              <div
                                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                                style={{
                                  background: "linear-gradient(132.48deg, #F7F7F7 60.17%, #FF757B 94.82%), linear-gradient(246.59deg, rgba(247, 247, 247, 0.6) 58.7%, rgba(255, 232, 232, 0.6) 99.81%)",
                                }}
                                aria-hidden
                              />
                              <div className="relative z-10 p-6 flex flex-col min-h-[257px]">
                                <div className="flex justify-between items-start">
                                  <span
                                    style={{
                                      fontFamily: "Inter, sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "13.3px",
                                      lineHeight: "14px",
                                      letterSpacing: "0.17px",
                                      verticalAlign: "middle",
                                      color: "rgba(0, 0, 0, 0.87)",
                                    }}
                                  >
                                    {categoryLabel}
                                  </span>
                                  <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "36px", height: "36px" }}>
                                    <img
                                      src="/img/agents/research-icon.png"
                                      alt=""
                                      width={28}
                                      height={28}
                                      className="object-contain"
                                    />
                                  </div>
                                </div>
                                {/* Middle block: title + description at bottom of block, just above BY CRAYON DATA */}
                                <div className="flex-1 flex flex-col justify-end min-h-0 mt-3">
                                  <h3
                                    className="transition-colors duration-300 ease-out"
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 400,
                                      fontStyle: "normal",
                                      fontSize: "24px",
                                      lineHeight: "32px",
                                      letterSpacing: "0.17px",
                                      color: "rgba(0, 0, 0, 0.87)",
                                    }}
                                  >
                                    {agent.title}
                                  </h3>
                                  {agent.description && (
                                    <p
                                      className="mt-2 line-clamp-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-300 ease-out"
                                      style={{
                                        fontFamily: "Inter, sans-serif",
                                        fontWeight: 400,
                                        fontStyle: "normal",
                                        fontSize: "12px",
                                        lineHeight: "18px",
                                        letterSpacing: "0%",
                                        color: "#475467",
                                      }}
                                    >
                                      {agent.description}
                                    </p>
                                  )}
                                </div>
                                {/* Fixed at bottom (reference non-hover state) */}
                                <p
                                  className="mt-auto pt-4 uppercase flex-shrink-0"
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 400,
                                    fontStyle: "normal",
                                    fontSize: "10px",
                                    lineHeight: "15px",
                                    letterSpacing: "0.5px",
                                    verticalAlign: "middle",
                                    textTransform: "uppercase",
                                    color: "rgba(0, 0, 0, 0.87)",
                                  }}
                                >
                                  BY CRAYON DATA
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {sortedFilteredAgents.length === 0 && (
                        <div className="text-center py-12">
                          <div className="text-muted-foreground" style={{ fontFamily: "Poppins, sans-serif" }}>No agents found matching your criteria.</div>
                        </div>
                      )}

                      {renderPaginationControls(currentPage, totalPages, setCurrentPage)}
                    </div>
                  </>
                )}
              </div>
            </section>
          </>
        </div>
      </div>

      {/* Floating Chat Indicator - Shows when chat is in progress - Fixed position in bottom right corner */}
      {/* Using Portal to render directly to body to avoid stacking context issues */}
      {isMounted && hasActiveChat && createPortal(
        <button
          onClick={() => router.push('/agents/chat')}
          className="group"
          aria-label="Continue chat conversation"
          style={{
            fontFamily: "Poppins, sans-serif",
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            pointerEvents: "auto",
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
            borderRadius: "100px",
          }}
        >
          <div
            className="relative flex items-center gap-2.5 px-4 py-2.5 transition-all duration-200"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "21px",
              letterSpacing: "0%",
              color: "#FFFFFF",
              background: "#6B7280",
              borderRadius: "100px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              boxSizing: "border-box",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#4B5563";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.3)";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6B7280";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* Chat icon */}
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image
                src="/chat_icon.png"
                alt="chat"
                fill
                className="object-contain filter brightness-0 invert"
              />
            </div>

            {/* Text */}
            <span style={{ fontFamily: "Poppins, sans-serif" }}>
              Continue Chat
            </span>

            {/* Message count badge */}
            {userMessageCount > 0 && (
              <div
                className="absolute -top-1.5 -right-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-semibold min-w-[18px] h-[18px] px-1.5"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "11px",
                  lineHeight: "1",
                }}
              >
                {userMessageCount}
              </div>
            )}
          </div>
        </button>,
        document.body
      )}
    </>

  );
}

