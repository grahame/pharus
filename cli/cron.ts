import { watchLights } from "../src/light.ts";
import { Config, pharusApply } from "../src/pharus.ts";
import { State } from "../src/state.ts";
import { get_now } from "../src/today.ts";

const state: State = {
    context: { valid: false },
};

// update the light every minute
Deno.cron("Sample cron job", "*/1 * * * *", async () => {
    const configFile = Deno.args[0];
    const config: Config = JSON.parse(await Deno.readTextFile(configFile));
    const now = get_now(new Date());
    state.context = await pharusApply(config, state.context, now);
    if (state.context.valid && state.context.wasChanged) {
        console.log(JSON.stringify(state.context));
    }
});

// we also want to update the light immediately when it comes online,
// so we subscribe to availability
const main = async (configFile: string) => {
    const config: Config = JSON.parse(await Deno.readTextFile(configFile));

    await watchLights(
        config.url,
        config.lights,
        async (light, availability) => {
            console.log("availability change:", light, availability);
            const now = get_now(new Date());
            state.context = await pharusApply(
                config,
                { ...state.context, valid: false },
                now
            );
        }
    );
};

await main(Deno.args[0]);
