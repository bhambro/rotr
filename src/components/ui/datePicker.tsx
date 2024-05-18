'use client';

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Calendar } from "./calendar";
import { useState } from "react";

export interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    dateValue: Date | undefined
    onDateChanged: (date: Date | undefined) => void
    errors?: string[]
}

export default function DatePicker({ label, dateValue, onDateChanged, errors, ...props } : DatePickerProps) {

    const formatDate = (date: Date) => {
        return moment(date).format("DD/MM/YYYY");
    };

    const handleSelected = (date: Date | undefined) => {
        onDateChanged(date);
        setOpen(false);
    };

    const [open, setOpen] = useState(false);

    return (
        <div {...props}>
            {label != null && (
                <div className="mb-1">
                    <label>{label}</label>
                </div>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !dateValue && "text-muted-foreground"
                        )}
                    >
                        <FontAwesomeIcon icon={faCalendar} />
                        <span className="ms-2">
                            {dateValue ? formatDate(dateValue) : <span>Select a date</span>}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" >
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={handleSelected}
                        initialFocus
                    ></Calendar>
                </PopoverContent>
            </Popover>
            {errors && (
                <div className="mt-1 text-sm text-red-500">{errors.join(", ")}</div>
            )}
        </div>
    )

}
