
import { useState } from "react"
import { useDrag } from "react-dnd"
import { Input } from "../components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion"
import { Search } from "lucide-react"
import { formElementsData } from "../lib/form-elements-data"
import type { FormElementType } from "../lib/types"
import type { LucideIcon } from "lucide-react"

export default function ElementSidebar() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredElements = searchQuery
    ? formElementsData
        .flatMap((category) => ({
          ...category,
          elements: category.elements.filter((element) =>
            element.label.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
        }))
        .filter((category) => category.elements.length > 0)
    : formElementsData

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold mb-4">Form Elements</h2>
        <p className="text-sm text-muted-foreground mb-4">Drag elements to the right</p>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Elements"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <Accordion type="multiple" defaultValue={["layout", "text", "multi", "date"]}>
          {filteredElements.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="px-4">{category.name}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-2 p-2">
                  {category.elements.map((element) => (
                    <DraggableElement key={element.type} element={element} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

function DraggableElement({
  element,
}: {
  element: {
    type: FormElementType
    label: string
    icon: LucideIcon
  }
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "form-element",
    item: { type: element.type, label: element.label },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  const Icon = element.icon

  return (
    <div
      ref={drag}
      className={`p-3 border border-border rounded-md bg-background cursor-move hover:bg-accent hover:text-accent-foreground transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span>{element.label}</span>
      </div>
    </div>
  )
}

