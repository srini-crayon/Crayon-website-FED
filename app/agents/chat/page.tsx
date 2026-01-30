"use client";

import { Button } from "../../../components/ui/button";
import { ArrowUp, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Sparkles, Trash2, PanelLeft, PanelLeftClose, MessageSquarePlus, Target, Zap, CheckCircle2, User, Building2, Bot, Map } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../../lib/store/chat.store";
import { useAuthStore } from "../../../lib/store/auth.store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { VoiceInputControls } from "../../../components/voice-input-controls";
import { formatTime, formatDateTime } from "../../../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { ThreadSidebar } from "../../../components/chat/thread-sidebar";


interface Agent {
  agent_id: string;
  agent_name: string;
  description?: string;
  by_capability?: string;
  by_persona?: string;
  by_value?: string;
  // New fields from API responses
  value_proposition?: string;
  key_features?: Array<{ title?: string; detail?: string }>;
  features?: string;
  service_provider?: string;
  asset_type?: string;
}

// Helper to split agent title/name like "CXO Concierge (ID: agent_004)"
// into a clean display name and an optional ID ("agent_004").
function parseAgentTitle(rawTitle: string): { name: string; idFromTitle?: string } {
  if (!rawTitle) return { name: "" };

  const match = rawTitle.match(/^(.*?)(\s*\(ID:\s*([^)]+)\))\s*$/i);
  if (match) {
    const name = match[1].trim();
    const idFromTitle = match[3].trim();
    return { name, idFromTitle };
  }

  return { name: rawTitle.trim() };
}

// Section Card Component for consistent styling - Modern ChatGPT-style card
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-gray-200 ${className}`}
      style={{
        fontFamily: "Poppins, sans-serif",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      {children}
    </div>
  );
}

// Utility function to extract intro text and agent markdown.
// Accepts either a raw markdown string OR a structured response object from the API.
function extractIntroAndAgentMarkdown(markdown: any): { introText: string; agentMarkdown: string } {
  if (markdown == null) return { introText: "", agentMarkdown: "" };

  // If it's already a string, use existing logic
  if (typeof markdown === 'string') {
    const headingPattern = /(\n\n|\n|^)###/;
    const match = markdown.match(headingPattern);
    if (match) {
      const splitIndex = (match.index || 0) + match[1].length;
      const introText = markdown.substring(0, splitIndex).trim();
      const agentMarkdown = markdown.substring(splitIndex).trim();
      return { introText, agentMarkdown };
    }
    return { introText: "", agentMarkdown: markdown };
  }

  // If it's an object that already contains markdown text or structured response
  if (typeof markdown === 'object') {
    // Case: top-level response_markdown
    if (typeof markdown.response_markdown === 'string') {
      return extractIntroAndAgentMarkdown(markdown.response_markdown);
    }

    // Case: nested under data.response or response
    const resp = markdown.data?.response || markdown.response || markdown.data || markdown;

    if (resp && typeof resp.response_markdown === 'string') {
      return extractIntroAndAgentMarkdown(resp.response_markdown);
    }

    // Build markdown from structured response (intro + agents list)
    let introText = '';
    let agentMarkdown = '';

    if (resp && typeof resp.intro === 'string') {
      introText = resp.intro.trim();
    }

    const agents = Array.isArray(resp.agents)
      ? resp.agents
      : Array.isArray(resp.response_agents)
        ? resp.response_agents
        : Array.isArray(resp.response?.agents)
          ? resp.response.agents
          : [];

    if (agents.length > 0) {
      const parts: string[] = [];
      agents.forEach((a: any, idx: number) => {
        const title = a.title || a.solution_name || a.agent_name || `Agent ${idx + 1}`;
        parts.push(`### ${idx + 1}. **${title}**`);
        if (a.description) {
          const desc = String(a.description).trim();
          parts.push(`- **Description**: ${desc}`);
        }
        if (a.value_proposition && String(a.value_proposition).trim() !== (a.description || '').trim()) {
          parts.push(`- **Value Proposition**: ${String(a.value_proposition).trim()}`);
        }

        // Normalize and include key/features from various API shapes
        const normalized = normalizeAgentFeatures(a);
        if (normalized.length > 0) {
          parts.push(`- **Key Features**:`);
          normalized.forEach((nf: string) => parts.push(`  - ${nf}`));
        }
        parts.push('');
      });
      agentMarkdown = parts.join('\n');
    }

    if (resp && typeof resp.cta === 'string' && resp.cta.trim()) {
      agentMarkdown = agentMarkdown + '\n' + resp.cta.trim();
    }

    return { introText, agentMarkdown };
  }

  // Fallback: stringify and re-run
  try {
    const text = String(markdown);
    return extractIntroAndAgentMarkdown(text);
  } catch (e) {
    return { introText: '', agentMarkdown: '' };
  }
}

// Utility function to remove label keys from markdown (e.g., "Description:", "Title:", "Subtitle:")
// This function removes labels but preserves their values
function removeMarkdownLabels(markdown: string, labelsToRemove: string[]): string {
  let cleaned = markdown;

  labelsToRemove.forEach(label => {
    // Handle various markdown formats:
    // 1. Bold labels: **Description:** or **Description**:
    // 2. Plain text labels: Description:
    // 3. In headings: ### Description:
    // 4. With markdown emphasis: *Description:*
    // 5. In paragraphs: Description: text here

    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Pattern 1: Remove bold labels with colon (e.g., **Description:** or **Description**:)
    cleaned = cleaned.replace(new RegExp(`\\*\\*${escapedLabel}\\*\\*\\s*:?\\s*`, 'gi'), '');

    // Pattern 2: Remove plain labels with colon at start of line (e.g., Description:)
    cleaned = cleaned.replace(new RegExp(`^${escapedLabel}\\s*:?\\s*`, 'gim'), '');

    // Pattern 3: Remove labels in headings (e.g., ### Description: or ### **Description:**)
    cleaned = cleaned.replace(new RegExp(`(#{1,6})\\s+\\*\\*${escapedLabel}\\*\\*\\s*:?\\s*`, 'gi'), '$1 ');
    cleaned = cleaned.replace(new RegExp(`(#{1,6})\\s+${escapedLabel}\\s*:?\\s*`, 'gi'), '$1 ');

    // Pattern 4: Remove labels with markdown emphasis (e.g., *Description:*)
    cleaned = cleaned.replace(new RegExp(`\\*${escapedLabel}\\*\\s*:?\\s*`, 'gi'), '');

    // Pattern 5: Remove labels in list items (e.g., - Description: or • Description:)
    cleaned = cleaned.replace(new RegExp(`^[-*•]\\s+${escapedLabel}\\s*:?\\s*`, 'gim'), '');

    // Pattern 6: Remove labels in paragraphs after newline or at start (e.g., "\nDescription: some text" or "Description: some text")
    // Only match when label is at start of line or after whitespace/newline
    cleaned = cleaned.replace(new RegExp(`(^|\\n|\\r\\n)\\s*${escapedLabel}\\s*:?\\s*`, 'gim'), '$1');

    // Pattern 7: Remove labels that appear at the start of a line with optional whitespace (redundant but kept for safety)
    cleaned = cleaned.replace(new RegExp(`^\\s*${escapedLabel}\\s*:?\\s*`, 'gim'), '');
  });

  // Clean up extra whitespace and empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}

// Utility function to clean text by removing special characters
function cleanText(text: string): string {
  if (!text) return '';

  return text
    .trim()
    // Remove all asterisks (markdown bold) - all instances, anywhere
    .replace(/\*+/g, '')
    // Remove quotes at start and end (multiple quotes, both single and double)
    .replace(/^["']+|["']+$/g, '')
    .replace(/^["']|["']$/g, '')
    // Remove all quotes from anywhere in the text
    .replace(/["']/g, '')
    // Remove parentheses at start and end (but keep content inside)
    .replace(/^\(+|\)+$/g, '')
    // Remove all parentheses from anywhere in the text
    .replace(/[()]/g, '')
    // Remove any orphaned fragments like "** " or " **"
    .replace(/\*\*\s*/g, '')
    .replace(/\s*\*\*/g, '')
    // Remove any trailing colons that might be left
    .replace(/:\s*$/, '')
    .trim();
}

// Utility function to extract plain text from React children (handles strings, arrays, and React elements)
function extractTextFromChildren(children: any): string {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(child => extractTextFromChildren(child)).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren(children.props.children);
  }
  return '';
}

// Helper: detect structured response object from backend
function getStructuredResponse(input: any) {
  if (!input) return null;
  if (typeof input === 'object') {
    const resp = input.data?.response || input.response || input.data || input;
    if (resp && (resp.intro || Array.isArray(resp.agents) || Array.isArray(resp.response_agents) || resp.response_markdown)) {
      return resp;
    }
  }
  return null;
}

// Normalize different shapes of features from API into an array of strings
function normalizeAgentFeatures(a: any): string[] {
  if (!a) return [];

  // 1) structured key_features: [{title, detail}]
  if (Array.isArray(a.key_features) && a.key_features.length > 0) {
    return a.key_features
      .filter((k: any) => {
        const title = String(k?.title || k?.name || '').trim();
        const detail = String(k?.detail || k?.description || '').trim();
        const tLower = title.toLowerCase();
        // Skip generic placeholder entries like "Features" with no detail, or markers like "--"
        if ((!detail && (tLower === 'features' || tLower === '--' || tLower === '-')) || title === '') return false;
        return true;
      })
      .map((k: any) => {
        const title = k?.title || k?.name || '';
        const detail = k?.detail || k?.description || '';
        const t = String(title || '').trim();
        const d = String(detail || '').trim();
        return t && d ? `${t}: ${d}` : (t || d);
      })
      .filter(Boolean);
  }

  // 2) features as array of objects with name/detail
  if (Array.isArray(a.features) && a.features.length > 0) {
    return a.features
      .filter((f: any) => {
        const name = String(f?.name || f?.title || '').trim();
        const detail = String(f?.detail || f?.description || '').trim();
        if ((!detail && (name === '' || name === '--' || name === '-'))) return false;
        return true;
      })
      .map((f: any) => {
        const name = f?.name || f?.title || '';
        const detail = f?.detail || f?.description || '';
        const n = String(name || '').trim();
        const d = String(detail || '').trim();
        return n && d ? `${n}: ${d}` : (n || d);
      }).filter(Boolean);
  }

  // 3) features as string (semicolon / newline separated)
  if (typeof a.features === 'string' && a.features.trim() && a.features.toLowerCase() !== 'na') {
    return a.features
      .split(/[;\n]+/)
      .map((s: string) => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
      .filter(Boolean);
  }

  // 4) fallback: description only (value_proposition is handled separately)
  const out: string[] = [];
  if (a.description && String(a.description).trim()) out.push(String(a.description).trim());
  // Note: value_proposition is NOT added here - it's rendered as a separate section
  return out;
}

// Component: render structured response as card(s)
function StructuredResponseRenderer({ resp }: { resp: any }) {
  if (!resp) return null;

  const agentsList = Array.isArray(resp.agents)
    ? resp.agents
    : Array.isArray(resp.response_agents)
      ? resp.response_agents
      : Array.isArray(resp.response?.agents)
        ? resp.response.agents
        : [];

  // Normalize intro / cta strings
  const introText =
    typeof resp.intro === "string" ? resp.intro.trim() : "";
  const ctaText =
    typeof resp.cta === "string" ? resp.cta.trim() : "";

  // Only show CTA if it is non-empty and different from intro
  const shouldShowCta =
    !!ctaText && ctaText !== introText;

  // Normalize agents into `Agent` shape for carousel/cards
  const normalizedAgents: Agent[] = agentsList.map((a: any, idx: number) => {
    const rawTitle = a.title || a.solution_name || a.agent_name || `Agent ${idx + 1}`;
    const { name, idFromTitle } = parseAgentTitle(String(rawTitle));
    return {
      agent_id: a.agent_id || idFromTitle || `agent_${idx + 1}`,
      agent_name: name || `Agent ${idx + 1}`,
      description: a.description || "",
      by_capability: a.by_capability,
      by_persona: a.by_persona,
      by_value: a.by_value || a.value_proposition,
      // pass through possible fields used by AgentResponseCard / normalizeAgentFeatures
      value_proposition: a.value_proposition,
      key_features: a.key_features,
      features: a.features,
      service_provider: a.service_provider,
      asset_type: a.asset_type,
    };
  });

  return (
    <div>
      {introText && (
        <IntroText text={introText} agents={normalizedAgents} />
      )}

      {normalizedAgents.length > 0 && (
        <div className="mt-4">
          <AgentCarousel agents={normalizedAgents} />
        </div>
      )}

      {shouldShowCta && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">{ctaText}</p>
        </div>
      )}
    </div>
  );
}

// Utility function to check if text content is a section label and extract label/content
// Section labels: Description, Key Features, Value Proposition, and variations
function parseSectionLabel(text: string): { isLabel: boolean; label?: string; content?: string } {
  if (!text) return { isLabel: false };

  const normalizedText = text.trim();

  // List of section labels (case-insensitive)
  const sectionLabels = [
    'description',
    'key features',
    'value proposition',
    'features',
    'benefits',
    'use cases',
    'capabilities',
  ];

  // Remove markdown bold markers
  let cleanedText = normalizedText
    .replace(/^\*\*/, '') // Remove leading **
    .replace(/\*\*$/, '') // Remove trailing **
    .replace(/^\*/, '') // Remove leading * (for emphasis)
    .replace(/\*$/, '') // Remove trailing *
    .trim();

  const lowerCleaned = cleanedText.toLowerCase();

  // Check if text starts with any section label
  for (const label of sectionLabels) {
    if (lowerCleaned.startsWith(label)) {
      // Escape special regex characters in label
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Check if there's content after the label and colon
      const labelMatch = cleanedText.match(new RegExp(`^(${escapedLabel}):\\s*(.+)$`, 'i'));
      if (labelMatch) {
        return {
          isLabel: true,
          label: labelMatch[1],
          content: labelMatch[2].trim(),
        };
      }

      // If it's just the label (with or without colon), no content
      // Also check if it's the label followed by colon and nothing else
      if (lowerCleaned === label || lowerCleaned === `${label}:` || lowerCleaned === `${label}:`) {
        return {
          isLabel: true,
          label: label,
        };
      }

      // Handle case where label starts the text but might have more text after colon
      const exactMatch = cleanedText.match(new RegExp(`^(${escapedLabel}):\\s*$`, 'i'));
      if (exactMatch) {
        return {
          isLabel: true,
          label: exactMatch[1],
        };
      }
    }
  }

  return { isLabel: false };
}

// Utility function to process mega trends markdown - combines Title and Subtitle into single heading with pipe separator
function processMegaTrendsMarkdown(markdown: string): string {
  if (!markdown) return '';

  let processed = markdown;

  // Extract Title and Subtitle values BEFORE removing anything
  let titleValue = '';
  let subtitleValue = '';

  // Extract Title - try multiple patterns
  const titleRegex = /(?:\*\*)?Title(?:\*\*)?\s*:\s*"([^"]+)"|(?:\*\*)?Title(?:\*\*)?\s*:\s*(.+?)(?:\n|$)/gi;
  const titleMatch = processed.match(titleRegex);
  if (titleMatch && titleMatch[0]) {
    const fullMatch = titleMatch[0];
    // Extract the value part (after the colon)
    const valueMatch = fullMatch.match(/:\s*"([^"]+)"|:\s*(.+?)(?:\n|$)/);
    if (valueMatch) {
      const rawValue = valueMatch[1] || valueMatch[2] || '';
      titleValue = cleanText(rawValue.trim());
    }
  }

  // Extract Subtitle - try multiple patterns
  const subtitleRegex = /(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*"\(([^)]+)\)"|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*\(([^)]+)\)|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*"([^"]+)"|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*(.+?)(?:\n|$)/gi;
  const subtitleMatch = processed.match(subtitleRegex);
  if (subtitleMatch && subtitleMatch[0]) {
    const fullMatch = subtitleMatch[0];
    // Extract the value part (after the colon)
    const valueMatch = fullMatch.match(/:\s*"\(([^)]+)\)"|:\s*\(([^)]+)\)|:\s*"([^"]+)"|:\s*(.+?)(?:\n|$)/);
    if (valueMatch) {
      const rawValue = valueMatch[1] || valueMatch[2] || valueMatch[3] || valueMatch[4] || '';
      subtitleValue = cleanText(rawValue.trim());
    }
  }

  // Remove Title and Subtitle label lines (only lines that START with Title: or Subtitle:)
  // This preserves content that might mention "Title" or "Subtitle" in the text
  processed = processed.split('\n').map(line => {
    const trimmedLine = line.trim();
    // Skip if it's already our combined heading
    if (trimmedLine.startsWith('###') && trimmedLine.includes('|')) {
      return line;
    }
    // Only remove lines that START with Title: or Subtitle: (with optional bold markers)
    if (/^(\*\*)?(Title|Subtitle)(\*\*)?\s*:\s*/i.test(trimmedLine)) {
      return '';
    }
    return line;
  }).filter(line => line.trim() !== '').join('\n');

  // Remove any remaining Title/Subtitle label patterns (only at start of line)
  processed = processed.replace(/^\*\*Title\*\*\s*:.*$/gim, '');
  processed = processed.replace(/^Title\s*:.*$/gim, '');
  processed = processed.replace(/^\*\*Subtitle\*\*\s*:.*$/gim, '');
  processed = processed.replace(/^Subtitle\s*:.*$/gim, '');

  // Remove orphaned fragments (only at start of line)
  processed = processed.replace(/^\*\*\s*\*\*/gm, '');
  processed = processed.replace(/^\*\*\s*Sub(?!title)/gim, '');
  processed = processed.replace(/^\*\*\s*Title/gim, '');

  // Combine Title and Subtitle into a single heading
  // Ensure both values are clean (no quotes, parentheses, or trailing colons)
  // Apply cleanText again to ensure all special characters are removed
  const cleanTitle = titleValue ? cleanText(titleValue).replace(/["'():]/g, '').trim() : '';
  const cleanSubtitle = subtitleValue ? cleanText(subtitleValue).replace(/["'():]/g, '').trim() : '';

  let combinedHeading = '';
  if (cleanTitle && cleanSubtitle) {
    combinedHeading = `### ${cleanTitle} | ${cleanSubtitle}`;
  } else if (cleanTitle) {
    combinedHeading = `### ${cleanTitle}`;
  } else if (cleanSubtitle) {
    combinedHeading = `### ${cleanSubtitle}`;
  }

  // If we have a combined heading, prepend it to the content
  if (combinedHeading) {
    // Remove any existing combined heading if present (to avoid duplicates)
    processed = processed.replace(/^###\s+.*\s*\|\s*.*$/gim, '');

    // Get remaining content
    const remainingContent = processed.trim();

    // Prepend the combined heading
    if (remainingContent) {
      processed = combinedHeading + '\n\n' + remainingContent;
    } else {
      processed = combinedHeading;
    }
  }

  // Final cleanup: Remove any remaining Title: or Subtitle: labels
  processed = removeMarkdownLabels(processed, ['Title', 'Subtitle']);

  // Remove any remaining fragments and orphaned text
  processed = processed.replace(/\*\*\s*\*\*/g, ''); // Remove ** ** patterns
  processed = processed.replace(/\*\*\s*[Ss]ub/gi, ''); // Remove ** Sub fragments
  processed = processed.replace(/\*\*\s*[Tt]itle/gi, ''); // Remove ** Title fragments
  processed = processed.replace(/\*\*\s*[Ss]ubtitle/gi, ''); // Remove ** Subtitle fragments

  // Final pass: Remove any remaining Title/Subtitle label lines (only at start)
  processed = processed.split('\n').map(line => {
    const trimmed = line.trim();
    // Skip our combined heading
    if (trimmed.startsWith('###') && trimmed.includes('|')) {
      return line;
    }
    // Only remove lines that START with Title: or Subtitle: labels
    if (/^(\*\*)?(Title|Subtitle)(\*\*)?\s*:\s*/i.test(trimmed)) {
      return '';
    }
    // Remove lines that are just fragments (only at start)
    if (/^\*\*\s*\*\*$/.test(trimmed) || /^\*\*\s*Sub(?!title)$/i.test(trimmed) || /^\*\*\s*Title$/i.test(trimmed)) {
      return '';
    }
    return line;
  }).filter(line => line.trim() !== '').join('\n');

  // Remove AGENTIC OPPORTUNITY PLAYS section (this is displayed separately as Suggested Agents)
  // Match from "AGENTIC OPPORTUNITY PLAYS" header to end of content or next major section
  processed = processed.replace(
    /(?:^|\n)(#{1,6}\s*)?\*?\*?AGENTIC OPPORTUNITY PLAYS\*?\*?\s*:?[^\n]*(?:\n(?!#{1,6}\s*(?:MEGA TREND|THEME|THE SHIFT|THE TENSION|THE OPPORTUNITY)).*)*$/gim,
    ''
  );

  // Also remove variants like "Use Cases", "Suggested Use Cases", "Suggested Agents"
  processed = processed.replace(
    /(?:^|\n)(#{1,6}\s*)?\*?\*?(?:SUGGESTED\s+)?(?:USE\s+CASES?|AGENTS?)\*?\*?\s*:?[^\n]*(?:\n(?!#{1,6}\s*(?:MEGA TREND|THEME|THE SHIFT|THE TENSION|THE OPPORTUNITY)).*)*$/gim,
    ''
  );

  // Clean up extra whitespace and empty lines
  processed = processed.replace(/\n{3,}/g, '\n\n').trim();

  return processed;
}

// Comprehensive Markdown Components Factory for beautiful LLM response formatting
// Supports: headings, paragraphs, lists, code blocks, blockquotes, tables, links, emphasis
function createChatMarkdownComponents(options: {
  isUserMessage?: boolean;
  agents?: Agent[];
  onAgentClick?: (agentId: string) => void;
}) {
  const { isUserMessage = false, agents = [] } = options;

  const textColor = isUserMessage ? "#FFFFFF" : "#374151";
  const headingColor = isUserMessage ? "#FFFFFF" : "#111827";
  const mutedColor = isUserMessage ? "rgba(255,255,255,0.8)" : "#6b7280";
  const codeBackground = isUserMessage ? "rgba(255,255,255,0.15)" : "#f3f4f6";
  const codeBorderColor = isUserMessage ? "rgba(255,255,255,0.2)" : "#e5e7eb";
  const blockquoteBorder = isUserMessage ? "rgba(255,255,255,0.4)" : "#3b82f6";
  const tableBorderColor = isUserMessage ? "rgba(255,255,255,0.2)" : "#e5e7eb";

  return {
    // Headings
    h1: ({ children }: any) => (
      <h1 style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        fontSize: "24px",
        lineHeight: "1.3",
        color: headingColor,
        marginTop: "20px",
        marginBottom: "12px",
      }}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "20px",
        lineHeight: "1.3",
        color: headingColor,
        marginTop: "18px",
        marginBottom: "10px",
      }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "17px",
        lineHeight: "1.3",
        color: headingColor,
        marginTop: "16px",
        marginBottom: "8px",
      }}>{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: "15px",
        lineHeight: "1.4",
        color: headingColor,
        marginTop: "14px",
        marginBottom: "6px",
      }}>{children}</h4>
    ),

    // Paragraphs
    p: ({ children, node }: any) => {
      if (node?.parent?.tagName === 'li') {
        return <span style={{ color: "inherit" }}>{children}</span>;
      }
      return (
        <p style={{
          color: textColor,
          fontSize: "14px",
          lineHeight: "22px",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          marginBottom: "12px",
        }}>{children}</p>
      );
    },

    // Lists
    ul: ({ children }: any) => (
      <ul style={{
        color: textColor,
        fontSize: "14px",
        lineHeight: "22px",
        fontFamily: "Poppins, sans-serif",
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "disc",
      }}>{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{
        color: textColor,
        fontSize: "14px",
        lineHeight: "22px",
        fontFamily: "Poppins, sans-serif",
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "decimal",
      }}>{children}</ol>
    ),
    li: ({ children }: any) => (
      <li style={{
        color: textColor,
        marginBottom: "6px",
        paddingLeft: "4px",
      }}>{children}</li>
    ),

    // Code blocks
    code: ({ inline, className, children }: any) => {
      if (inline) {
        return (
          <code style={{
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: "13px",
            backgroundColor: codeBackground,
            padding: "2px 6px",
            borderRadius: "4px",
            color: isUserMessage ? "#FFFFFF" : "#e11d48",
          }}>{children}</code>
        );
      }
      // Block code
      return (
        <pre style={{
          backgroundColor: codeBackground,
          border: `1px solid ${codeBorderColor}`,
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "12px",
          overflow: "auto",
        }}>
          <code style={{
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: "13px",
            lineHeight: "1.5",
            color: isUserMessage ? "#FFFFFF" : "#1f2937",
          }}>{children}</code>
        </pre>
      );
    },
    pre: ({ children }: any) => <>{children}</>,

    // Blockquotes
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: `4px solid ${blockquoteBorder}`,
        paddingLeft: "16px",
        marginLeft: "0",
        marginBottom: "12px",
        fontStyle: "italic",
        color: mutedColor,
      }}>{children}</blockquote>
    ),

    // Tables
    table: ({ children }: any) => (
      <div style={{ overflowX: "auto", marginBottom: "12px" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        }}>{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{
        backgroundColor: isUserMessage ? "rgba(255,255,255,0.1)" : "#f9fafb",
      }}>{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr style={{
        borderBottom: `1px solid ${tableBorderColor}`,
      }}>{children}</tr>
    ),
    th: ({ children }: any) => (
      <th style={{
        padding: "10px 12px",
        textAlign: "left",
        fontWeight: 600,
        color: headingColor,
        borderBottom: `2px solid ${tableBorderColor}`,
      }}>{children}</th>
    ),
    td: ({ children }: any) => (
      <td style={{
        padding: "10px 12px",
        color: textColor,
      }}>{children}</td>
    ),

    // Links
    a: ({ href, children }: any) => {
      // Check if it's an agent link
      if (href?.startsWith('/agents/')) {
        const agentId = href.replace('/agents/', '');
        const agent = agents.find(a => a.agent_id === agentId);
        if (agent) {
          return (
            <a
              href={href}
              style={{
                color: isUserMessage ? "#93c5fd" : "#2563eb",
                textDecoration: "none",
                fontWeight: 500,
                borderBottom: `1px dashed ${isUserMessage ? "#93c5fd" : "#2563eb"}`,
              }}
            >{children}</a>
          );
        }
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: isUserMessage ? "#93c5fd" : "#2563eb",
            textDecoration: "none",
          }}
        >{children}</a>
      );
    },

    // Emphasis
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 600, color: "inherit" }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),

    // Horizontal rule
    hr: () => (
      <hr style={{
        border: "none",
        borderTop: `1px solid ${tableBorderColor}`,
        margin: "16px 0",
      }} />
    ),
  };
}

// Intro Text Component - Displays plain text without card
function IntroText({ text, agents }: { text: string; agents?: Agent[] }) {
  if (!text) return null;
  const safeAgents = agents || [];

  const processTextWithAgents = (text: string): string => {
    if (!safeAgents.length) return text;

    let processedText = text;
    const sortedAgents = [...safeAgents].sort((a, b) => (b.agent_name || '').length - (a.agent_name || '').length);
    const processedMarkers = new Set<string>();

    sortedAgents.forEach(agent => {
      const escapedName = String(agent.agent_name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;

      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);

      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];

      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });

    return processedText;
  };

  const markdownComponents = {
    h1: ({ children }: any) => {
      const childText = Array.isArray(children) ? children.join('') : String(children);
      const { name, idFromTitle } = parseAgentTitle(String(childText));
      const matchesAgent = safeAgents.some(a => (
        (name && a.agent_name && a.agent_name.toLowerCase() === name.toLowerCase()) ||
        (idFromTitle && a.agent_id && a.agent_id.toLowerCase() === idFromTitle.toLowerCase())
      ));
      if (matchesAgent) return null;
      return (
        <h1 className="font-semibold mb-2" style={{ color: "#111827", fontSize: "18px", lineHeight: "1.3", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          {children}
        </h1>
      );
    },
    h2: ({ children }: any) => {
      const childText = Array.isArray(children) ? children.join('') : String(children);
      const { name, idFromTitle } = parseAgentTitle(String(childText));
      const matchesAgent = safeAgents.some(a => (
        (name && a.agent_name && a.agent_name.toLowerCase() === name.toLowerCase()) ||
        (idFromTitle && a.agent_id && a.agent_id.toLowerCase() === idFromTitle.toLowerCase())
      ));
      if (matchesAgent) return null;
      return (
        <h2 className="font-semibold mb-2" style={{ color: "#111827", fontSize: "16px", lineHeight: "1.3", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const childText = Array.isArray(children) ? children.join('') : String(children);
      const { name, idFromTitle } = parseAgentTitle(String(childText));
      const matchesAgent = safeAgents.some(a => (
        (name && a.agent_name && a.agent_name.toLowerCase() === name.toLowerCase()) ||
        (idFromTitle && a.agent_id && a.agent_id.toLowerCase() === idFromTitle.toLowerCase())
      ));
      if (matchesAgent) return null;
      return (
        <h3 className="font-semibold mb-2" style={{ color: "#111827", fontSize: "15px", lineHeight: "1.3", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          {children}
        </h3>
      );
    },
    p: ({ children }: any) => {
      return <p className="mb-2 last:mb-0" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
    },
    a: ({ href, children }: any) => {
      if (!href || !href.startsWith('/agents/')) {
        return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
      }
      const agentId = href.replace('/agents/', '');
      const agent = agents?.find(a => a.agent_id === agentId);
      if (agent) {
        return <InlineAgentCard agent={agent} />;
      }
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    },
    strong: ({ children }: any) => <strong className="font-semibold" style={{ color: "inherit" }}>{children}</strong>,
  };

  return (
    <div className="mb-4" style={{ paddingLeft: "0", paddingRight: "0" }}>
      <div className="prose prose-gray max-w-none" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {processTextWithAgents(text)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Agent Info Card Component - Main Agent Card
function AgentInfoCard({ markdown, agents, onAgentCardRender, filteredAgentIds }: {
  markdown: string;
  agents: Agent[];
  onAgentCardRender?: (agentCards: React.ReactElement[]) => void;
  filteredAgentIds?: string[];
}) {
  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;

    let processedText = text;
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    const processedMarkers = new Set<string>();

    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;

      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);

      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];

      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });

    return processedText;
  };

  // Preprocess markdown to convert section labels from list items to proper headings/paragraphs
  // This ensures they don't render as bullets
  const preprocessMarkdown = (md: string): string => {
    let processed = md;

    // Convert list items with section labels to headings or paragraphs
    // Pattern: - **Description**: content
    processed = processed.replace(/^[-*•]\s+\*\*Description\*\*:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });

    // Pattern: - Description: content (without bold)
    processed = processed.replace(/^[-*•]\s+Description:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });

    // Pattern: - **Key Features**: (with nested list)
    processed = processed.replace(/^[-*•]\s+\*\*Key Features\*\*:\s*$/gim, '#### Key Features');

    // Pattern: - Key Features: (without bold, with nested list)
    processed = processed.replace(/^[-*•]\s+Key Features:\s*$/gim, '#### Key Features');

    // Pattern: - **Value Proposition**: content
    processed = processed.replace(/^[-*•]\s+\*\*Value Proposition\*\*:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });

    // Pattern: - Value Proposition: content (without bold)
    processed = processed.replace(/^[-*•]\s+Value Proposition:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });

    return processed;
  };

  // Remove labels from markdown before rendering
  // Remove "Description" label but keep the descriptive text
  const cleanedMarkdown = removeMarkdownLabels(preprocessMarkdown(markdown), ['Description']);

  const markdownComponents = {
    h3: ({ children }: any) => {
      const text = typeof children === 'string' ? children :
        (Array.isArray(children) ? children.join('') : String(children));

      // Check if we have filtered agent IDs to show a tag/button
      const hasFilteredAgents = filteredAgentIds && Array.isArray(filteredAgentIds) && filteredAgentIds.length > 0;
      const firstAgentId = hasFilteredAgents ? filteredAgentIds[0] : null;

      return (
        <div className="flex items-center justify-between gap-3 mb-2 mt-3 first:mt-0 flex-wrap">
          <h3
            className="font-semibold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "21px",
              lineHeight: "120%",
              letterSpacing: "0%",
              color: "#111827",
              margin: 0,
            }}
          >
            {children}
          </h3>
          {firstAgentId && (
            <Link
              href={`/agents/${firstAgentId}`}
              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "21px",
                letterSpacing: "0%",
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              View Agent <span style={{ marginLeft: "4px" }}>›</span>
            </Link>
          )}
        </div>
      );
    },
    h4: ({ children }: any) => {
      return (
        <h4
          className="font-semibold mb-2 mt-4 first:mt-0"
          style={{
            color: "#111827",
            fontSize: "16px",
            lineHeight: "1.4",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          {children}
        </h4>
      );
    },
    p: ({ children }: any) => {
      return <p className="mb-2 last:mb-0" style={{ color: "#4b5563", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
    },
    ul: ({ children }: any) => {
      // Check if all direct children (li elements) are section labels
      // If so, render them without list structure to avoid bullets
      if (Array.isArray(children)) {
        const allSectionLabels = children.every((child: any) => {
          if (!child || !child.props) return false;
          const textContent = extractTextFromChildren(child.props.children);
          const parsed = parseSectionLabel(textContent);
          return parsed.isLabel;
        });

        // If all are section labels, render without list structure (just the children)
        if (allSectionLabels) {
          return <div>{children}</div>;
        }
      }

      return <ul className="list-disc list-inside mb-2 space-y-1" style={{ color: "inherit" }}>{children}</ul>;
    },
    ol: ({ children }: any) => {
      return <ol className="list-decimal list-inside mb-2 space-y-1" style={{ color: "inherit" }}>{children}</ol>;
    },
    li: ({ children }: any) => {
      // Extract text content to check if it's a section label
      const textContent = extractTextFromChildren(children);
      const parsed = parseSectionLabel(textContent);

      // If it's a section label, handle it differently based on label type
      if (parsed.isLabel && parsed.label) {
        const labelLower = parsed.label.toLowerCase();

        // Description and Value Proposition: render only the content as paragraph (no label, no bullet)
        if (labelLower === 'description' || labelLower === 'value proposition') {
          // If there's content, render just the content as paragraph (skip the label)
          if (parsed.content) {
            return (
              <div style={{ marginBottom: "8px" }}>
                <p
                  className="mb-0"
                  style={{
                    color: "#4b5563",
                    fontSize: "14px",
                    lineHeight: "21px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    letterSpacing: "0%",
                    marginTop: "0",
                    marginBottom: "0",
                  }}
                >
                  {parsed.content}
                </p>
              </div>
            );
          }
          // If no content, render empty div to maintain list structure but hide the label
          return <div style={{ display: "none" }} />;
        }

        // Key Features: render as section header (no bullet, no content on same line)
        // Preserve any nested lists (actual feature items) - they will be rendered by ReactMarkdown
        if (labelLower === 'key features' || labelLower === 'features') {
          // Render as heading, but preserve any nested content (like nested ul/ol)
          // Filter out the label text from children to avoid duplication
          const filteredChildren = Array.isArray(children)
            ? children.filter((child: any) => {
              const childText = extractTextFromChildren(child);
              // Keep nested lists and other non-text elements
              if (typeof child !== 'string' && child?.type) return true;
              // Filter out text that matches the label
              return !childText.toLowerCase().includes(labelLower);
            })
            : [];

          return (
            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <h4
                className="font-semibold mb-2 first:mt-0"
                style={{
                  color: "#111827",
                  fontSize: "16px",
                  lineHeight: "1.4",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  marginTop: "16px",
                  marginBottom: "8px",
                }}
              >
                {parsed.label}
              </h4>
              {filteredChildren.length > 0 && <div>{filteredChildren}</div>}
            </div>
          );
        }

        // Other section labels: render as heading with optional content
        return (
          <div style={{ marginTop: "16px", marginBottom: "8px" }}>
            <h4
              className="font-semibold mb-2 first:mt-0"
              style={{
                color: "#111827",
                fontSize: "16px",
                lineHeight: "1.4",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                marginBottom: parsed.content ? "8px" : "0",
              }}
            >
              {parsed.label}
            </h4>
            {parsed.content && (
              <p
                className="mb-0"
                style={{
                  color: "#4b5563",
                  fontSize: "14px",
                  lineHeight: "21px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  letterSpacing: "0%",
                  marginTop: "0",
                }}
              >
                {parsed.content}
              </p>
            )}
          </div>
        );
      }

      // Regular list item - render with bullet
      return <li className="ml-2" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</li>;
    },
    a: ({ href, children }: any) => {
      if (!href || !href.startsWith('/agents/')) {
        return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
      }
      const agentId = href.replace('/agents/', '');
      const agent = agents.find(a => a.agent_id === agentId);
      if (agent) {
        return <AgentResponseCard agent={agent} />;
      }
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    },
    strong: ({ children }: any) => <strong className="font-semibold" style={{ color: "inherit" }}>{children}</strong>,
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: "#E5E7EB", color: "inherit" }}>
        {children}
      </code>
    ),
  };

  return (
    <SectionCard>
      <div className="prose prose-gray max-w-none" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {processTextWithAgents(cleanedMarkdown)}
        </ReactMarkdown>
      </div>
    </SectionCard>
  );
}

// Utility function to parse mega trends into individual trend sections
function parseMegaTrends(markdown: string): Array<{ title: string; content: string; index: number }> {
  if (!markdown) return [];

  const trends: Array<{ title: string; content: string; index: number }> = [];

  // More comprehensive pattern to match various formats:
  // - ### **MEGA TREND 1** (with bold markdown)
  // - ### MEGA TREND 1
  // - ## MEGA TREND 1  
  // - MEGA TREND 1
  // - Mega Trend - 1
  // - Mega Trend 1
  // - MEGA TREND - 1
  // Also handles cases where there might be extra whitespace
  const trendPatterns = [
    // Pattern 1: Markdown heading with # and bold: ### **MEGA TREND 1**, ### **Mega Trend 1**
    /(?:^|\n)(#{1,6})\s*\*\*(MEGA\s+TREND|Mega\s+Trend)\s*[-–—]?\s*(\d+)\*\*/gi,
    // Pattern 2: Markdown heading with # symbols: ### MEGA TREND 1, ## MEGA TREND 1
    /(?:^|\n)(#{1,6})\s*(MEGA\s+TREND|Mega\s+Trend)\s*[-–—]?\s*(\d+)/gi,
    // Pattern 3: Plain text at start of line: MEGA TREND 1, Mega Trend - 1
    /(?:^|\n)(MEGA\s+TREND|Mega\s+Trend)\s*[-–—]?\s*(\d+)/gi,
  ];

  // Find all mega trend headings using multiple patterns
  const matches: Array<{ index: number; number: number; fullMatch: string; headingLength: number }> = [];

  trendPatterns.forEach(pattern => {
    let match: RegExpExecArray | null;
    pattern.lastIndex = 0;

    while ((match = pattern.exec(markdown)) !== null) {
      // Extract trend number - handle different pattern groups
      // Pattern 1: ### **MEGA TREND 1** -> match[3] is the number
      // Pattern 2: ### MEGA TREND 1 -> match[3] is the number  
      // Pattern 3: MEGA TREND 1 -> match[2] is the number
      const trendNumber = parseInt(match[3] || match[2] || match[1] || '1', 10);
      const headingLength = match[0].length;

      // Check if we already have this match (avoid duplicates)
      const isDuplicate = matches.some(m =>
        Math.abs(m.index - match!.index) < 10 && m.number === trendNumber
      );

      if (!isDuplicate) {
        matches.push({
          index: match.index,
          number: trendNumber,
          fullMatch: match[0],
          headingLength: headingLength
        });
      }

      // Prevent infinite loop
      if (match.index === pattern.lastIndex) {
        pattern.lastIndex++;
      }
    }
  });

  // If no matches found, try alternative parsing methods
  if (matches.length === 0) {
    // Try splitting by major section markers (THEME, THE SHIFT, etc.) that might indicate separate trends
    const sectionMarkers = /(?:^|\n)(?:#{1,3}\s*)?(THEME|THE SHIFT|THE TENSION|THE OPPORTUNITY|AGENTIC OPPORTUNITY PLAYS)/gi;
    const sectionMatches: Array<{ index: number; text: string }> = [];
    let sectionMatch: RegExpExecArray | null;

    sectionMarkers.lastIndex = 0;
    while ((sectionMatch = sectionMarkers.exec(markdown)) !== null) {
      sectionMatches.push({
        index: sectionMatch.index,
        text: sectionMatch[1] || sectionMatch[0]
      });
    }

    // If we found multiple major sections, treat each as a separate trend
    if (sectionMatches.length > 1) {
      sectionMatches.forEach((match, idx) => {
        const startIndex = match.index;
        const endIndex = idx < sectionMatches.length - 1 ? sectionMatches[idx + 1].index : markdown.length;
        const content = markdown.substring(startIndex, endIndex).trim();

        if (content) {
          trends.push({
            title: `MEGA TREND ${idx + 1}`,
            content: content,
            index: idx + 1
          });
        }
      });

      if (trends.length > 0) {
        return trends;
      }
    }

    // Fallback: treat entire markdown as one trend
    return [{
      title: "MEGA TREND 1",
      content: markdown.trim(),
      index: 1
    }];
  }

  // Sort matches by index to ensure correct order
  matches.sort((a, b) => a.index - b.index);

  // Split markdown into sections based on trend headings
  matches.forEach((matchInfo, idx) => {
    const startIndex = matchInfo.index;
    const endIndex = idx < matches.length - 1 ? matches[idx + 1].index : markdown.length;

    // Find the end of the heading line
    const headingEnd = markdown.indexOf('\n', startIndex);
    const contentStart = headingEnd !== -1 ? headingEnd + 1 : startIndex + matchInfo.headingLength;

    // Extract content (everything after the heading until next trend or end)
    let content = markdown.substring(contentStart, endIndex).trim();

    // Remove any remaining heading patterns from the start of content
    // Handle formats like: ### **MEGA TREND 1**, ### MEGA TREND 1, MEGA TREND 1
    const headingRemovalPatterns = [
      // Pattern with bold markdown: ### **MEGA TREND 1**
      new RegExp(`^#{1,6}\\s*\\*\\*(?:Mega\\s+Trend|MEGA\\s+TREND)\\s*[-–—]?\\s*${matchInfo.number}\\*\\*\\s*$`, 'im'),
      // Pattern with markdown heading: ### MEGA TREND 1
      new RegExp(`^#{1,6}\\s*(?:Mega\\s+Trend|MEGA\\s+TREND)\\s*[-–—]?\\s*${matchInfo.number}\\s*$`, 'im'),
      // Plain text pattern: MEGA TREND 1
      new RegExp(`^(?:Mega\\s+Trend|MEGA\\s+TREND)\\s*[-–—]?\\s*${matchInfo.number}\\s*$`, 'im'),
    ];

    headingRemovalPatterns.forEach(pattern => {
      content = content.replace(pattern, '').trim();
    });

    // Clean up extra newlines
    content = content.replace(/^\n+/, '').replace(/\n+$/, '').trim();

    if (content) {
      trends.push({
        title: `MEGA TREND ${matchInfo.number}`,
        content: content,
        index: matchInfo.number
      });
    }
  });

  // If we didn't find any valid trends, return the whole markdown as one trend
  if (trends.length === 0) {
    return [{
      title: "MEGA TREND 1",
      content: markdown.trim(),
      index: 1
    }];
  }

  return trends;
}

// Mega Trend Card Component - Tabbed Interface
function MegaTrendCard({
  markdown,
  agents,
  onTabChange,
  messageId
}: {
  markdown: string;
  agents: Agent[];
  onTabChange?: (trendNumber: number) => void;
  messageId?: string;
}) {
  const [activeTab, setActiveTab] = useState(0);

  if (!markdown) return null;

  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;

    let processedText = text;
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    const processedMarkers = new Set<string>();

    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;

      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);

      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];

      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });

    return processedText;
  };

  // Parse mega trends from RAW markdown first (before processing)
  const rawTrends = parseMegaTrends(markdown);

  // If we only found one trend, check if the markdown might contain multiple trends in a different format
  // Look for patterns that suggest multiple sections (like repeated "THEME", "THE SHIFT", etc.)
  let trendsToUse = rawTrends;

  if (rawTrends.length === 1) {
    // Check if markdown contains multiple distinct sections that might be separate trends
    // Look for patterns like multiple "THEME" sections or clear separators
    const themePattern = /(?:^|\n)(?:#{1,6}\s*)?(THEME|THE SHIFT|THE TENSION|THE OPPORTUNITY)/gi;
    const themeMatches = markdown.match(themePattern);

    // If we find multiple distinct sections, try to split by them
    if (themeMatches && themeMatches.length > 1) {
      // Try to split by major section markers
      const sections = markdown.split(/(?=###?\s*(?:THEME|THE SHIFT|THE TENSION|THE OPPORTUNITY))/i);
      if (sections.length > 1) {
        // Group sections that might belong to the same trend
        // For now, keep as single trend but this could be enhanced
      }
    }
  }

  // Process each trend section individually
  const displayTrends = trendsToUse.map(trend => ({
    ...trend,
    content: processMegaTrendsMarkdown(trend.content)
  }));

  // If no trends found, treat entire content as one trend
  const finalTrends = displayTrends.length > 0 ? displayTrends : [{
    title: "MEGA TREND 1",
    content: processMegaTrendsMarkdown(markdown.trim()),
    index: 1
  }];

  // Notify parent of initial active trend
  useEffect(() => {
    if (onTabChange && finalTrends.length > 0) {
      onTabChange(finalTrends[activeTab].index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  return (
    <div style={{ marginTop: "45px" }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img
          src="/up-stream.png"
          alt="Up Stream"
          style={{
            width: "21.000417709350586px",
            height: "13.500417709350586px",
            marginLeft: "1.5px",
            marginTop: "4.5px",
            display: "inline-block",
            verticalAlign: "top",
            opacity: 1,
            transform: "rotate(0deg)"
          }}
        />
        <h2
          className="font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontStyle: "normal",
            fontSize: "21px",
            lineHeight: "120%",
            letterSpacing: "0%",
            color: "#3B60AF",
          }}
        >
          Mega Trends
        </h2>
      </div>

      {/* Divider line after Mega Trends title */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#D1D5DB",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "15px"
        }}
      />

      {/* Tabs - Always show tabs for mega trends */}
      {finalTrends.length > 0 && (
        <div className="flex gap-2 mb-4 border-b border-gray-200 overflow-x-auto mega-trends-tabs-scroll">
          {finalTrends.map((trend, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveTab(idx);
                if (onTabChange) {
                  onTabChange(finalTrends[idx].index);
                }
              }}
              className="px-4 py-2 font-semibold text-sm transition-all duration-200 relative whitespace-nowrap hover:opacity-80"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: activeTab === idx ? "#3B60AF" : "#6B7280",
                borderBottom: activeTab === idx ? "2px solid #3B60AF" : "2px solid transparent",
                marginBottom: "-1px",
                backgroundColor: activeTab === idx ? "transparent" : "transparent",
              }}
            >
              {trend.title}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {finalTrends.length > 0 && (
        <div className="prose prose-gray max-w-none px-0 pb-0" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h4: ({ children }) => {
                // Handle subtitle styling
                const text = typeof children === 'string' ? children :
                  (Array.isArray(children) ? children.join('') : String(children));

                return (
                  <h4
                    className="font-semibold mb-1 mt-5 first:mt-0"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#111827",
                    }}
                  >
                    {children}
                  </h4>
                );
              },
              h3: ({ children }) => {
                const text = typeof children === 'string' ? children :
                  (Array.isArray(children) ? children.join('') : String(children));

                // Check if this is the combined title/subtitle heading (contains pipe separator)
                const isCombinedTitleSubtitle = typeof text === 'string' && text.includes('|');

                if (isCombinedTitleSubtitle) {
                  return (
                    <h3
                      className="mb-2 mt-3 first:mt-0"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "21px",
                        letterSpacing: "0%",
                        color: "#091917",
                      }}
                    >
                      {children}
                    </h3>
                  );
                }

                if (typeof text === 'string' && (text.includes('Description:') || text.includes('Key Features:'))) {
                  return (
                    <h4 className="font-semibold text-gray-900 mt-4 mb-1 first:mt-0" style={{ fontSize: '15px' }}>
                      {children}
                    </h4>
                  );
                }

                const isMegaTrendHeading = typeof text === 'string' &&
                  (text.toUpperCase().includes('THEME') || text.toUpperCase().includes('THE SHIFT') || text.toUpperCase().includes('THE TENSION') ||
                    text.toUpperCase().includes('THE OPPORTUNITY') || text.toUpperCase().includes('AGENTIC OPPORTUNITY PLAYS'));

                if (isMegaTrendHeading) {
                  // Check if it's exactly one of these headings
                  const upperText = text.toUpperCase().trim();
                  const isExactMatch = upperText === 'THEME' || upperText === 'THE SHIFT' || upperText === 'THE TENSION' ||
                    upperText === 'THE OPPORTUNITY' || upperText === 'AGENTIC OPPORTUNITY PLAYS' ||
                    upperText.startsWith('THEME:') || upperText.startsWith('THE SHIFT:') ||
                    upperText.startsWith('THE TENSION:') || upperText.startsWith('THE OPPORTUNITY:') ||
                    upperText.startsWith('AGENTIC OPPORTUNITY PLAYS:');

                  if (isExactMatch) {
                    return (
                      <div className="mt-4 first:mt-0 mb-2">
                        <p
                          className="font-semibold uppercase"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            lineHeight: "1.5",
                            color: "#111827",
                            marginBottom: "8px",
                          }}
                        >
                          {children}
                        </p>
                      </div>
                    );
                  }
                }

                // Check if this is a "MEGA TREND X" heading - hide it since we show it as a tab
                // ReactMarkdown removes ** markers, so text will be "MEGA TREND 1" not "**MEGA TREND 1**"
                const isMegaTrendNumberHeading = typeof text === 'string' &&
                  (/^MEGA\s+TREND\s+\d+/i.test(text.trim()) ||
                    /^Mega\s+Trend\s*[-–—]?\s*\d+/i.test(text.trim()) ||
                    /MEGA\s+TREND\s+\d+/i.test(text.trim()));

                if (isMegaTrendNumberHeading) {
                  // Hide the heading since it's shown as a tab
                  return null;
                }

                const isMegaTrendCard = typeof text === 'string' &&
                  /^Mega Trend\s*-\s*\d+/i.test(text.trim());

                if (isMegaTrendCard) {
                  // Hide this too since it's a mega trend heading
                  return null;
                }

                return (
                  <h3
                    className="font-semibold mb-2 mt-3 first:mt-0"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "21px",
                      lineHeight: "1.2",
                      color: "#111827",
                    }}
                  >
                    {children}
                  </h3>
                );
              },
              p: ({ children }) => {
                // Check if this paragraph contains a mega trend heading (THEME, THE SHIFT, etc.)
                const text = typeof children === 'string' ? children :
                  (Array.isArray(children) ? children.join('') : String(children));

                if (typeof text === 'string') {
                  const upperText = text.toUpperCase().trim();
                  const isMegaTrendHeading = upperText === 'THEME' || upperText === 'THE SHIFT' || upperText === 'THE TENSION' ||
                    upperText === 'THE OPPORTUNITY' || upperText === 'AGENTIC OPPORTUNITY PLAYS' ||
                    upperText.startsWith('THEME:') || upperText.startsWith('THE SHIFT:') ||
                    upperText.startsWith('THE TENSION:') || upperText.startsWith('THE OPPORTUNITY:') ||
                    upperText.startsWith('AGENTIC OPPORTUNITY PLAYS:');

                  if (isMegaTrendHeading) {
                    // Remove colon if present
                    const displayText = text.replace(/:\s*$/, '').trim();
                    return (
                      <div className="mt-4 first:mt-0 mb-2">
                        <p
                          className="font-semibold uppercase"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            lineHeight: "1.5",
                            color: "#111827",
                            marginBottom: "8px",
                          }}
                        >
                          {displayText}
                        </p>
                      </div>
                    );
                  }
                }

                return <p className="mb-3 last:mb-0" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", marginTop: "0px", marginBottom: "8px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
              },
              ul: ({ children }) => {
                return (
                  <ul
                    className="list-disc list-inside mb-2 space-y-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "21px",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      color: "#111827",
                    }}
                  >
                    {children}
                  </ul>
                );
              },
              ol: ({ children }) => {
                return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
              },
              li: ({ children }) => {
                // Extract text content to check if it's a section label
                const textContent = extractTextFromChildren(children);
                const parsed = parseSectionLabel(textContent);

                // If it's a section label, render as a heading instead of a bullet point
                if (parsed.isLabel && parsed.label) {
                  return (
                    <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                      <h4
                        className="font-semibold mb-2 first:mt-0"
                        style={{
                          color: "#111827",
                          fontSize: "16px",
                          lineHeight: "1.4",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          marginBottom: parsed.content ? "8px" : "0",
                        }}
                      >
                        {parsed.label}
                      </h4>
                      {parsed.content && (
                        <p
                          className="mb-0"
                          style={{
                            color: "#374151",
                            fontSize: "14px",
                            lineHeight: "21px",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            letterSpacing: "0%",
                            marginTop: "0",
                          }}
                        >
                          {parsed.content}
                        </p>
                      )}
                    </div>
                  );
                }

                // Regular list item - render with bullet
                return <li className="ml-2" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</li>;
              },
              a: ({ href, children }: any) => {
                if (!href || !href.startsWith('/agents/')) {
                  return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
                }
                const agentId = href.replace('/agents/', '');
                const agent = agents.find(a => a.agent_id === agentId);
                if (agent) {
                  return <AgentResponseCard agent={agent} />;
                }
                return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
              },
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {processTextWithAgents(finalTrends[activeTab].content
              .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^(Description:|Key Features:)/gm, '### $1')
              .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
          </ReactMarkdown>

        </div>
      )}
    </div>
  );
}

// Lets Build Actions Component - Shows Contact Us and Download BRD buttons
function LetsBuildActions({
  brdDownloadUrl,
  brdStatus,
  letsBuildTimestamp
}: {
  brdDownloadUrl?: string | null;
  brdStatus?: string | null;
  letsBuildTimestamp?: number;
}) {
  const [isEnabled, setIsEnabled] = useState(false);

  // Auto-enable button after 10 seconds
  useEffect(() => {
    if (letsBuildTimestamp) {
      const checkEnabled = () => {
        const elapsed = Date.now() - letsBuildTimestamp;
        setIsEnabled(elapsed >= 10000);
      };

      checkEnabled(); // Check immediately
      const interval = setInterval(checkEnabled, 1000); // Check every second

      return () => clearInterval(interval);
    } else {
      setIsEnabled(true); // If no timestamp, enable immediately
    }
  }, [letsBuildTimestamp]);
  const handleDownloadBRD = async () => {
    if (!brdDownloadUrl) return;

    try {
      // Handle both relative and absolute URLs
      const downloadUrl = brdDownloadUrl.startsWith('http')
        ? brdDownloadUrl
        : `https://agents-store.onrender.com${brdDownloadUrl}`;

      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });

      // Check if response is an error (JSON response)
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || 'Failed to download BRD document');
      }

      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;

        // Try to get filename from Content-Disposition header, or extract from URL
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `BRD_Document_${Date.now()}.docx`;

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        } else if (brdDownloadUrl) {
          // Extract filename from URL path (e.g., /api/brd/chat_1767053066803_hox2op -> chat_1767053066803_hox2op.docx)
          const urlParts = brdDownloadUrl.split('/');
          const lastPart = urlParts[urlParts.length - 1];
          if (lastPart) {
            filename = `${lastPart}.docx`;
          }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to download BRD document');
      }
    } catch (error) {
      console.error('Error downloading BRD document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error downloading BRD document. Please try again later.';
      alert(errorMessage);
    }
  };

  return (
    <div className="mt-3 mb-2" style={{ display: 'block', visibility: 'visible' }}>
      <SectionCard>
        <div className="flex flex-wrap gap-2 items-center justify-center" style={{ padding: '8px' }}>
          <Link href="/contact">
            <Button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-gray-200 transition-colors"
              style={{
                fontFamily: "Poppins, sans-serif",
                backgroundColor: "#F3F4F6",
                color: "#111827",
                cursor: "pointer",
                pointerEvents: "auto",
                zIndex: 10,
                display: "flex",
                visibility: "visible",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#E5E7EB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F3F4F6";
              }}
            >
              Contact Us
            </Button>
          </Link>

          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if ((isEnabled || brdStatus !== "generating") && brdDownloadUrl) {
                handleDownloadBRD();
              }
            }}
            disabled={(!isEnabled && brdStatus === "generating") || !brdDownloadUrl}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-100"
            style={{
              fontFamily: "Poppins, sans-serif",
              backgroundColor: ((!isEnabled && brdStatus === "generating") || !brdDownloadUrl) ? "#F3F4F6" : "#F3F4F6",
              color: ((!isEnabled && brdStatus === "generating") || !brdDownloadUrl) ? "#9CA3AF" : "#111827",
              cursor: ((!isEnabled && brdStatus === "generating") || !brdDownloadUrl) ? "not-allowed" : "pointer",
              pointerEvents: ((!isEnabled && brdStatus === "generating") || !brdDownloadUrl) ? "none" : "auto",
              zIndex: 10,
              display: "flex",
              visibility: "visible",
            }}
            onMouseEnter={(e) => {
              if ((isEnabled || brdStatus !== "generating") && brdDownloadUrl) {
                e.currentTarget.style.backgroundColor = "#E5E7EB";
              }
            }}
            onMouseLeave={(e) => {
              if ((isEnabled || brdStatus !== "generating") && brdDownloadUrl) {
                e.currentTarget.style.backgroundColor = "#F3F4F6";
              }
            }}
          >
            {(!isEnabled && brdStatus === "generating") ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1" />
                <span className="text-gray-600">Generating...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-3 h-3 text-gray-600" />
                <span>Download BRD</span>
              </>
            )}
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

// Suggested Agents Component - Improved card layout
function SuggestedAgents({
  suggested_agents,
  activeTrendNumber
}: {
  suggested_agents?: Array<{ solution_name: string; description?: string; segment?: string; trend_reference?: string }>;
  activeTrendNumber?: number;
}) {
  if (!suggested_agents || !Array.isArray(suggested_agents) || suggested_agents.length === 0) return null;

  // Filter suggested agents based on active trend number
  const filteredAgents = activeTrendNumber
    ? suggested_agents.filter(agent => {
      const trendRef = agent.trend_reference || '';
      // Match "MEGA TREND X" where X is the active trend number
      const trendMatch = trendRef.match(/MEGA\s+TREND\s+(\d+)/i);
      return trendMatch && parseInt(trendMatch[1], 10) === activeTrendNumber;
    })
    : suggested_agents;

  // Don't render if no agents match the active trend
  if (filteredAgents.length === 0) return null;

  return (
    <div>
      <h2
        className="font-medium flex items-center gap-2 mb-4"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "21px",
          lineHeight: "120%",
          letterSpacing: "0%",
          color: "#1C4A46",
          marginBottom: "16px",
          marginTop: "40px"
        }}
      >
        <Sparkles className="w-4 h-4" style={{ color: "#1C4A46" }} />
        Suggested Use Case
      </h2>

      {/* Divider line after Suggested Agents title */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#D1D5DB",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "15px"
        }}
      />

      <div className="space-y-3">
        {filteredAgents.map((agent, index) => (
          <div
            key={index}
            className="mb-3 agent-card-hover card-stagger"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <SectionCard className="mb-0">
              <div
                className="font-semibold mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#111827",
                  marginBottom: agent.description ? "8px" : "0",


                }}
              >
                {agent.solution_name}
              </div>
              {agent.description && (
                <div
                  className="mb-3"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    lineHeight: "21px",
                    fontWeight: 400,
                    letterSpacing: "0%",
                    color: "#4B5563",
                    marginBottom: (agent.segment || agent.trend_reference) ? "12px" : "0",
                  }}
                >
                  {agent.description}
                </div>
              )}
              {(agent.segment || agent.trend_reference) && (
                <div
                  className="flex flex-wrap gap-2"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {agent.trend_reference && (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "#ffffff",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "12.3px",
                        lineHeight: "21px",
                        letterSpacing: "-0.33",
                        verticalAlign: "middle",
                        textTransform: "uppercase",
                        color: "#65717C",
                        border: "1px solid rgb(145, 157, 168)",
                      }}
                    >
                      {agent.trend_reference}
                    </span>
                  )}
                  {agent.segment && (
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: "#ffffff",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "12.3px",
                        lineHeight: "21px",
                        letterSpacing: "-0.33",
                        verticalAlign: "middle",
                        textTransform: "uppercase",
                        color: "#65717C",
                        border: "1px solid rgb(151, 165, 179)",
                      }}
                    >
                      Segment: {agent.segment}
                    </span>
                  )}
                </div>
              )}
            </SectionCard>
          </div>
        ))}
      </div>
    </div>
  );
}

// Agent Card Component matching Figma design
function AgentResponseCard({ agent, index }: { agent: Agent; index?: number }) {
  const [agentDetails, setAgentDetails] = useState<{
    features?: string;
    roi?: string;
    by_value?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`https://agents-store.onrender.com/api/agents/${agent.agent_id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setAgentDetails({
            features: data?.agent?.features,
            roi: data?.agent?.roi,
            by_value: data?.agent?.by_value || agent.by_value,
          });
        }
      } catch (err) {
        console.error("Error fetching agent details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (agent.agent_id) {
      fetchAgentDetails();
    }
  }, [agent.agent_id]);

  // Parse features from string
  const parseFeatures = (featuresStr?: string): string[] => {
    if (!featuresStr || featuresStr === "na") return [];
    return featuresStr
      .split(/[;\n]+/)
      .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
      .filter(Boolean)
      .filter(item => !/^\d+\./.test(item.trim())); // Filter out numbered items
  };
  // Prefer structured `key_features` from agent payload, but allow `agentDetails.features`
  const mergedAgentForFeatures = { ...agent, features: agentDetails?.features ?? agent.features } as any;
  const features = normalizeAgentFeatures(mergedAgentForFeatures);

  const valueProposition = (agent as any).value_proposition || agentDetails?.by_value || agent.by_value || "";

  // Clean up agent name if it contains an inline ID like "Name (ID: agent_004)"
  const { name: displayNameFromName, idFromTitle: idFromName } = parseAgentTitle(String(agent.agent_name || ""));
  const agentIdForLink = agent.agent_id || idFromName || "";

  // Use features only - value proposition is rendered as a separate section
  const allFeatures = features;

  return (
    <div className="agent-card-hover card-stagger" style={{ animationDelay: index !== undefined ? `${index * 100}ms` : '0ms' }}>
      <SectionCard>
        {/* Header: Agent Name and View Link */}
        <div className="flex items-start justify-between mb-3">
          <h3
            className="font-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "18px",
              lineHeight: "1.3",
              color: "#111827",
            }}
          >
            {displayNameFromName}
          </h3>
          {agentIdForLink && (
            <Link
              href={`/agents/${agentIdForLink}`}
              className="hover:opacity-80 font-semibold text-xs flex items-center gap-1 transition-all duration-200 hover:scale-105"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "21px",
                letterSpacing: "0%",
                verticalAlign: "middle",
                textTransform: "uppercase",
                color: "#111827",
                textDecoration: "none",
              }}
            >
              VIEW AGENT
              <span style={{ fontSize: "14px", marginLeft: "2px" }}>›</span>
            </Link>
          )}
        </div>

        {/* Description */}
        {agent.description && (
          <p
            className="mb-4"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: 400,
              letterSpacing: "0%",
              color: "#4B5563",
              marginBottom: "12px",
            }}
          >
            {agent.description}
          </p>
        )}

        {/* Key Features */}
        {allFeatures.length > 0 && (
          <div className="mb-4">
            <h4
              className="font-semibold mb-2 uppercase"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.5px",
                color: "#6B7280",
                marginBottom: "10px",
              }}
            >
              KEY FEATURES
            </h4>
            <ul className="list-disc space-y-1.5" style={{ marginLeft: "20px", paddingLeft: "0" }}>
              {allFeatures.map((feature, index) => (
                <li
                  key={index}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    lineHeight: "21px",
                    fontWeight: 400,
                    letterSpacing: "0%",
                    color: "#374151",
                    paddingLeft: "4px",
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Value Proposition - separate section */}
        {valueProposition && valueProposition.trim() && (
          <div className="mt-4">
            <h4
              className="font-semibold mb-2 uppercase"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.5px",
                color: "#6B7280",
                marginBottom: "10px",
              }}
            >
              VALUE PROPOSITION
            </h4>
            <p
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                lineHeight: "21px",
                fontWeight: 400,
                letterSpacing: "0%",
                color: "#374151",
              }}
            >
              {valueProposition}
            </p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

// Agent Carousel Component for multiple agents
function AgentCarousel({ agents }: { agents: Agent[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (agents.length === 0) return null;
  if (agents.length === 1) {
    return <AgentResponseCard agent={agents[0]} />;
  }

  const nextAgent = () => {
    setCurrentIndex((prev) => (prev + 1) % agents.length);
  };

  const prevAgent = () => {
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  return (
    <div className="relative my-4">
      <div className="card-stagger" style={{ animationDelay: '0ms' }}>
        <AgentResponseCard agent={agents[currentIndex]} index={currentIndex} />
      </div>

      {/* Navigation Controls - Prev / Next arrows */}
      {agents.length > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            onClick={prevAgent}
            disabled={currentIndex === 0}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
            aria-label="Previous agent"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <span
            className="text-sm text-gray-500"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "13px",
              color: "#6B7280",
            }}
          >
            {currentIndex + 1} of {agents.length}
          </span>
          <button
            onClick={nextAgent}
            disabled={currentIndex === agents.length - 1}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
            aria-label="Next agent"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}
    </div>
  );
}

// Gathered Info Card (Create mode) - flow-style summary
function GatheredInfoCard({ info }: { info: any }) {
  if (!info) return null;

  const agentName = info.agent_name || "Agent";
  const persona = info.applicable_persona || "";
  const industry = info.applicable_industry || "";
  const problem = info.problem_statement || "";
  const journeys = info.user_journeys || "";
  const wow = info.wow_factor || "";
  const output = info.expected_output || "";

  const steps: Array<{ title: string; content: string }> = [
    { title: "Problem", content: problem },
    { title: "Journeys", content: journeys },
    { title: "Wow Factor", content: wow },
    { title: "Expected Output", content: output },
  ].filter(s => s.content && String(s.content).trim().length > 0);

  // Don't render if there's no meaningful content
  const hasContent =
    (agentName && agentName !== "Agent") ||
    (persona && String(persona).trim().length > 0) ||
    (industry && String(industry).trim().length > 0) ||
    steps.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-lg flex items-center justify-center shadow-sm"
            style={{ backgroundColor: "#111827" }}
          >
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight" style={{ color: "#111827" }}>
              {agentName}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(17, 24, 39, 0.05)",
                  color: "#374151"
                }}
              >
                Create Mode
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Metadata Tags */}
        {(persona || industry) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {persona && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  backgroundColor: "#FFFFFF"
                }}
              >
                <User className="h-3.5 w-3.5" style={{ color: "#6B7280" }} />
                {persona}
              </div>
            )}
            {industry && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors hover:bg-gray-50"
                style={{
                  borderColor: "#E5E7EB",
                  color: "#374151",
                  backgroundColor: "#FFFFFF"
                }}
              >
                <Building2 className="h-3.5 w-3.5" style={{ color: "#6B7280" }} />
                {industry}
              </div>
            )}
          </div>
        )}

        {/* Info Grid */}
        {/* Info Grid - Visualized as a Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          {[
            { icon: <Target className="h-4 w-4" />, title: "Problem Statement", content: problem },
            { icon: <Map className="h-4 w-4" />, title: "User Journeys", content: journeys },
            { icon: <Zap className="h-4 w-4" />, title: "Wow Factor", content: wow },
            { icon: <CheckCircle2 className="h-4 w-4" />, title: "Expected Output", content: output }
          ]
            .filter(item => item.content)
            .map((item, index) => (
              <InfoGridItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                content={item.content}
                stepIndex={index + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// Helper component for uniform grid items
// Helper component for uniform grid items with "planning" visuals
function InfoGridItem({ icon, title, content, stepIndex }: { icon: React.ReactNode, title: string, content: string, stepIndex: number }) {
  return (
    <div
      className="relative p-5 rounded-xl border transition-all duration-200 hover:shadow-md group overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#E5E7EB",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
      }}
    >
      {/* Step Number Watermark */}
      <div
        className="absolute -top-2 -right-2 font-mono font-bold text-6xl opacity-[0.03] pointer-events-none select-none transition-opacity group-hover:opacity-[0.05]"
        style={{ color: "#111827" }}
      >
        0{stepIndex}
      </div>

      <div className="flex gap-4 relative z-10">
        <div className="flex flex-col items-center">
          <div
            className="p-2 rounded-lg relative z-10"
            style={{ backgroundColor: "#F3F4F6", color: "#111827" }}
          >
            {icon}
          </div>
          {/* Vertical Flow Line */}
          <div
            className="flex-1 w-px border-l border-dashed my-2 opacity-20"
            style={{ borderColor: "#111827" }}
          />
        </div>

        <div className="flex-1 pt-1">
          <h4
            className="font-semibold text-xs uppercase tracking-wider mb-2"
            style={{ color: "#4B5563" }}
          >
            {title}
          </h4>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#374151" }}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

// Inline Agent Card Component (for inline mentions)
function InlineAgentCard({ agent }: { agent: Agent }) {
  return (
    <Link
      href={`/agents/${agent.agent_id}`}
      className="inline-block my-1.5 mx-0.5 align-middle"
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "21px",
            letterSpacing: "0%",
            verticalAlign: "middle",
            textTransform: "uppercase",
            color: "#111827",
          }}
        >
          {agent.agent_name}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
      </span>
    </Link>
  );
}

// Swipe to visit agent store component - positioned on right side
function SwipeToAgentStore() {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchEndX.current) {
      // If no swipe detected, allow default link behavior
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault();
      router.push('/agents#agent-filters');
    }
    // If not a swipe, allow default link click behavior
  };

  return (
    <Link
      href="/agents#agent-filters"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed right-8 top-1/2 cursor-pointer items-center gap-3 py-4 px-3 rounded-lg transition-all select-none"
      style={{
        fontFamily: "Poppins, sans-serif",
        textDecoration: "none",
        zIndex: 50,
        pointerEvents: "auto",
        backgroundColor: "transparent",
        maskImage: "linear-gradient(to left, rgb(233, 228, 228) 80%, rgba(233, 17, 17, 0) 100%)",
        WebkitMaskImage: "linear-gradient(to left, rgb(190, 183, 183) 20%, rgba(0,0,0,0) 100%)",
      }}
    >
      <span
        className="whitespace-nowrap"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "130%",
          letterSpacing: "0%",
          verticalAlign: "middle",
          textTransform: "uppercase",
          color: "#111827",
          width: "88px",
          height: "32px",
          // top: "391px",
          transform: "rotate(0deg)",
          opacity: 1,
          backgroundColor: "transparent",
        }}
      >
        VISIT <br /> AGENTS STORE
        <div
          className="flex items-center justify-center"
        >

          <Image
            src="/Arrow_right.png"
            alt="Arrow right"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

      </span>

    </Link>
  );
}

export default function AgentsChatPage() {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);
  const router = useRouter();
  const [chatInput, setChatInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeMegaTrends, setActiveMegaTrends] = useState<Record<string, number>>({}); // messageId -> activeTrendNumber
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Track sidebar width for dynamic layout
  const [isLoadingThreads, setIsLoadingThreads] = useState(false);
  const [threads, setThreads] = useState<Array<{
    id: string;
    title: string;
    preview: string;
    timestamp: Date;
    messageCount: number;
  }>>([]);
  const [sessionHistory, setSessionHistory] = useState<Array<any>>([]); // Raw API response for loading conversations
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { messages, mode, setMode, addMessage, updateMessage, sessionId, clearChat, loadChatHistory, historyLoaded, isLoadingHistory } = useChatStore();
  const { user, isAuthenticated } = useAuthStore();


  // Load chat history on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && user && !historyLoaded && !isLoadingHistory) {
      const userId = user.user_id
      const userType = user.role || 'anonymous'

      loadChatHistory(userId, userType).then((result) => {
        if (result.success) {
          console.log('Chat history loaded successfully')
        } else {
          console.error('Failed to load chat history:', result.error)
          // Don't show error to user, just log it
        }
      })
    }
  }, [isAuthenticated, user, historyLoaded, isLoadingHistory, loadChatHistory])

  // Fetch session-based conversation history for sidebar
  useEffect(() => {
    const fetchSessionHistory = async () => {
      if (!isAuthenticated || !user) return;

      setIsLoadingThreads(true);
      try {
        const userId = user.user_id;
        const userType = user.role || 'admin';
        const res = await fetch(
          `https://agents-store.onrender.com/api/chat/history/${userId}?user_type=${userType}`,
          { headers: { accept: 'application/json' } }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            // Store raw data for loading conversations later
            setSessionHistory(data.data);

            // Transform to Thread format for sidebar
            const transformedThreads = data.data.map((session: any) => {
              // Get preview from first user message in conversation_summary
              const firstUserMsg = session.conversation_summary?.find(
                (msg: any) => msg.role === 'user'
              );
              const preview = firstUserMsg?.content?.substring(0, 60) || 'No messages';

              return {
                id: session.session_id,
                title: session.title || 'Untitled Conversation',
                preview: preview + (preview.length >= 60 ? '...' : ''),
                timestamp: new Date(session.last_message_at || session.created_at),
                messageCount: session.total_messages || 0,
              };
            });

            setThreads(transformedThreads);
          }
        }
      } catch (error) {
        console.error('Failed to fetch session history:', error);
      } finally {
        setIsLoadingThreads(false);
      }
    };

    fetchSessionHistory();
  }, [isAuthenticated, user]);

  // Function to clean markdown links from input field - prevents markdown links from appearing in input
  const cleanInputFromMarkdownLinks = (text: string): string => {
    if (!text) return text;
    // Remove markdown link patterns: [text](/agents/...) or [text](url)
    // Note: Don't use .trim() here as it removes leading/trailing spaces which breaks space bar input
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove complete markdown links, keep only the text
      .replace(/\[([^\]]+)\]\(/g, '$1'); // Handle incomplete markdown links
  };

  // Fetch agents list
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const apiAgents: Agent[] = (data?.agents || [])
            .filter((a: any) => a?.admin_approved === "yes")
            .map((a: any) => ({
              agent_id: a.agent_id,
              agent_name: a.agent_name,
              description: a.description,
              by_capability: a.by_capability,
              by_persona: a.by_persona,
              by_value: a.by_value,
              service_provider: a.service_provider,
              asset_type: a.asset_type,
            }));
          setAgents(apiAgents);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };

    fetchAgents();
  }, []);

  // Function to process text and replace agent names with markdown links that will be rendered as cards
  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;

    let processedText = text;

    // Sort agents by name length (longest first) to match longer names first
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);

    // Use a marker to avoid double-processing
    const processedMarkers = new Set<string>();

    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;

      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);

      // Match patterns like:
      // - "1. Agent Name" or "1) Agent Name"
      // - "Agent Name" (standalone or in context)
      const patterns = [
        // Pattern with number prefix: "1. Agent Name" or "1) Agent Name"
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        // Pattern without number: "Agent Name" at word boundaries
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];

      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          // Skip if already contains a link
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          // Create a markdown link that we'll detect and render as a card
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });

    return processedText;
  };

  // Function to extract agent names from text and render as cards
  const renderMessageWithAgentCards = (text: string): (string | React.ReactElement)[] => {
    if (!agents.length) return [text];

    const parts: (string | React.ReactElement)[] = [];
    const agentMatches: Array<{ agent: Agent; startIndex: number; endIndex: number; fullMatch: string }> = [];

    // Sort agents by name length (longest first) to match longer names first
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);

    // Find all agent mentions in the text
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Pattern for numbered list items: "1. Agent Name" or "1) Agent Name"
      // Also match with optional whitespace and handle cases where the number and agent are on separate lines
      const numberedPattern = new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n|\\r)`, 'gi');
      let match;

      while ((match = numberedPattern.exec(text)) !== null) {
        const startIndex = match.index;
        // Extend endIndex to include any trailing content on the same line
        let endIndex = match.index + match[0].length;

        // Look ahead to see if there's more content on the same line (description)
        const remainingText = text.substring(endIndex);
        const nextNewline = remainingText.indexOf('\n');
        const nextNumberedItem = remainingText.match(/^\s*\d+[.)]\s/);

        // If there's content before the next numbered item or newline, include it
        if (nextNewline !== -1 && (nextNumberedItem === null || nextNewline < remainingText.indexOf(nextNumberedItem[0]))) {
          // Include text up to the newline if it's part of the same item
          const lineContent = remainingText.substring(0, nextNewline).trim();
          if (lineContent && lineContent.length < 200) { // Reasonable description length
            endIndex = match.index + match[0].length + nextNewline;
          }
        } else if (nextNumberedItem && nextNumberedItem.index !== undefined) {
          // Stop at the next numbered item
          endIndex = match.index + match[0].length + nextNumberedItem.index;
        }

        // Check if this range overlaps with an existing match
        const overlaps = agentMatches.some(m =>
          (startIndex >= m.startIndex && startIndex < m.endIndex) ||
          (endIndex > m.startIndex && endIndex <= m.endIndex) ||
          (startIndex <= m.startIndex && endIndex >= m.endIndex)
        );

        if (!overlaps) {
          agentMatches.push({
            agent,
            startIndex,
            endIndex,
            fullMatch: match[0]
          });
        }
      }
    });

    // Sort by start index
    agentMatches.sort((a, b) => a.startIndex - b.startIndex);

    // If we found agent matches, render them as cards
    if (agentMatches.length > 0) {
      let lastIndex = 0;
      const agentGroups: Array<{ agents: Agent[]; startIndex: number; endIndex: number }> = [];
      let currentGroup: { agents: Agent[]; startIndex: number; endIndex: number } | null = null;

      // Group consecutive agents together
      agentMatches.forEach(({ agent, startIndex, endIndex }) => {
        const gap = startIndex - (currentGroup?.endIndex || 0);
        const isConsecutive = gap < 100; // Consider agents within 100 chars as consecutive

        if (isConsecutive && currentGroup) {
          currentGroup.agents.push(agent);
          currentGroup.endIndex = endIndex;
        } else {
          if (currentGroup) {
            agentGroups.push(currentGroup);
          }
          currentGroup = { agents: [agent], startIndex, endIndex };
        }
      });

      if (currentGroup) {
        agentGroups.push(currentGroup);
      }

      // Render groups and text
      agentGroups.forEach((group, groupIdx) => {
        // Add text before the group
        if (group.startIndex > lastIndex) {
          const beforeText = text.substring(lastIndex, group.startIndex);
          if (beforeText.trim()) {
            parts.push(beforeText);
          }
        }

        // Add agent carousel or single card
        if (group.agents.length > 1) {
          parts.push(<AgentCarousel key={`agent-carousel-${groupIdx}`} agents={group.agents} />);
        } else {
          parts.push(<AgentResponseCard key={`agent-card-${group.agents[0].agent_id}-${groupIdx}`} agent={group.agents[0]} />);
        }

        lastIndex = group.endIndex;
      });

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts;
    }

    return [text];
  };

  // Custom link component that renders agent links as cards
  const AgentLink = ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (!href || !href.startsWith('/agents/')) {
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    }

    const agentId = href.replace('/agents/', '');
    const agent = agents.find(a => a.agent_id === agentId);

    if (agent) {
      return <InlineAgentCard agent={agent} />;
    }

    return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle clearing chat
  const handleClearChat = async () => {
    if (isClearing) return;

    setIsClearing(true);
    setChatInput("");

    // Add a smooth fade-out animation effect
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.transition = 'opacity 0.3s ease-out';
      scrollContainerRef.current.style.opacity = '0.3';
    }

    try {
      // If there's an active session, delete it from the server
      if (activeThreadId && user) {
        const userId = user.user_id;
        const userType = user.role || 'admin';

        try {
          const res = await fetch(
            `https://agents-store.onrender.com/api/chat/history/${activeThreadId}?user_id=${userId}&user_type=${userType}`,
            {
              method: 'DELETE',
              headers: { accept: 'application/json' },
            }
          );

          if (res.ok) {
            // Remove the deleted session from local threads list
            setThreads(prev => prev.filter(t => t.id !== activeThreadId));
            setSessionHistory(prev => prev.filter((s: any) => s.session_id !== activeThreadId));
          }
        } catch (deleteError) {
          console.error('Failed to delete session from server:', deleteError);
        }

        // Clear active thread selection
        setActiveThreadId(undefined);
      }

      const result = await clearChat();

      if (result.success) {
        setFeedback({ type: 'success', message: 'Conversation cleared successfully!' });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to clear conversation' });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An error occurred while clearing' });
      setTimeout(() => setFeedback(null), 3000);
    } finally {
      setIsClearing(false);
      // Restore opacity
      if (scrollContainerRef.current) {
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.opacity = '1';
            scrollContainerRef.current.style.transition = '';
          }
        }, 100);
      }
    }
  };

  // Handle sending chat message
  const handleSendChatMessage = async (messageText: string) => {
    const timeString = formatTime();
    const userText = messageText;
    setFeedback({ type: 'success', message: 'Message sent!' });
    setTimeout(() => setFeedback(null), 2000);
    addMessage({ id: crypto.randomUUID(), role: "user", text: userText, time: timeString });
    setChatInput("");
    setIsSending(true);

    // Add thinking message immediately
    const thinkingMessageId = crypto.randomUUID();
    addMessage({ id: thinkingMessageId, role: "assistant", text: "AI thinking...", time: timeString });

    try {
      // Include user information for proper history saving
      const requestBody: any = {
        mode,
        query: userText,
        session_id: sessionId
      }

      // Add user_id and user_type if user is authenticated
      if (isAuthenticated && user) {
        requestBody.user_id = user.user_id
        requestBody.user_type = user.role || 'anonymous'
      } else {
        requestBody.user_id = 'anonymous'
        requestBody.user_type = 'anonymous'
      }

      const res = await fetch("https://agents-store.onrender.com/api/chat", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const json = await res.json().catch(() => null);
      if (!json || !json.data) {
        throw new Error("Invalid API response format");
      }

      const reply = json.data.response || "Sorry, something went wrong. Please try again later.";

      // Extract all API response data
      let filteredAgentIds = null;
      let filteredAgents = null;

      // Check if filtered_agents contains full objects or just IDs
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        // Check if first element is an object (full agent data) or string (just ID)
        if (typeof json.data.filtered_agents[0] === 'object' && json.data.filtered_agents[0] !== null) {
          // It's full agent objects
          filteredAgents = json.data.filtered_agents;
        } else {
          // It's just IDs
          filteredAgentIds = json.data.filtered_agents;
        }
      }

      // Also check for filtered_agents_full as a separate field
      if (!filteredAgents && json?.data?.filtered_agents_full && Array.isArray(json.data.filtered_agents_full) && json.data.filtered_agents_full.length > 0) {
        filteredAgents = json.data.filtered_agents_full;
      }

      // Extract mega_trends
      const megaTrends = json?.data?.mega_trends || null;

      // Extract suggested_agents
      const suggestedAgents = json?.data?.suggested_agents || null;
      // Extract gathered_info (create mode summary)
      const gatheredInfo = json?.data?.gathered_info || null;

      // Extract lets_build related data
      const letsBuildValue = json?.data?.lets_build;
      // Convert to boolean - handle true, "true", 1, etc.
      const letsBuild = Boolean(
        letsBuildValue === true ||
        letsBuildValue === "true" ||
        letsBuildValue === 1 ||
        letsBuildValue === "1"
      );
      const brdDownloadUrl = json?.data?.brd_download_url || null;
      const brdStatus = json?.data?.brd_status || null;

      const replyTs = json?.data?.timestamp
        ? formatDateTime(new Date(json.data.timestamp))
        : formatDateTime();

      // Replace thinking message with actual response including all API data
      updateMessage(thinkingMessageId, {
        text: reply,
        time: replyTs,
        filteredAgentIds,
        mega_trends: megaTrends,
        suggested_agents: suggestedAgents,
        filteredAgents: filteredAgents,
        gathered_info: gatheredInfo,
        letsBuild: letsBuild,
        letsBuildTimestamp: letsBuild ? Date.now() : undefined,
        brdDownloadUrl: brdDownloadUrl,
        brdStatus: brdStatus
      });
    } catch (e) {
      console.error("Error sending chat message:", e);
      const errTs = formatDateTime();
      updateMessage(thinkingMessageId, {
        text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      });
      setFeedback({ type: 'error', message: 'Failed to send message' });
      setTimeout(() => setFeedback(null), 2000);
    } finally {
      setIsSending(false);
    }
  }

  // Handle pending message from navigation
  useEffect(() => {
    if (!isMounted) return;

    const pendingMessage = sessionStorage.getItem('pendingChatMessage');
    if (pendingMessage) {
      sessionStorage.removeItem('pendingChatMessage');
      // Send the message after a short delay to ensure component is ready
      setTimeout(() => {
        handleSendChatMessage(pendingMessage);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollContainerRef.current && isMounted && messages.length > 0) {
      const scrollContainer = scrollContainerRef.current;
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 150);
    }
  }, [messages, isMounted]);

  // Auto-resize chat input - optimized with requestAnimationFrame
  const resizeTextarea = useRef<number | null>(null);

  useEffect(() => {
    const el = chatInputRef.current;
    if (!el) return;

    // Cancel any pending resize
    if (resizeTextarea.current) {
      cancelAnimationFrame(resizeTextarea.current);
    }

    // Use requestAnimationFrame for smoother resizing
    resizeTextarea.current = requestAnimationFrame(() => {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    });

    return () => {
      if (resizeTextarea.current) {
        cancelAnimationFrame(resizeTextarea.current);
      }
    };
  }, [chatInput]);

  // Enhanced Thinking Component with wave dots
  const SimpleThinking = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '') return '.';
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '';
        });
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-full py-2 px-2 relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 shimmer-bg" />
        <div className="relative flex items-center gap-2">
          <p
            className="text-sm"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: 400,
              letterSpacing: "0%",
              color: "#374151",
            }}
          >
            Thinking{dots}
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full wave-dot"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add CSS to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .chat-scroll-container::-webkit-scrollbar {
        display: none;
      }
      .chat-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .mega-trends-tabs-scroll::-webkit-scrollbar {
        display: none;
      }
      .mega-trends-tabs-scroll {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);


  return (
    // Root container: Locked to viewport height (h-dvh) to prevent body scroll.
    // Flex layout handles the vertical structure.
    <div
      className="flex flex-col h-dvh relative overflow-hidden"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Background images on left and right sides - greyed out */}
      <div
        className="fixed top-0 bottom-0 z-0 transition-all duration-300"
        style={{
          left: isSidebarOpen ? sidebarWidth : 0,
          width: "30%",
          backgroundImage: "url('/backgrop chat.png')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
          filter: "grayscale(100%) opacity(0.4)",
        }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-0"
        style={{
          width: "30%",
          backgroundImage: "url('/backgrop chat.png')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
          filter: "grayscale(100%) opacity(0.4)",
        }}
      />
      {/* Swipe to visit agent store - positioned on right side */}
      <SwipeToAgentStore />

      {/* Thread Sidebar */}
      <ThreadSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        threads={threads}
        activeThreadId={activeThreadId}
        onThreadSelect={(threadId) => {
          setActiveThreadId(threadId);

          // Find the session in stored history and load its messages
          const session = sessionHistory.find((s: any) => s.session_id === threadId);
          if (session && session.conversation_summary) {
            // Use async IIFE because clearChat is async
            (async () => {
              // Clear current chat first and WAIT for it to complete
              await clearChat();

              // Set chat mode based on session
              if (session.chat_mode === 'create' || session.chat_mode === 'explore') {
                setMode(session.chat_mode);
              }

              // Load messages from conversation_summary
              session.conversation_summary.forEach((msg: any, index: number) => {
                addMessage({
                  id: `${threadId}_msg_${index}`,
                  text: msg.content,
                  role: msg.role as 'user' | 'assistant',
                  time: new Date(session.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                });
              });
            })();
          }

          setIsSidebarOpen(false);
        }}
        onNewThread={() => {
          handleClearChat();
          setActiveThreadId(undefined);
          setIsSidebarOpen(false);
        }}
        onWidthChange={(width) => setSidebarWidth(width)}
      />

      {/* Floating Sidebar Toggle Button - Only visible when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-20 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-xl shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:bg-gray-50"
          title="Open conversation history"
        >
          <PanelLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Single scrollable container for entire chat */}
      {/* flex-1 enables it to take remaining space. overflow-y-auto enables internal scrolling. */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative z-10 chat-scroll-container transition-all duration-300"
        style={{
          marginLeft: isSidebarOpen ? sidebarWidth : 0,
          scrollBehavior: "smooth",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* IE and Edge */
        }}
      >
        {/* White background for center content area - extends full height */}
        <div
          className="fixed top-0 bottom-0 z-0"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: "1800px",
            maxWidth: "100%",
            backgroundImage: `
  linear-gradient(to right,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.3) 10%,
    rgba(255,255,255,0.6) 14%,
    rgba(255,255,255,0.85) 18%,
    white 25%,
    white 75%,
    rgba(255,255,255,0.85) 85%,
    rgba(255,255,255,0.6) 90%,
    rgba(255,255,255,0.3) 95%,
    rgba(255,255,255,0) 100%
  )
`,
          }}
        />
        {/* Centered content wrapper */}
        <div
          className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6"
          style={{
            paddingBottom: "220px", // Increased padding to prevent input overlap
            backgroundColor: "white",
          }}
        >
          <div className="space-y-4">
            {isLoadingHistory && (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>Loading chat history...</p>
                </div>
              </div>
            )}
            {isMounted && !isLoadingHistory && messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                style={{
                  animation: `fadeInSlideUp 0.3s ease-out ${index * 0.05}s both`,
                  width: "100%",
                }}
              >
                <div
                  className={`message-bubble ${message.role === "user" ? "rounded-2xl px-5 py-3" : ""}`}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    lineHeight: "22px",
                    fontWeight: 400,
                    backgroundColor: message.role === "user" ? "#1f2937" : "transparent",
                    color: message.role === "user" ? "#FFFFFF" : "#374151",
                    width: message.role === "user" ? "fit-content" : "100%",
                    maxWidth: message.role === "user" ? "80%" : "100%",
                    boxShadow: message.role === "user" ? "0 2px 8px rgba(0, 0, 0, 0.12)" : "none",
                  }}
                >
                  {message.role === "assistant" && message.text === "AI thinking..." ? (
                    <div
                      className="w-full rounded-2xl"
                      style={{
                        backgroundColor: "#F3F4F6",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        padding: "16px 20px",
                      }}
                    >
                      <SimpleThinking />
                    </div>
                  ) : message.role === "assistant" ? (
                    <div
                      className="w-full rounded-2xl"
                      style={{
                        backgroundColor: "#F3F4F6",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        padding: "20px",
                      }}
                    >
                      {/* Main Response */}
                      {(() => {
                        // Compute structured response once and reuse below to avoid
                        // rendering AI agent cards twice (StructuredResponseRenderer
                        // already renders agent cards for structured responses).
                        const respObj = getStructuredResponse(message.text);
                        if (respObj) {
                          return <StructuredResponseRenderer resp={respObj} />;
                        }

                        const { introText, agentMarkdown } = extractIntroAndAgentMarkdown(message.text);
                        return (
                          <>
                            {introText && (
                              <IntroText text={introText} agents={agents} />
                            )}
                            {agentMarkdown && (
                              <div className="mb-4">
                                <AgentInfoCard
                                  markdown={agentMarkdown}
                                  agents={agents}
                                  filteredAgentIds={message.filteredAgentIds}
                                />
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* Mega Trends */}
                      {message.mega_trends && (
                        <div className="mb-4">
                          <MegaTrendCard
                            markdown={message.mega_trends}
                            agents={agents}
                            messageId={message.id}
                            onTabChange={(trendNumber) => {
                              setActiveMegaTrends(prev => ({
                                ...prev,
                                [message.id]: trendNumber
                              }));
                            }}
                          />
                        </div>
                      )}

                      {/* Suggested Agents */}
                      {message.suggested_agents && Array.isArray(message.suggested_agents) && message.suggested_agents.length > 0 && (
                        <div className="mb-4">
                          <SuggestedAgents
                            suggested_agents={message.suggested_agents}
                            activeTrendNumber={activeMegaTrends[message.id]}
                          />
                        </div>
                      )}

                      {/* Gathered Info (Create mode) */}
                      {message.gathered_info && (
                        <div className="mb-4">
                          <GatheredInfoCard info={message.gathered_info} />
                        </div>
                      )}

                      {/* Filtered Agents (only when not already rendered by structured response) */}
                      {(!getStructuredResponse(message.text)) && message.filteredAgents && Array.isArray(message.filteredAgents) && message.filteredAgents.length > 0 && (
                        <div className="mb-4">
                          <AgentCarousel agents={message.filteredAgents} />
                        </div>
                      )}

                      {/* Lets Build Actions - Show when letsBuild is true */}
                      {!!message.letsBuild && (
                        <div className="mb-4" style={{ display: 'block', visibility: 'visible' }}>
                          <LetsBuildActions
                            brdDownloadUrl={message.brdDownloadUrl}
                            brdStatus={message.brdStatus}
                            letsBuildTimestamp={message.letsBuildTimestamp}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Render user message with agent cards or regular markdown */}
                      {(() => {
                        const messageParts = renderMessageWithAgentCards(message.text);
                        const hasAgentCards = messageParts.some(part => typeof part !== 'string');

                        // Common markdown components
                        const isUserMessage = message.role === "user";
                        const markdownComponents = {
                          h3: ({ children }: any) => {
                            const text = typeof children === 'string' ? children :
                              (Array.isArray(children) ? children.join('') : String(children));


                            return (
                              <h4 className="font-semibold mt-4 mb-1 first:mt-0" style={{ fontSize: '15px', color: isUserMessage ? "#FFFFFF" : "#111827" }}>
                                {children}
                              </h4>
                            );


                            return (
                              <h3
                                className="font-semibold mb-2 mt-3 first:mt-0"
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "21px",
                                  lineHeight: "1.2",
                                  color: isUserMessage ? "#FFFFFF" : "#111827",
                                }}
                              >
                                {children}
                              </h3>
                            );
                          },
                          p: ({ children }: any) => {
                            return <p className="mb-2 last:mb-0" style={{ color: isUserMessage ? "#FFFFFF" : "#4b5563", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
                          },
                          ul: ({ children }: any) => {
                            const processedChildren = Array.isArray(children)
                              ? children.map((child: any, index: number) => {
                                if (child?.props?.children) {
                                  const text = typeof child.props.children === 'string'
                                    ? child.props.children
                                    : (Array.isArray(child.props.children)
                                      ? child.props.children.join('')
                                      : String(child.props.children));

                                  if (typeof text === 'string' && (text.trim().startsWith('Description:') || text.trim().startsWith('Key Features:'))) {
                                    return null;
                                  }
                                }
                                return child;
                              }).filter(Boolean)
                              : children;

                            return <ul className="list-disc list-inside mb-2 space-y-1" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{processedChildren}</ul>;
                          },
                          ol: ({ children }: any) => {
                            // Check if any list items contain agent names
                            const hasAgentItems = Array.isArray(children) && children.some((child: any) => {
                              const text = typeof child?.props?.children === 'string'
                                ? child.props.children
                                : (Array.isArray(child?.props?.children)
                                  ? child.props.children.join('')
                                  : String(child?.props?.children || ''));

                              // Check if this text matches any agent name
                              return agents.some(agent => {
                                const agentName = agent.agent_name;
                                // Check if the text contains the agent name (possibly with number prefix)
                                return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                              });
                            });

                            if (hasAgentItems) {
                              // Extract agent cards from list items
                              const agentCards: React.ReactElement[] = [];
                              const otherItems: any[] = [];

                              if (Array.isArray(children)) {
                                children.forEach((child: any, index: number) => {
                                  const text = typeof child?.props?.children === 'string'
                                    ? child.props.children
                                    : (Array.isArray(child?.props?.children)
                                      ? child.props.children.join('')
                                      : String(child?.props?.children || ''));

                                  // Find matching agent
                                  const matchingAgent = agents.find(agent => {
                                    const agentName = agent.agent_name;
                                    return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                                  });

                                  if (matchingAgent) {
                                    agentCards.push(
                                      <AgentResponseCard key={`agent-card-${matchingAgent.agent_id}-${index}`} agent={matchingAgent} />
                                    );
                                  } else {
                                    otherItems.push(child);
                                  }
                                });
                              }

                              // Return agent cards, and if there are other items, render them as a list
                              return (
                                <>
                                  {agentCards}
                                  {otherItems.length > 0 && (
                                    <ol className="list-decimal list-inside mb-2 space-y-1">{otherItems}</ol>
                                  )}
                                </>
                              );
                            }

                            // Default: render as regular ordered list
                            return <ol className="list-decimal list-inside mb-2 space-y-1" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{children}</ol>;
                          },
                          li: ({ children }: any) => {
                            // Check if this is a section header like "Benefits:", "Description:", etc.
                            const textContent = extractTextFromChildren(children);
                            const sectionHeaders = ['benefits', 'description', 'value proposition', 'key features', 'features'];
                            const lowerText = textContent.toLowerCase().trim();

                            // Check if it starts with a section header (with or without bold)
                            const matchedHeader = sectionHeaders.find(header =>
                              lowerText.startsWith(header + ':') ||
                              lowerText.startsWith(header + ' :') ||
                              lowerText === header ||
                              lowerText === header + ':'
                            );

                            if (matchedHeader) {
                              // Render as a heading without bullet
                              return (
                                <div style={{ marginTop: "12px", marginBottom: "4px" }}>
                                  <span
                                    style={{
                                      color: isUserMessage ? "#FFFFFF" : "#111827",
                                      fontSize: "14px",
                                      lineHeight: "22px",
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {children}
                                  </span>
                                </div>
                              );
                            }

                            // Regular list item - render with bullet
                            return (
                              <li
                                className="ml-2 mb-1"
                                style={{
                                  color: isUserMessage ? "#FFFFFF" : "inherit",
                                  fontSize: "14px",
                                  lineHeight: "22px",
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 400,
                                }}
                              >
                                {children}
                              </li>
                            );
                          },
                          a: ({ href, children }: any) => <AgentLink href={href}>{children}</AgentLink>,
                          strong: ({ children }: any) => <strong className="font-semibold" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{children}</strong>,
                          code: ({ children }: any) => (
                            <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: isUserMessage ? "rgba(255, 255, 255, 0.2)" : "#E5E7EB", color: isUserMessage ? "#FFFFFF" : "inherit" }}>
                              {children}
                            </code>
                          ),
                        };

                        if (hasAgentCards) {
                          return (
                            <>
                              {messageParts.map((part, idx) => {
                                if (typeof part === 'string' && part.trim()) {
                                  return (
                                    <ReactMarkdown
                                      key={`text-${idx}`}
                                      remarkPlugins={[remarkGfm]}
                                      components={markdownComponents}
                                    >
                                      {processTextWithAgents(part
                                        .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                                        .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                                        .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                                        .replace(/^(Description:|Key Features:)/gm, '### $1')
                                        .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                                    </ReactMarkdown>
                                  );
                                } else if (typeof part !== 'string') {
                                  return <React.Fragment key={`card-${idx}`}>{part}</React.Fragment>;
                                }
                                return null;
                              })}
                            </>
                          );
                        }

                        // Regular markdown rendering
                        return (
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {processTextWithAgents(message.text
                              .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^(Description:|Key Features:)/gm, '### $1')
                              .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                          </ReactMarkdown>
                        );
                      })()}
                    </>
                  )}
                </div>
                {/* Timestamp */}
                {isMounted && (
                  <div
                    className={`mt-1.5 px-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      color: "#9CA3AF",
                      lineHeight: "1.4",
                    }}
                    suppressHydrationWarning
                  >
                    {message.time}
                  </div>
                )}
              </div>
            ))}
            {isMounted && <div ref={messagesEndRef} />}
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`fixed top-34 right-12 z-[60] px-5 py-3 rounded-xl shadow-lg ${feedback.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
            }`}
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px' }}
        >
          {feedback.message}
        </div>
      )}

      {/* Chat Input - Fixed at bottom */}
      <div
        className="fixed bottom-0 right-0 z-50 transition-all duration-300"
        style={{
          left: isSidebarOpen ? sidebarWidth : 0,
          background: "linear-gradient(to top, #f0ebebff 20%, transparent)",
          paddingTop: "14px",
          paddingBottom: "10px",
        }}
      >
        <div className="max-w-3xl mx-auto px-4">

          <div
            className="rounded-2xl bg-white p-4"
            style={{
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Input area */}
            <div className="mb-3">
              <textarea
                ref={chatInputRef}
                value={chatInput}
                onChange={(e) => {

                  const rawValue = e.target.value;
                  // Clean any markdown links that might have been inserted
                  const cleanedValue = cleanInputFromMarkdownLinks(rawValue);
                  setChatInput(cleanedValue);
                }}
                onPaste={(e) => {
                  // Handle paste events to clean markdown links
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text/plain');
                  const cleanedText = cleanInputFromMarkdownLinks(pastedText);

                  // Get cursor position and insert text at cursor
                  const target = e.target as HTMLTextAreaElement;
                  const start = target.selectionStart || 0;
                  const end = target.selectionEnd || 0;
                  const newValue = chatInput.slice(0, start) + cleanedText + chatInput.slice(end);

                  setChatInput(newValue);

                  // Restore cursor position after paste
                  setTimeout(() => {
                    const newCursorPos = start + cleanedText.length;
                    target.setSelectionRange(newCursorPos, newCursorPos);
                  }, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (chatInput.trim() && !isSending) {
                      handleSendChatMessage(chatInput.trim());
                    }
                  }
                }}
                placeholder="Ask me about AI agents..."
                className="w-full py-2 resize-none border-none focus:outline-none bg-transparent"
                style={{
                  fontSize: '15px',
                  lineHeight: '1.5',
                  minHeight: '44px',
                  maxHeight: '150px',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#1f2937',
                }}
                rows={1}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Mode toggle */}
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(value) => {
                  if (value) setMode(value as "explore" | "create");
                }}
                className="bg-gray-100 rounded-xl p-1"
              >
                <ToggleGroupItem
                  value="explore"
                  aria-label="Explore"
                  className="px-4 py-2 text-sm rounded-lg data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-500 transition-all"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Explore
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="create"
                  aria-label="Create"
                  className="px-4 py-2 text-sm rounded-lg data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-500 transition-all"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Create
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  disabled={isClearing}
                  className="relative h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group hover:bg-red-50"
                  style={{
                    backgroundColor: isClearing ? '#fee2e2' : '#f3f4f6',
                  }}
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  {isClearing ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" />
                  )}
                  {!isClearing && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 animate-pulse" />
                  )}
                </button>
                <div className="[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-xl [&>div>button:last-child]:bg-gray-100 [&>div>button:last-child]:hover:bg-gray-200 [&>div>button:last-child]:border-0">
                  <VoiceInputControls
                    value={chatInput}
                    onValueChange={setChatInput}
                    buttonSize="icon"
                    buttonVariant="outline"
                    ariaLabel="Use voice input for chat"
                  />
                </div>
                <button
                  onClick={() => {
                    if (chatInput.trim() && !isSending) {
                      handleSendChatMessage(chatInput.trim());
                    }
                  }}
                  disabled={!chatInput.trim() || isSending}
                  className="h-10 w-10 rounded-xl text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: chatInput.trim() && !isSending
                      ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
                      : "#d1d5db",
                    boxShadow: chatInput.trim() && !isSending
                      ? "0 2px 8px rgba(31, 41, 55, 0.3)"
                      : "none",
                  }}
                  aria-label="Submit message"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
