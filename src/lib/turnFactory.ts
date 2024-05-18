import moment, { Moment } from "moment";
import { Schedule, ScheduleInterval } from "./types/schedule";
import { Turn } from "./types/turn";

export function createTurns(initialTurns: Turn[], schedule: Schedule) : Turn[] {

    const people = getUniquePeople(initialTurns);

    const endType = schedule.endAfterOccurrence > 0 ? "occurrence" : "date";
    const endDate = endType === "date" ? moment(schedule.endDate as Date) : null;

    let date = moment(schedule.startDate);
    let occurence = 1;
    let personIndex = 0;

    let turns : Turn[] = [];

    while ((endType === "occurrence" && occurence <= schedule.endAfterOccurrence) || (endType === "date" && date.isSameOrBefore(endDate))) {

        const person = people[personIndex];

        turns.push({
            id: occurence,
            personId: person.id,
            date: date.toDate(),
            ordinal: occurence
        });

        personIndex = personIndex === people.length -1 ? 0 : personIndex + 1;
        occurence += 1;

        date = getNextDate(date, schedule.interval);

    }

    return turns;
}

function getUniquePeople(turns: Turn[]) {
    return turns.filter((v, i, self) => {
        return i == self.findIndex(x => x.personId === v.personId);
    });
}

function getNextDate(previous: Moment, interval: ScheduleInterval) : Moment {
    switch (interval) {
        case ScheduleInterval.DAILY: 
            return previous.add(1, "day");

        case ScheduleInterval.WEEKLY:
            return previous.add(7, "days");

        case ScheduleInterval.FORTNIGHTLY:
            return previous.add(14, "days");

        case ScheduleInterval.MONTHLY:
            return previous.add(1, "month");
    }
}

export function getNextTurnDate(previous: Turn, interval: ScheduleInterval) : Date {
    const previousDate = moment(previous.date);
    const nextDate = getNextDate(previousDate, interval);
    return nextDate.toDate();
}