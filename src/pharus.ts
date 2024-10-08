import { getCalendarColour } from "./calendar.ts";
import { Temporal } from "./libs.ts";
import { setLight } from "./light.ts";
import { ChristHasDied } from "./vigil.ts";

export interface Config {
    readonly url: string;
    readonly lights: string[];
    readonly latitude: number;
    readonly longitude: number;
}

interface InvalidContext {
    valid: false;
}

interface ValidContext {
    valid: true;
    brightness: number;
    colour: string;
    slug: string;
    wasChanged: boolean;
}

export type Context = Readonly<InvalidContext> | Readonly<ValidContext>;

export const pharusApply = async (
    config: Config,
    context: Context,
    now: Temporal.PlainDateTime
): Promise<Context> => {
    const today = now.toPlainDate();
    const [slug, colour] = getCalendarColour(today);
    const is_vigil = ChristHasDied(
        slug,
        now,
        today,
        config.latitude,
        config.longitude
    );
    const brightness = is_vigil ? 0 : 255;
    let wasChanged = false;

    if (
        !context.valid ||
        context.brightness !== brightness ||
        context.colour !== colour
    ) {
        for (const light of config.lights) {
            await setLight(
                config.url,
                `zigbee2mqtt/${light}/set`,
                brightness,
                colour
            );
        }
        wasChanged = true;
    }
    return { valid: true, brightness, colour, slug, wasChanged };
};
