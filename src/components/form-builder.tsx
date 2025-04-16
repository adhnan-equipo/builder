"use client"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ElementSidebar from "./element-sidebar"
import FormCanvas from "./form-canvas"
import type { FormElement } from "../lib/types"
import { Button } from "../components/ui/button"
import { Eye, EyeOff } from "lucide-react"

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const handleDrop = (item: FormElement) => {
    setFormElements((prev) => [
      ...prev,
      {
        ...item,
        id: `${item.type}-${Date.now()}`,
        index: prev.length,
      },
    ])
  }

  const handleRemoveElement = (id: string) => {
    setFormElements((prev) => {
      const filtered = prev.filter((element) => element.id !== id)
      // Re-index the elements
      return filtered.map((element, index) => ({
        ...element,
        index,
      }))
    })
  }

  const handleMoveElement = (dragIndex: number, hoverIndex: number) => {
    setFormElements((prev) => {
      const newElements = [...prev]
      const dragItem = newElements[dragIndex]

      // Remove the dragged item
      newElements.splice(dragIndex, 1)
      // Insert it at the new position
      newElements.splice(hoverIndex, 0, dragItem)

      // Update indices
      return newElements.map((element, index) => ({
        ...element,
        index,
      }))
    })
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen overflow-hidden">
        {!isPreviewMode && <ElementSidebar />}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-border p-4 flex justify-between items-center">
            <h1
              className="font-cursive text-3xl font-bold text-primary cursor-pointer"
              onClick={() => {
                if (!isPreviewMode) {
                  window.location.href = '/formList';
                }
              }}
            >
              {isPreviewMode ? "Form Preview" : "Equipo Form Builder"}
            </h1>
            <Button variant="outline" size="sm" onClick={togglePreviewMode} className="flex items-center gap-1">
              {isPreviewMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Exit Preview</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </>
              )}
            </Button>
          </div>
          <FormCanvas
            formElements={formElements}
            onDrop={handleDrop}
            onRemoveElement={handleRemoveElement}
            onMoveElement={handleMoveElement}
            isPreviewMode={isPreviewMode}
          />
          <div className="p-6  text-right">
            <Button
              className="inline-block px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
              onClick={() => setFormElements([])}
            >
              Clear Form
            </Button>
            <Button
              className="inline-block px-4 py-2 ml-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
              onClick={() => {
                const json = JSON.stringify(formElements, null, 2);
                const blob = new Blob([json], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "form.json";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Save Form
            </Button>
          </div>

        </div>
      </div>
    </DndProvider>
  )
}

