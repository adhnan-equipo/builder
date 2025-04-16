import type { FormElementCategory } from "./types"
import {
  Type,
  Image,
  TextCursor,
  Hash,
  AlignLeft,
  FileText,
  CheckSquare,
  ListChecks,
  List,
  ChevronsUpDown,
  ToggleLeft,
  CalendarDays,
  Calendar,
  Clock,
  Layers,
  SeparatorHorizontal,
  Layout,
} from "lucide-react"

export const formElementsData: FormElementCategory[] = [
  {
    id: "layout",
    name: "Layout Elements",
    elements: [
      { type: "heading", label: "Heading", icon: Type },
      { type: "description", label: "Description", icon: AlignLeft },
      { type: "group-logo", label: "Group Logo", icon: Image },
      { type: "section", label: "Section", icon: Layers },
      { type: "separator", label: "Separator", icon: SeparatorHorizontal },
      { type: "custom-header", label: "Custom Header", icon: Layout },
      { type: "custom-footer", label: "Custom Footer", icon: SeparatorHorizontal },
    ],
  },
  {
    id: "text",
    name: "Text Elements",
    elements: [
      { type: "single-line", label: "Single Line", icon: TextCursor },
      { type: "number", label: "Number", icon: Hash },
      { type: "multi-line", label: "Multi-line", icon: AlignLeft },
      { type: "rich-text", label: "Rich Text", icon: FileText },
    ],
  },
  {
    id: "multi",
    name: "Multi Elements",
    elements: [
      { type: "checklist", label: "Checklist", icon: ListChecks },
      { type: "multi-choice", label: "Multi-choice", icon: List },
      { type: "dropdown", label: "Dropdown", icon: ChevronsUpDown },
      { type: "combobox", label: "Combobox", icon: ChevronsUpDown },
      { type: "checkbox", label: "Checkbox", icon: CheckSquare },
      { type: "switch", label: "Switch", icon: ToggleLeft },
    ],
  },
  {
    id: "date",
    name: "Date Elements",
    elements: [
      { type: "date", label: "Date", icon: Calendar },
      { type: "date-range", label: "Date Range", icon: CalendarDays },
      { type: "time", label: "Time", icon: Clock },
    ],
  },
]
