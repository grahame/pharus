// node has a bug that breaks getting a new Temporal date without an

import { Temporal } from "./libs.ts";

// explicitly named timezone
export const get_now = (now: Date): Temporal.PlainDateTime => {
    return new Temporal.PlainDateTime(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        now.getHours(),
        now.getMinutes(),
        now.getSeconds()
    );
};
