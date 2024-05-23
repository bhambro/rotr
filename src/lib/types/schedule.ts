import z from "zod";

export enum ScheduleInterval {
    DAILY = "daily",
    WEEKLY = "weekly",
    FORTNIGHTLY = "fortnightly",
    MONTHLY = "monthly"
}

export enum ScheduleEndType {
    OCCURRENCES = "occurrences",
    DATE = "date"
}

export type Schedule = {
    startDate: Date
    interval: ScheduleInterval
    endDate: Date | undefined
    endAfterOccurrence: number
}

export const ScheduleSchema = z.object({
    startDate: z.date({ required_error: "Required" }),
    interval: z.nativeEnum(ScheduleInterval, { required_error: "Required" }),
    endType: z.nativeEnum(ScheduleEndType),
    endDate: z.date().optional(),
    endAfterOccurrence: z.coerce.number().optional()
}).superRefine((input, context) => {
    if (input.endType === ScheduleEndType.OCCURRENCES && input.endAfterOccurrence == undefined) {
        return context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Required",
            path: ["endAfterOccurrence"]
        });
    } else if (input.endType === ScheduleEndType.DATE && input.endDate == undefined) {
        return context.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Required",
            path: ["endDate"]
        });
    }
});