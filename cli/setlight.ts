import { Config, pharusApply } from "../src/pharus.ts";
import { get_now } from "../src/today.ts";

const main = async (configFile: string) => {
    const config: Config = JSON.parse(await Deno.readTextFile(configFile));
    const now = get_now(new Date());
    pharusApply(config, { valid: false }, now);
};

await main(Deno.args[0]);
