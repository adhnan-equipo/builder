import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { FormElement, ValidationRule } from "../lib/types"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { useState } from "react"
import { Checkbox } from "./ui/checkbox"
import { Textarea } from "./ui/textarea"

interface ElementPropertiesDialogProps {
    element: FormElement
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdate: (updates: Partial<FormElement>) => void
}

export function ElementPropertiesDialog({
                                            element,
                                            open,
                                            onOpenChange,
                                            onUpdate
                                        }: ElementPropertiesDialogProps) {
    const [label, setLabel] = useState(element.label)
    const [required, setRequired] = useState(element.required || false)
    const [placeholder, setPlaceholder] = useState(element.placeholder || "")
    const [defaultValue, setDefaultValue] = useState(element.defaultValue || "")
    const [validation, setValidation] = useState<ValidationRule[]>(element.validation || [])
    const [options, setOptions] = useState<{label: string, value: string}[]>(
        element.options || [{ label: "Option 1", value: "option1" }]
    )

    // For styling properties
    const [padding, setPadding] = useState(element.style?.padding || "")
    const [margin, setMargin] = useState(element.style?.margin || "")
    const [color, setColor] = useState(element.style?.color || "")
    const [backgroundColor, setBackgroundColor] = useState(element.style?.backgroundColor || "")

    const hasOptions = ["dropdown", "multi-choice", "checklist"].includes(element.type)

    const handleSave = () => {
        onUpdate({
            label,
            required,
            placeholder: placeholder || undefined,
            defaultValue: defaultValue || undefined,
            validation,
            options: hasOptions ? options : undefined,
            style: {
                padding: padding || undefined,
                margin: margin || undefined,
                color: color || undefined,
                backgroundColor: backgroundColor || undefined,
            }
        })
        onOpenChange(false)
    }

    const addOption = () => {
        setOptions([
            ...options,
            {
                label: `Option ${options.length + 1}`,
                value: `option${options.length + 1}`
            }
        ])
    }

    const updateOption = (index: number, field: 'label' | 'value', value: string) => {
        const newOptions = [...options]
        newOptions[index][field] = value
        setOptions(newOptions)
    }

    const removeOption = (index: number) => {
        setOptions(options.filter((_, i) => i !== index))
    }

    const addValidation = (type: ValidationRule['type']) => {
        const newRule: ValidationRule = { type, message: `Invalid ${type}` }

        if (type === 'minLength') newRule.value = 1
        if (type === 'maxLength') newRule.value = 100
        if (type === 'min') newRule.value = 0
        if (type === 'max') newRule.value = 100
        if (type === 'regex') newRule.regex = '.*'

        setValidation([...validation, newRule])
    }

    const updateValidation = (index: number, field: keyof ValidationRule, value: any) => {
        const newValidation = [...validation]
        newValidation[index][field] = value
        setValidation(newValidation)
    }

    const removeValidation = (index: number) => {
        setValidation(validation.filter((_, i) => i !== index))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit {element.type} Properties</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="basic">
                    <TabsList className="mb-4">
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="validation">Validation</TabsTrigger>
                        <TabsTrigger value="style">Style</TabsTrigger>
                        {hasOptions && <TabsTrigger value="options">Options</TabsTrigger>}
                    </TabsList>
                    <TabsContent value="basic" className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-4">
                                <Label htmlFor="label">Label</Label>
                                <Input
                                    id="label"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            {["single-line", "multi-line", "number"].includes(element.type) && (
                                <div className="col-span-4">
                                    <Label htmlFor="placeholder">Placeholder</Label>
                                    <Input
                                        id="placeholder"
                                        value={placeholder}
                                        onChange={(e) => setPlaceholder(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            )}
                            {["single-line", "number", "checkbox", "switch"].includes(element.type) && (
                                <div className="col-span-4">
                                    <Label htmlFor="default-value">Default Value</Label>
                                    <Input
                                        id="default-value"
                                        value={defaultValue}
                                        type={element.type === "number" ? "number" : "text"}
                                        onChange={(e) => setDefaultValue(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                            )}
                            <div className="col-span-4 flex items-center space-x-2">
                                <Switch id="required" checked={required} onCheckedChange={setRequired} />
                                <Label htmlFor="required">Required Field</Label>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="validation" className="space-y-4">
                        <div className="flex justify-end">
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addValidation('minLength')}
                                    disabled={!["single-line", "multi-line"].includes(element.type)}
                                >
                                    Add Min Length
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addValidation('maxLength')}
                                    disabled={!["single-line", "multi-line"].includes(element.type)}
                                >
                                    Add Max Length
                                </Button>
                                {element.type === "number" && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={() => addValidation('min')}>
                                            Add Min Value
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => addValidation('max')}>
                                            Add Max Value
                                        </Button>
                                    </>
                                )}
                                {element.type === "single-line" && (
                                    <Button variant="outline" size="sm" onClick={() => addValidation('regex')}>
                                        Add Regex
                                    </Button>
                                )}
                                {element.type === "single-line" && (
                                    <Button variant="outline" size="sm" onClick={() => addValidation('email')}>
                                        Email Validation
                                    </Button>
                                )}
                            </div>
                        </div>

                        {validation.length === 0 ? (
                            <div className="text-center p-4 text-muted-foreground">
                                No validation rules added yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {validation.map((rule, index) => (
                                    <div key={index} className="border p-4 rounded-md">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-sm font-medium">{rule.type.charAt(0).toUpperCase() + rule.type.slice(1)} Validation</h4>
                                            <Button variant="ghost" size="sm" onClick={() => removeValidation(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {(rule.type === 'minLength' || rule.type === 'maxLength' || rule.type === 'min' || rule.type === 'max') && (
                                                <div>
                                                    <Label>Value</Label>
                                                    <Input
                                                        type="number"
                                                        value={rule.value}
                                                        onChange={(e) => updateValidation(index, 'value', parseInt(e.target.value))}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            )}
                                            {rule.type === 'regex' && (
                                                <div className="col-span-2">
                                                    <Label>Pattern</Label>
                                                    <Input
                                                        value={rule.regex || ""}
                                                        onChange={(e) => updateValidation(index, 'regex', e.target.value)}
                                                        className="mt-1"
                                                    />
                                                </div>
                                            )}
                                            <div className={rule.type === 'regex' ? "col-span-2" : "col-span-1"}>
                                                <Label>Error Message</Label>
                                                <Input
                                                    value={rule.message || ""}
                                                    onChange={(e) => updateValidation(index, 'message', e.target.value)}
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="style" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="padding">Padding</Label>
                                <Input
                                    id="padding"
                                    value={padding}
                                    onChange={(e) => setPadding(e.target.value)}
                                    placeholder="e.g. 16px or 1rem"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="margin">Margin</Label>
                                <Input
                                    id="margin"
                                    value={margin}
                                    onChange={(e) => setMargin(e.target.value)}
                                    placeholder="e.g. 16px or 1rem"
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="color">Text Color</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="color"
                                        value={color}
                                        onChange={(e) => setColor(e.target.value)}
                                        placeholder="e.g. #000000"
                                    />
                                    <input
                                        type="color"
                                        value={color || "#000000"}
                                        onChange={(e) => setColor(e.target.value)}
                                        className="w-10 h-10 p-1 rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="bg-color">Background Color</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input
                                        id="bg-color"
                                        value={backgroundColor}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        placeholder="e.g. #ffffff"
                                    />
                                    <input
                                        type="color"
                                        value={backgroundColor || "#ffffff"}
                                        onChange={(e) => setBackgroundColor(e.target.value)}
                                        className="w-10 h-10 p-1 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                    {hasOptions && (
                        <TabsContent value="options" className="space-y-4">
                            <div className="flex justify-end mb-2">
                                <Button variant="outline" size="sm" onClick={addOption}>
                                    Add Option
                                </Button>
                            </div>
                            {options.map((option, index) => (
                                <div key={index} className="flex items-center gap-2 mb-2">
                                    <Input
                                        value={option.label}
                                        onChange={(e) => updateOption(index, 'label', e.target.value)}
                                        placeholder="Label"
                                        className="flex-1"
                                    />
                                    <Input
                                        value={option.value}
                                        onChange={(e) => updateOption(index, 'value', e.target.value)}
                                        placeholder="Value"
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(index)}
                                        disabled={options.length <= 1}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </TabsContent>
                    )}
                </Tabs>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}