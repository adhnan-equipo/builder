import { useRef } from "react"
import { useDrop, useDrag, type DropTargetMonitor } from "react-dnd"
import type { FormElement } from "../lib/types"
import { renderFormElement } from "../lib/render-form-element"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Trash2, GripVertical, Settings } from "lucide-react"
import type { XYCoord } from "dnd-core"
import { ElementPropertiesDialog } from "./element-properties-dialog"
import { useState } from "react"

interface DragItem {
  index: number
  id: string
  type: string
}

interface FormCanvasProps {
  formElements: FormElement[]
  onDrop: (item: FormElement) => void
  onUpdateElement: (id: string, updates: Partial<FormElement>) => void
  onRemoveElement: (id: string) => void
  onMoveElement: (dragIndex: number, hoverIndex: number) => void
  isPreviewMode: boolean
}

export default function FormCanvas({
                                     formElements,
                                     onDrop,
                                     onUpdateElement,
                                     onRemoveElement,
                                     onMoveElement,
                                     isPreviewMode,
                                   }: FormCanvasProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "form-element",
    drop: (item: FormElement) => {
      onDrop(item)
      return undefined
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const [activeElement, setActiveElement] = useState<FormElement | null>(null)
  const [isPropertiesDialogOpen, setIsPropertiesDialogOpen] = useState(false)

  return (
      <>
        <div className="flex-1 p-6 overflow-y-auto bg-muted/30">
          <div className="max-w-3xl mx-auto">
            {!isPreviewMode && (
                <Card className="mb-4">
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-2">Form Builder</h1>
                    <p className="text-muted-foreground">Drag and drop elements from the left sidebar to build your form.</p>
                  </CardContent>
                </Card>
            )}

            <div
                ref={drop}
                className={`min-h-[calc(90vh-200px)] bg-background border-2 ${
                    isPreviewMode ? "border-none shadow-sm" : "border-dashed"
                } rounded-lg p-6 transition-colors ${
                    isOver && !isPreviewMode ? "border-primary bg-primary/5" : "border-border"
                }`}
            >
              {formElements.length === 0 ? (
                  !isPreviewMode && (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-12">
                        <p className="mb-2">Drop form elements here to build your form</p>
                        <p className="text-sm">Your form will appear here as you add elements</p>
                      </div>
                  )
              ) : (
                  <div className="space-y-6">
                    {formElements.map((element, index) => (
                        <FormElementItem
                            key={element.id}
                            element={element}
                            index={index}
                            onRemoveElement={onRemoveElement}
                            onMoveElement={onMoveElement}
                            isPreviewMode={isPreviewMode}
                            onEditProperties={() => {
                              setActiveElement(element)
                              setIsPropertiesDialogOpen(true)
                            }}
                        />
                    ))}
                  </div>
              )}
            </div>
          </div>
        </div>

        {activeElement && (
            <ElementPropertiesDialog
                element={activeElement}
                open={isPropertiesDialogOpen}
                onOpenChange={setIsPropertiesDialogOpen}
                onUpdate={(updates) => {
                  if (activeElement.id) {
                    onUpdateElement(activeElement.id, updates)
                  }
                }}
            />
        )}
      </>
  )
}

interface FormElementItemProps {
  element: FormElement
  index: number
  onRemoveElement: (id: string) => void
  onMoveElement: (dragIndex: number, hoverIndex: number) => void
  isPreviewMode: boolean
  onEditProperties: () => void
}

function FormElementItem({
                           element,
                           index,
                           onRemoveElement,
                           onMoveElement,
                           isPreviewMode,
                           onEditProperties
                         }: FormElementItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag, preview] = useDrag({
    type: "form-element-item",
    item: () => {
      return { id: element.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "form-element-item",
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      onMoveElement(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  drag(drop(ref))

  return (
      <div
          ref={preview}
          className={`${isDragging ? "opacity-50" : "opacity-100"} ${isPreviewMode ? "" : "relative group"}`}
      >
        {!isPreviewMode && (
            <>
              <div
                  ref={ref}
                  className="absolute left-2 top-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <GripVertical className="h-4 w-4" />
                  <span className="sr-only">Drag to reorder</span>
                </Button>
              </div>
              <div className="absolute right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={onEditProperties} className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Element properties</span>
                </Button>
              </div>
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="destructive" size="icon" onClick={() => onRemoveElement(element.id!)} className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove element</span>
                </Button>
              </div>
            </>
        )}
        <div
            className={`border ${isPreviewMode ? "" : "border-border"} rounded-md p-4 ${
                !isPreviewMode ? "hover:border-primary/50 transition-colors" : ""
            } ${isPreviewMode ? "shadow-none border-none" : ""} ${
                element.required && !isPreviewMode ? "border-l-4 border-l-red-500" : ""
            }`}
            style={element.style}
        >
          {renderFormElement(element, isPreviewMode)}
          {element.required && isPreviewMode && (
              <span className="text-red-500 text-sm ml-1">*</span>
          )}
        </div>
      </div>
  )
}