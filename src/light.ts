import { Client } from "mqtt";
import { getHexColour } from "./colours.ts";
import { LiturgicalColour } from "churchcalendar/calendar.ts";

const hex2rgb = (hex: string) => {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
};

export const setLight = async (
    url: string,
    topic: string,
    brightness: number,
    colour: LiturgicalColour
) => {
    const client = new Client({ url });
    await client.connect();
    const payload = JSON.stringify({
        state: brightness === 0 ? "OFF" : "ON",
        brightness: brightness,
        color: hex2rgb(getHexColour(colour)),
    });
    await client.publish(topic, payload);
    await client.disconnect();
};
