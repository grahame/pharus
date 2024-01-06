# pharus: 'beacon' or 'lighthouse'

This software allows you to configure a 'liturgical lightbulb', which changes colour
in accordance with the Calendar of the Anglican Church of Australia.

The various festivals in the Calendar are observed, including lesser feasts. Where more than one lesser feast might be celebrated on a day, the feasts are rotated each year, so that every few years every feast
in the calendar will be observed.

As a solemn touch, your 'liturgical lightbulb' will turn off at 3pm local time on Good Friday.
It will turn back on at sunrise on Easter Day.

## Building a liturgical lightbulb

1. You'll need a working [zigbee2mqtt](https://www.zigbee2mqtt.io/guide/getting-started/) setup. This isn't too hard, but it does involve ordering some hardware. The walkthrough is good. In terms of controllers, I've got an [Electrolama CC2652R1](https://shop.electrolama.com/collections/usb-rf-sticks/products/zzh-multiprotocol-rf-stick?variant=40387937468577) and it has worked well.
2. Get yourself a lightbulb, and register it with your Zigbee controller. I've got an [Tradfri LED bulb E14 470 lumen, dimmable colour](https://www.ikea.com/au/en/p/tradfri-led-bulb-e14-470-lumen-smart-wireless-dimmable-colour-and-white-spectrum-globe-50439197/) globe.
3. Make yourself a configuration file:

```json
{
  "url": "mqtt://127.0.0.1",
  "topic": "zigbee2mqtt/0x2c1165fffe107f64/set",
  "latitude": -31.9514,
  "longitude": 115.8617
}
```

You can find the ID in the topic for your lightbulb from the zigbee2mqtt web interface;
it's just the hex code in the device URL.

The provided latitude and longitude are used to calculate the local sunrise time on Easter Day, so that the globe turns back on as the Vigil ends.

4. Now for theeasy bit. Install the [deno](https://docs.deno.com/runtime/manual/getting_started/installation) runtime, and then run:

```sh
# test things out by setting the globe to today's colour
deno run -A https://deno.land/x/pharus/cli/setlight.ts config.json

# leave this running, and your globe will change day by day
deno run --unstable -A https://deno.land/x/pharus/cli/cron.ts config.json

# ... or this will run your light through the calendar for the next year
# changing the colour twice a second
deno run --unstable -A https://deno.land/x/pharus/cli/runthrough.ts config.json
```
