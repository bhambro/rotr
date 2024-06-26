'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

export type DropdownOption = {
    value: string
    label: string
    data?: any
}

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: DropdownOption[]
    value: string | undefined
    onValueChanged: (value: string | undefined) => void
    placeholder?: string
    label: string
    errors?: string[]
}

export default function Dropdown({ options, value, onValueChanged, placeholder, label, errors, ...props } : DropdownProps) {

    return (
        <div>
            <div className="mb-1">
                <label>{label}</label>
            </div>
            <Select value={value} onValueChange={onValueChanged}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder={placeholder}/>
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem value={option.value} key={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {errors && (
                <div className="mt-1 text-sm text-red-500">{errors.join(", ")}</div>
            )}
        </div>
    )

}
