import { useState } from "react"
import type { FormData } from "../lib/types"

interface FormConnectorProps {
    onSubmit: (data: Record<string, any>) => void
    formData: FormData
}

export default function FormConnector({ onSubmit, formData }: FormConnectorProps) {
    const [formValues, setFormValues] = useState<Record<string, any>>({})
    const [errors, setErrors] = useState<Record<string, string>>({})
    const validateField = (id: string, value: any) => {
        const element = formData.elements.find(el => el.id === id)
        if (!element) return true

        // Check required fields
        if (element.required && (value === null || value === undefined || value === "")) {
            setErrors(prev => ({
                ...prev,
                [id]: "This field is required"
            }))
            return false
        }

        // Check validation rules
        if (element.validation && element.validation.length > 0) {
            for (const rule of element.validation) {
                switch (rule.type) {
                    case "minLength":
                        if (typeof value === "string" && value.length < (rule.value || 0)) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || `Minimum length is ${rule.value} characters`
                            }))
                            return false
                        }
                        break
                    case "maxLength":
                        if (typeof value === "string" && value.length > (rule.value || 100)) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || `Maximum length is ${rule.value} characters`
                            }))
                            return false
                        }
                        break
                    case "min":
                        if (typeof value === "number" && value < (rule.value || 0)) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || `Minimum value is ${rule.value}`
                            }))
                            return false
                        }
                        break
                    case "max":
                        if (typeof value === "number" && value > (rule.value || 100)) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || `Maximum value is ${rule.value}`
                            }))
                            return false
                        }
                        break
                    case "email":
                        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || "Please enter a valid email address"
                            }))
                            return false
                        }
                        break
                    case "regex":
                        if (typeof value === "string" && rule.regex && !(new RegExp(rule.regex).test(value))) {
                            setErrors(prev => ({
                                ...prev,
                                [id]: rule.message || "Please enter a valid value"
                            }))
                            return false
                        }
                        break
                }
            }
        }

        // Field is valid, remove any errors
        setErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors[id]
            return newErrors
        })

        return true
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        let formIsValid = true
        const newErrors: Record<string, string> = {}

        // Validate all fields
        formData.elements.forEach(element => {
            if (element.id) {
                const isValid = validateField(element.id, formValues[element.id])
                if (!isValid) formIsValid = false
            }
        })

        setErrors(newErrors)

        if (formIsValid) {
            onSubmit(formValues)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form elements would be rendered here */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}