import type { LucideIcon } from "lucide-react"

export type FormElementType =
  // Layout Elements
  | "heading"
  | "description"
  | "group-logo"
  | "section"
  | "separator"
  | "custom-header"
  | "custom-footer"
  // Text Elements
  | "single-line"
  | "number"
  | "multi-line"
  | "rich-text"
  // Multi Elements
  | "checklist"
  | "multi-choice"
  | "dropdown"
  | "combobox"
  | "checkbox"
  | "switch"
  // Date Elements
  | "date"
  | "date-range"
  | "time"

export interface FormElement {
  id?: string
  type: FormElementType
  label: string
  index?: number
  children?: FormElement[];
  isSection?: boolean;
}

export interface FormElementCategory {
  id: string
  name: string
  elements: {
    type: FormElementType
    label: string
    icon: LucideIcon
  }[]
}

// Add these types to your existing types file

export interface Section {
  id: string;
  title: string;
  description?: string;
  elements: FormElement[];
}


