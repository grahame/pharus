import { Temporal } from "./libs.ts";
import { calculateSunrise } from "./sunrise.ts";

// a solemn liturgical touch: we turn the lamp off from 3pm on Good Friday,
// and back on at the Easter Vigil, sunrise on Easter Sunday.
export const ChristHasDied = (
    slug: string,
    now: Temporal.PlainDateTime,
    today: Temporal.PlainDate,
    latitude: number,
    longitude: number
) => {
    const ChristHasRisen = () => {
        const sunrise = calculateSunrise(today, latitude, longitude);
        if (Temporal.PlainDateTime.compare(sunrise, now) <= 0) {
            return true;
        }
        return false;
    };

    if (slug === "good-friday" && now.hour >= 15) {
        return true;
    }
    if (slug === "holy-saturday") {
        return true;
    }
    if (slug === "easter-day") {
        return !ChristHasRisen();
    }
};
