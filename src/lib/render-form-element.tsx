import type { FormElement } from "./types"
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
import { PopoverEditor } from "@/components/shared/PopoverEditor"
import { useState, useCallback } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

// Editable text component with TipTap
function EditableText({ 
  defaultContent, 
  className, 
  headingLevel = 0 
}: { 
  defaultContent: string; 
  className?: string; 
  headingLevel?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: headingLevel ? 
      `<h${headingLevel}>${defaultContent}</h${headingLevel}>` : 
      `<p>${defaultContent}</p>`,
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
      <PopoverEditor editor={editor} />
    </div>
  );
}

export function renderFormElement(element: FormElement) {
  switch (element.type) {
    // Layout Elements
    case "heading":
      return (
        <EditableText 
          defaultContent="Sample Heading" 
          className="text-2xl font-bold cursor-text" 
          headingLevel={2}
        />
      )
    case "description":
      return (
        <EditableText 
          defaultContent="This is a sample description text for your form." 
          className="text-muted-foreground cursor-text"
        />
      )
      case "group-logo":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative bg-muted rounded-md p-6 mb-4 flex flex-col items-center justify-center gap-2 w-full">
              {(() => {
                const [imageUrl, setImageUrl] = useState<string | null>(null);
                const [imageSize, setImageSize] = useState({ width: 100, height: 100 });
                
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
                          style={{ 
                            width: `${imageSize.width}px`, 
                            height: `${imageSize.height}px`,
                            objectFit: 'contain'
                          }} 
                        />
                        {/* <div className="flex gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="logo-width">Width (px)</Label>
                            <Input 
                              id="logo-width" 
                              type="number" 
                              value={imageSize.width} 
                              onChange={(e) => setImageSize(prev => ({ ...prev, width: parseInt(e.target.value) || 50 }))}
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="logo-height">Height (px)</Label>
                            <Input 
                              id="logo-height" 
                              type="number" 
                              value={imageSize.height} 
                              onChange={(e) => setImageSize(prev => ({ ...prev, height: parseInt(e.target.value) || 50 }))}
                              className="w-24"
                            />
                          </div>
                        </div> */}
                      </div>
                    ) : (
                      <>
                        <Image className="h-10 w-10 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Upload your logo</p>
                        </div>
                      </>
                    )}
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
                    {/* {imageUrl && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2 mt-2" 
                        onClick={() => setImageUrl(null)}
                      >
                        Remove Logo
                      </Button>
                    )} */}
                  </>
                );
              })()}
            </div>
          </div>
        )
      

    // Text Elements
    case "single-line":
      return (
        <div className="space-y-2">
          <Label htmlFor="single-line">Text Field</Label>
          <Input id="single-line" placeholder="Enter text here" />
        </div>
      )
    case "number":
      return (
        <div className="space-y-2">
          <Label htmlFor="number">Number</Label>
          <Input id="number" type="number" placeholder="0" />
        </div>
      )
    case "multi-line":
      return (
        <div className="space-y-2">
          <Label htmlFor="multi-line">Multi-line Text</Label>
          <Textarea id="multi-line" placeholder="Enter longer text here" />
        </div>
      )
    case "rich-text":
      return (
        <RichTextEditor />
      )

    // Multi Elements
    case "checklist":
      return (
        <div className="space-y-3">
          <Label>Checklist</Label>
          <div className="space-y-2">
            {["Option 1", "Option 2", "Option 3"].map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`checklist-${option}`}
                  className="data-[state=checked]:bg-blue-500 border-blue-900"
                />
                <Label htmlFor={`checklist-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        </div>
      )
    case "multi-choice":
      return (
        <div className="space-y-3">
          <Label>Multiple Choice</Label>
          <RadioGroup defaultValue="option-1">
            {["Option 1", "Option 2", "Option 3"].map((option, index) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={`option-${index + 1}`} id={`option-${index + 1}`} />
                <Label htmlFor={`option-${index + 1}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )
    case "dropdown":
      return (
        <div className="space-y-2">
          <Label htmlFor="dropdown">Dropdown</Label>
          <Select>
            <SelectTrigger id="dropdown">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "combobox":
      return (
        <div className="space-y-2">
          <Label htmlFor="combobox">Combobox</Label>
          <Select>
            <SelectTrigger id="combobox">
              <SelectValue placeholder="Select or type an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id="checkbox" />
          <Label htmlFor="checkbox">Checkbox option</Label>
        </div>
      )
    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch id="switch" className="data-[state=checked]:bg-blue-500" />
          <Label htmlFor="switch">Toggle switch</Label>
        </div>
      )

    // Date Elements
    case "date":
      return (
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal" id="date">
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
          <Label htmlFor="date-range">Date Range</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                <Button variant="outline" className="w-full justify-start text-left font-normal">
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
          <Label htmlFor="time">Time</Label>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="time" id="time" />
            <Button variant="outline" size="icon">
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )
    default:
      return <div>Unknown element type</div>
  }
}
