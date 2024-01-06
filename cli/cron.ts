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
