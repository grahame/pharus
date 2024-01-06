import {
    LiturgicalColour,
    LiturgicalSeason,
    ResolvedCalendar,
    ResolvedObservance,
    Temporal,
    aca_calendar,
    aca_seasons,
    getLiturgicalYear,
    get_season_for_date,
} from "../src/libs.ts";

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

export const getTodayColour = (
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

    // observances without an explicit colour are simply those
    // who do not differ from their season
    const observanceColour = observances[0].colour || seasonColour;
    return [observances[0].slug, observanceColour];
};

export const getCalendarColour = (date: Temporal.PlainDate) => {
    const year = getLiturgicalYear(date);

    const [_ctxt, placed_events] = aca_calendar(year);
    const seasons = aca_seasons(year);

    // we take the colour from the observances on a modulo N(observances) pattern relative to the year
    // this project launched (2024), and in so doing we'll mark the colour of every observance over an
    // N-year cycle.
    const observances = getObservancesForDate(placed_events, date);
    arrayRotate(observances, (year - 2024) % observances.length);

    const season = get_season_for_date(seasons, date);
    return getTodayColour(season, observances);
};
