import subscribe from "https://deno.land/x/mqtt@0.1.2/packets/subscribe.ts";
import { getHexColour } from "./colours.ts";
import { LiturgicalColour, MQTTClient } from "./libs.ts";

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
    const client = new MQTTClient({ url });
    await client.connect();
    const payload = JSON.stringify({
        state: brightness === 0 ? "OFF" : "ON",
        brightness: brightness,
        color: hex2rgb(getHexColour(colour)),
    });
    await client.publish(topic, payload);
    await client.disconnect();
};

export const watchLights = async (
    url: string,
    lights: string[],
    callback: (light: string, availability: boolean) => Promise<void>
) => {
    const client = new MQTTClient({ url });
    await client.connect();
    for (const light of lights) {
        const topic = `zigbee2mqtt/${light}/availability`;
        console.log(await client.subscribe(topic));
    }
    const utf8Decoder = new TextDecoder("utf-8");
    client.on("message", (topic: string, message: Uint8Array) => {
        callback(topic.split("/")[1], utf8Decoder.decode(message) === "online");
    });
};
