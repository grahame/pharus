import { Temporal, getSunrise } from "./libs.ts";

export const calculateSunrise = (
    today: Temporal.PlainDate,
    latitude: number,
    longitude: number
): Temporal.PlainDateTime => {
    const sunrise = getSunrise(
        latitude,
        longitude,
        new Date(today.year, today.month - 1, today.day)
    );
    return new Temporal.PlainDateTime(
        today.year,
        today.month,
        today.day,
        sunrise.getHours(),
        sunrise.getMinutes(),
        sunrise.getSeconds()
    );
};
