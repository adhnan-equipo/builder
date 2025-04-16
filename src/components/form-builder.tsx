"use client"
import { useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import ElementSidebar from "./element-sidebar"
import FormCanvas from "./form-canvas"
import type { FormElement } from "../lib/types"
import { Button } from "../components/ui/button"
import { Eye, EyeOff, Code, Download, Save } from "lucide-react"
import { useToast } from "../hooks/use-toast"

export default function FormBuilder() {
  const [formElements, setFormElements] = useState<FormElement[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState<"editor" | "json">("editor")
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const { toast } = useToast()

  const handleDrop = (item: FormElement) => {
    setFormElements((prev) => [
      ...prev,
      {
        ...item,
        id: `${item.type}-${Date.now()}`,
        index: prev.length,
        required: false,
        validation: [],
        placeholder: item.type === "single-line" ? "Enter text here" : undefined,
        options: ["multi-choice", "dropdown", "checklist"].includes(item.type)
            ? [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" }
            ]
            : undefined,
      },
    ])
  }

  const handleUpdateElement = (id: string, updates: Partial<FormElement>) => {
    setFormElements(prev =>
        prev.map(element =>
            element.id === id ? { ...element, ...updates } : element
        )
    )
  }

  const handleRemoveElement = (id: string) => {
    setFormElements((prev) => {
      const filtered = prev.filter((element) => element.id !== id)
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

      newElements.splice(dragIndex, 1)
      newElements.splice(hoverIndex, 0, dragItem)

      return newElements.map((element, index) => ({
        ...element,
        index,
      }))
    })
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
  }

  const handleSaveForm = () => {
    const json = JSON.stringify({
      title: formTitle,
      elements: formElements,
      createdAt: new Date(),
      updatedAt: new Date()
    }, null, 2)

    // Save to localStorage for demo purposes
    const savedForms = JSON.parse(localStorage.getItem("savedForms") || "[]")
    const newForm = {
      id: Date.now().toString(),
      title: formTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    localStorage.setItem("savedForms", JSON.stringify([...savedForms, newForm]))
    localStorage.setItem(`form-${newForm.id}`, json)

    toast({
      title: "Form Saved",
      description: "Your form has been saved successfully",
    })
  }

  const handleExportJSON = () => {
    const json = JSON.stringify({
      title: formTitle,
      elements: formElements,
      createdAt: new Date(),
      updatedAt: new Date()
    }, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formTitle.replace(/\s+/g, '-').toLowerCase()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportHTML = () => {
    // Generate HTML from the form elements
    let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formTitle}</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-50 p-8">
      <div class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-6">${formTitle}</h1>
        <form>
    `

    // Add HTML for each form element
    formElements.forEach(element => {
      switch(element.type) {
        case "heading":
          html += `<h2 class="text-xl font-semibold my-4">${element.label}</h2>\n`
          break
        case "description":
          html += `<p class="text-gray-600 mb-4">${element.label}</p>\n`
          break
        case "single-line":
          html += `
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="${element.id}">${element.label}${element.required ? ' *' : ''}</label>
            <input type="text" id="${element.id}" name="${element.id}" class="w-full p-2 border rounded-md" ${element.placeholder ? `placeholder="${element.placeholder}"` : ''}>
          </div>\n`
          break
        case "multi-line":
          html += `
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1" for="${element.id}">${element.label}${element.required ? ' *' : ''}</label>
            <textarea id="${element.id}" name="${element.id}" rows="4" class="w-full p-2 border rounded-md" ${element.placeholder ? `placeholder="${element.placeholder}"` : ''}></textarea>
          </div>\n`
          break
          // Add more cases for other element types
      }
    })

    html += `
          <div class="mt-6">
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit</button>
          </div>
        </form>
      </div>
    </body>
    </html>
    `

    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${formTitle.replace(/\s+/g, '-').toLowerCase()}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen overflow-hidden">
          {!isPreviewMode && <ElementSidebar />}
          <div className="flex-1 flex flex-col">
            <div className="border-b border-border p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="font-cursive text-3xl font-bold text-primary bg-transparent border-none focus:outline-none focus:ring-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab(activeTab === "editor" ? "json" : "editor")} className="flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  <span>{activeTab === "editor" ? "View JSON" : "View Editor"}</span>
                </Button>
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
            </div>

            {activeTab === "editor" ? (
                <FormCanvas
                    formElements={formElements}
                    onDrop={handleDrop}
                    onUpdateElement={handleUpdateElement}
                    onRemoveElement={handleRemoveElement}
                    onMoveElement={handleMoveElement}
                    isPreviewMode={isPreviewMode}
                />
            ) : (
                <div className="flex-1 p-6 overflow-auto">
              <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify({ title: formTitle, elements: formElements }, null, 2)}
              </pre>
                </div>
            )}

            <div className="p-6 border-t border-border text-right">
              <Button
                  className="inline-block px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                  onClick={() => setFormElements([])}
              >
                Clear Form
              </Button>
              <Button
                  className="inline-block px-4 py-2 ml-2 text-white bg-green-500 rounded-md hover:bg-green-600"
                  onClick={handleSaveForm}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Form
              </Button>
              <Button
                  className="inline-block px-4 py-2 ml-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={handleExportJSON}
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                  className="inline-block px-4 py-2 ml-2 text-white bg-purple-500 rounded-md hover:bg-purple-600"
                  onClick={handleExportHTML}
              >
                <Download className="h-4 w-4 mr-2" />
                Export HTML
              </Button>
            </div>
          </div>
        </div>
      </DndProvider>
  )
}