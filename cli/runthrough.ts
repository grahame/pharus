import { State } from "../src/state.ts";
import { Config, pharusApply } from "../src/pharus.ts";
import { get_now } from "../src/today.ts";
import { Temporal } from "temporal";

const state: State = {
    context: { valid: false },
};

const tick = async (config: Config, now: Temporal.PlainDateTime) => {
    state.context = await pharusApply(config, state.context, now);
    if (state.context.valid && state.context.wasChanged) {
        console.log(JSON.stringify(state.context));
    }
};

const main = async (configFile: string) => {
    const config: Config = JSON.parse(await Deno.readTextFile(configFile));
    // run through the calendar for the next year or so
    const now = get_now(new Date());
    const until = now.add({ years: 1 });
    let then = now;

    while (Temporal.PlainDateTime.compare(then, until) < 0) {
        await tick(config, then);
        if (state.context.valid && state.context.wasChanged) {
            await new Promise((r) => setTimeout(r, 500));
        }
        then = then.add({ days: 1 });
    }
};

await main(Deno.args[0]);
