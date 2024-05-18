import { Label } from "./label"
import { RadioGroup, RadioGroupItem } from "./radio-group"

export type RadioOption = {
    label: string
    value: string
}

export interface RadioGroupSetProps {
    value: string
    onValueChange: (value: string) => void
    options: RadioOption[]
    orientation?: "horizontal" | "vertical"
    label: string
}

export default function RadioGroupSet({ value, onValueChange, options, orientation, label } : RadioGroupSetProps) {
    return (
        <div>
            <div className="mb-2">
                <label>{label}</label>
            </div>
            <RadioGroup value={value} onValueChange={onValueChange} orientation={orientation}>
                {options.map(option => (
                    <div className="flex items-center space-x-2" key={option.value}>
                        <RadioGroupItem value={option.value} id={`rgi_${option.value}`} />
                        <Label htmlFor={`rgi_${option.value}`}>{option.label}</Label>
                    </div>
                ))}
            </RadioGroup>
        </div>
    )
}