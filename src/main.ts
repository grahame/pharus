import {
    aca_seasons,
    calendar as aca_calendar,
} from "churchcalendar/western/calendars/anglican-church-of-australia.ts";
import { getLiturgicalYear } from "churchcalendar/western/liturgicalyear.ts";
import {
    LiturgicalColour,
    LiturgicalSeason,
    ResolvedCalendar,
    ResolvedObservance,
} from "churchcalendar/calendar.ts";
import { Temporal } from "temporal";
import { get_season_for_date } from "churchcalendar/western/seasons/index.ts";

const getObservancesForDate = (
    placed_events: ResolvedCalendar,
    date: Temporal.PlainDate
): ResolvedObservance[] => {
    for (const [dt, obvs] of placed_events) {
        if (date.equals(dt)) {
            return obvs;
        }
    }
    return [];
};

const arrayRotate = (arr: ResolvedObservance[], count: number) => {
    const len = arr.length;
    arr.push(...arr.splice(0, ((-count % len) + len) % len));
    return arr;
};

const get_today = (): Temporal.PlainDate => {
    // node has a bug that breaks getting a new Temporal date without an
    // explicitly named timezone
    const today = new Date();
    return new Temporal.PlainDate(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
    );
};

export const getTodayColour = (
    year: number,
    season: LiturgicalSeason | null,
    observances: ResolvedObservance[]
): [string, LiturgicalColour] => {
    // we can be validly outside the pattern of seasons, but there'll be an observance to cover
    // us in this case.
    const seasonColour = season ? season.colour : LiturgicalColour.COLOUR_GREEN;
    const seasonDescription = season ? season.name : "";
    if (observances.length === 0) {
        return [seasonDescription, seasonColour];
    }

    const observanceColour = observances[0].colour;
    if (observanceColour) {
        return [observances[0].slug, observanceColour];
    }
    return [seasonDescription, seasonColour];
};

const update = (date: Temporal.PlainDate) => {
    const year = getLiturgicalYear(date);

    const [_ctxt, placed_events] = aca_calendar(year);
    const seasons = aca_seasons(year);

    // we take the colour from the observances on a modulo N(observances) pattern relative to the year
    // this project launched (2024), and in so doing we'll mark the colour of every observance over an
    // N-year cycle.
    const observances = getObservancesForDate(placed_events, date);
    arrayRotate(observances, (year - 2024) % observances.length);

    const season = get_season_for_date(seasons, date);
    const colour = getTodayColour(year, season, observances);
    console.log(colour);
};

if (import.meta.main) {
    const today = get_today();
    update(today);
}
