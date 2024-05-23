'use client';

import { Drawer } from "vaul";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import DatePicker from "../ui/datePicker";
import Dropdown, { DropdownOption } from "../ui/dropdown";
import RadioGroupSet, { RadioOption } from "../ui/radioGroupSet";
import { Input } from "../ui/input";
import { useRotr, useRotrDispatch } from "./RotrContext";
import { ScheduleEndType, ScheduleInterval, ScheduleSchema } from "@/lib/types/schedule";

export interface ScheduleDrawerProps {
    button: React.ReactNode
}

type FieldErrors = {
    startDate?: string[]
    interval?: string[]
    endDate?: string[]
    endAfterOccurrence?: string[]
}

export default function ScheduleDrawer({ button } : ScheduleDrawerProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [interval, setInterval] = useState<ScheduleInterval>();
    const [endType, setEndType] = useState<ScheduleEndType>(ScheduleEndType.DATE);
    const [endDate, setEndDate] = useState<Date>();
    const [occurrences, setOccurrences] = useState("");
    const [errors, setErrors] = useState<FieldErrors>();

    const intervalOptions : DropdownOption[] = [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "Fortnightly", value: "fortnightly" },
        { label: "Monthly", value: "monthly" }
    ];

    const endTypes : RadioOption[] = [
        { label: "On date", value: "date" },
        { label: "After occurrences", value: "occurrences" }
    ];

    const rotr = useRotr();
    const dispatch = useRotrDispatch();

    useEffect(() => {

        if (isOpen && rotr.schedule != null) {
            setStartDate(rotr.schedule.startDate);
            setInterval(rotr.schedule.interval);
            setEndDate(rotr.schedule.endDate);
            setOccurrences(rotr.schedule.endAfterOccurrence + "");
            setEndType(rotr.schedule.endAfterOccurrence > 0 ? ScheduleEndType.OCCURRENCES : ScheduleEndType.DATE);
        }

    }, [isOpen]);

    const handleSave = () => {

        const parsed = ScheduleSchema.safeParse({
            startDate, interval, endType, endDate, endAfterOccurrence: occurrences
        });

        if (parsed.error) {
            setErrors(parsed.error.flatten().fieldErrors);
        }
        else {
            setErrors({});

            dispatch({
                type: "schedule.set",
                data: parsed.data
            });

            setIsOpen(false);
        }
    };

    return (
        <Drawer.Root direction="right" open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Trigger asChild>
                {button}
            </Drawer.Trigger>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[450px] mt-24 fixed bottom-0 right-0">
                    <div className="p-4 bg-white flex-1 h-full">
                        <div className="max-w-md mx-auto">
                            <Drawer.Title className="text-2xl font-extrabold tracking-tight mb-8">{rotr.schedule ? "Edit" : "Add"} schedule</Drawer.Title>

                            <div className="flex flex-col gap-5">
                                <DatePicker 
                                    dateValue={startDate} 
                                    onDateChanged={setStartDate} 
                                    errors={errors?.startDate}
                                    label="Start date" />

                                <Dropdown 
                                    value={interval} 
                                    onValueChanged={(v) => setInterval(v as ScheduleInterval)}
                                    options={intervalOptions} 
                                    errors={errors?.interval}
                                    label="Interval" />

                                <RadioGroupSet 
                                    value={endType} 
                                    onValueChange={(v) => setEndType(v as ScheduleEndType)} 
                                    options={endTypes} 
                                    orientation="horizontal" 
                                    label="Ends" />

                                {endType === "date" && (
                                    <DatePicker 
                                        dateValue={endDate} 
                                        onDateChanged={setEndDate}
                                        errors={errors?.endDate} />
                                )}

                                {endType === "occurrences" && (
                                    <Input 
                                        type="number" 
                                        value={occurrences} 
                                        onChange={(e) => setOccurrences(e.target.value)}
                                        errors={errors?.endAfterOccurrence} 
                                        className="w-[280px]" />
                                )}
                            </div>

                            <Button variant="default" className="mt-10" onClick={handleSave}>Save</Button>
                            <Button variant="outline" className="ms-3" onClick={() => setIsOpen(false)}>Close</Button>

                        </div>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    )
}