import moment from "moment";
import { Schedule, ScheduleInterval } from "./types/schedule";

export function formatTurnDate(date: Date, schedule: Schedule) : string {
    const m = moment(date);

    switch (schedule.interval) {
        case ScheduleInterval.DAILY:
            return m.format("ddd Do MMM");
        case ScheduleInterval.FORTNIGHTLY:
        case ScheduleInterval.WEEKLY:
            return m.format("Do MMM");
        case ScheduleInterval.MONTHLY:
            return m.format("Do MMM YY")
    }

}
