import { FormElement } from "./types"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { Switch } from "../components/ui/switch"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"
import { Button } from "../components/ui/button"
import { CalendarIcon, Clock, Upload, Image } from "lucide-react"
import RichTextEditor from "@/components/shared/RichTextEditor"
import { useState, useCallback } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

// Editable text component with TipTap
function EditableText({
                        defaultContent,
                        className,
                        headingLevel = 0,
                        isPreviewMode = false
                      }: {
  defaultContent: string;
  className?: string;
  headingLevel?: number;
  isPreviewMode?: boolean;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: headingLevel ?
        `<h${headingLevel}>${defaultContent}</h${headingLevel}>` :
        `<p>${defaultContent}</p>`,
    editable: !isPreviewMode,
    editorProps: {
      attributes: {
        class: `focus:outline-none ${className}`,
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
      <div className="editable-text-container">
        <EditorContent editor={editor} />
        {!isPreviewMode && editor && (
            <div className="text-xs text-muted-foreground mt-1">
              Click to edit text
            </div>
        )}
      </div>
  );
}

export function renderFormElement(element: FormElement, isPreviewMode: boolean = false) {
  // Special handling for required fields in preview mode
  const labelWithRequired = (labelText: string) => (
      <span>
      {labelText}
        {element.required && isPreviewMode && <span className="text-red-500 ml-1">*</span>}
    </span>
  )

  switch (element.type) {
      // Layout Elements
    case "heading":
      return (
          <EditableText
              defaultContent={element.label || "Sample Heading"}
              className="text-2xl font-bold cursor-text"
              headingLevel={2}
              isPreviewMode={isPreviewMode}
          />
      )
    case "description":
      return (
          <EditableText
              defaultContent={element.label || "This is a sample description text for your form."}
              className="text-muted-foreground cursor-text"
              isPreviewMode={isPreviewMode}
          />
      )
    case "group-logo":
      return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative bg-muted rounded-md p-6 mb-4 flex flex-col items-center justify-center gap-2 w-full">
              {(() => {
                const [imageUrl, setImageUrl] = useState<string | null>(null);

                const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImageUrl(url);
                  }
                }, []);

                return (
                    <>
                      {imageUrl ? (
                          <div className="flex flex-col items-center gap-4">
                            <img
                                src={imageUrl}
                                alt="Uploaded logo"
                                className="max-w-full max-h-[200px] object-contain"
                            />
                          </div>
                      ) : (
                          <>
                            <Image className="h-10 w-10 text-muted-foreground" />
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Upload your logo</p>
                            </div>
                          </>
                      )}
                      {!isPreviewMode && (
                          <>
                            <input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 mt-4"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                              <Upload className="h-4 w-4" />
                              {imageUrl ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                          </>
                      )}
                    </>
                );
              })()}
            </div>
          </div>
      )

    case "separator":
      return <hr className="my-4 border-t border-gray-200" />

      // Text Elements
    case "single-line":
      return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>{labelWithRequired(element.label)}</Label>
            <Input
                id={element.id}
                placeholder={element.placeholder || "Enter text here"}
                defaultValue={element.defaultValue || ""}
                disabled={isPreviewMode && false} // In a real app, you'd make this actually disabled
                required={isPreviewMode && element.required}
            />
          </div>
      )
    case "number":
      return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>{labelWithRequired(element.label)}</Label>
            <Input
                id={element.id}
                type="number"
                placeholder={element.placeholder || "0"}
                defaultValue={element.defaultValue || ""}
                disabled={isPreviewMode && false}
                required={isPreviewMode && element.required}
            />
          </div>
      )
    case "multi-line":
      return (
          <div className="space-y-2">
            <Label htmlFor={element.id}>{labelWithRequired(element.label)}</Label>
            <Textarea
                id={element.id}
                placeholder={element.placeholder || "Enter longer text here"}
                defaultValue={element.defaultValue || ""}
                disabled={isPreviewMode && false}
                required={isPreviewMode && element.required}
            />
          </div>
      )
    case "rich-text":
      return (
          <div className="space-y-2">
            <Label>{labelWithRequired(element.label)}</Label>
            <RichTextEditor />
          </div>
      )

      // Multi Elements
    case "checklist":
      return (
          <div className="space-y-3">
            <Label>{labelWithRequired(element.label)}</Label>
            <div className="space-y-2">
              {(element.options || [{ label: "Option 1", value: "option1" }]).map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                        id={`checklist-${element.id}-${option.value}`}
                        className="data-[state=checked]:bg-blue-500 border-blue-900"
                        disabled={isPreviewMode && false}
                    />
                    <Label htmlFor={`checklist-${element.id}-${option.value}`}>{option.label}</Label>
                  </div>
              ))}
            </div>
          </div>
      )
    case "multi-choice":
      return (
          <div className="space-y-3">
            <Label>{labelWithRequired(element.label)}</Label>
            <RadioGroup defaultValue={element.defaultValue || undefined}>
              {(element.options || [
                { label: "Option 1", value: "option1" },
                { label: "Option 2", value: "option2" },
                { label: "Option 3", value: "option3" }
              ]).map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem
                        value={option.value}
                        id={`option-${element.id}-${option.value}`}
                        disabled={isPreviewMode && false}
                    />
                    <Label htmlFor={`option-${element.id}-${option.value}`}>{option.label}</Label>
                  </div>
              ))}
            </RadioGroup>
          </div>
      )
    case "dropdown":
      return (
          <div className="space-y-2">
            <Label htmlFor={`dropdown-${element.id}`}>{labelWithRequired(element.label)}</Label>
            <Select defaultValue={element.defaultValue || undefined} disabled={isPreviewMode && false}>
              <SelectTrigger id={`dropdown-${element.id}`}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {(element.options || [
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" }
                ]).map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
      )
    case "checkbox":
      return (
          <div className="flex items-center space-x-2">
            <Checkbox
                id={`checkbox-${element.id}`}
                defaultChecked={element.defaultValue === "true"}
                disabled={isPreviewMode && false}
            />
            <Label htmlFor={`checkbox-${element.id}`}>{labelWithRequired(element.label)}</Label>
          </div>
      )
    case "switch":
      return (
          <div className="flex items-center space-x-2">
            <Switch
                id={`switch-${element.id}`}
                className="data-[state=checked]:bg-blue-500"
                defaultChecked={element.defaultValue === "true"}
                disabled={isPreviewMode && false}
            />
            <Label htmlFor={`switch-${element.id}`}>{labelWithRequired(element.label)}</Label>
          </div>
      )

      // Date Elements
    case "date":
      return (
          <div className="space-y-2">
            <Label htmlFor={`date-${element.id}`}>{labelWithRequired(element.label)}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    id={`date-${element.id}`}
                    disabled={isPreviewMode && false}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Pick a date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" />
              </PopoverContent>
            </Popover>
          </div>
      )
    case "date-range":
      return (
          <div className="space-y-2">
            <Label htmlFor={`date-range-${element.id}`}>{labelWithRequired(element.label)}</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isPreviewMode && false}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Start date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isPreviewMode && false}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>End date</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" />
                </PopoverContent>
              </Popover>
            </div>
          </div>
      )
    case "time":
      return (
          <div className="space-y-2">
            <Label htmlFor={`time-${element.id}`}>{labelWithRequired(element.label)}</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                  type="time"
                  id={`time-${element.id}`}
                  disabled={isPreviewMode && false}
              />
              <Button
                  variant="outline"
                  size="icon"
                  disabled={isPreviewMode && false}
              >
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>
      )
    default:
      return <div>Unknown element type</div>
  }
}