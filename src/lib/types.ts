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
  required?: boolean
  validation?: ValidationRule[]
  placeholder?: string
  defaultValue?: any
  options?: { label: string; value: string }[]
  conditionalDisplay?: ConditionalRule
  style?: ElementStyle
  children?: FormElement[]
}

export interface ValidationRule {
  type: "required" | "regex" | "minLength" | "maxLength" | "min" | "max" | "email" | "custom"
  value?: any
  message?: string
  regex?: string
}

export interface ConditionalRule {
  elementId: string
  operator: "equals" | "notEquals" | "contains" | "greater" | "less"
  value: any
}

export interface ElementStyle {
  padding?: string
  margin?: string
  color?: string
  backgroundColor?: string
  fontFamily?: string
  fontSize?: string
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

export interface Section {
  id: string
  title: string
  description?: string
  elements: FormElement[]
}

export interface FormData {
  id: string
  title: string
  description?: string
  elements: FormElement[]
  createdAt: Date
  updatedAt: Date
}