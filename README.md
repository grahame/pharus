# pharus: 'beacon' or 'lighthouse'

https://github.com/grahame/pharus/assets/330805/0644480d-e9b8-4c07-a9b1-3218ce54215d

_`pharus` showing the colours of the calendar, Lent through Easter 2024_

This software allows you to build a 'liturgical lightbulb', which changes colour
in accordance with the Calendar of the Anglican Church of Australia.

The various festivals in the Calendar are observed, including lesser feasts. Where more than one lesser feast might be celebrated on a day, the feasts are rotated each year, so that every few years every feast
in the calendar will be observed.

As a solemn touch, your 'liturgical lightbulb' will turn off at 3pm local time on Good Friday.
It will turn back on at sunrise on Easter Day.

## Building a liturgical lightbulb

Setting this project up will require some Linux skills. It could be a great hobby project though;
in my own area, I've been considering running a workshop where attendees set up a light,
and leave with it.

1. You'll need a working [zigbee2mqtt](https://www.zigbee2mqtt.io/guide/getting-started/) setup. This isn't too hard, but it does involve ordering some hardware. The walkthrough is good. In terms of controllers, I've got an [Electrolama CC2652R1](https://shop.electrolama.com/collections/usb-rf-sticks/products/zzh-multiprotocol-rf-stick?variant=40387937468577) plugged into a [Raspberry Pi](https://www.raspberrypi.org/) and it has worked well.
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

4. Now for the easy bit. Install the [deno](https://docs.deno.com/runtime/manual/getting_started/installation) runtime, and then run:

```sh
# test things out by setting the globe to today's colour
deno run -A https://deno.land/x/pharus/cli/setlight.ts config.json

# leave this running, and your globe will change day by day
deno run --unstable -A https://deno.land/x/pharus/cli/cron.ts config.json

# ... or this will run your light through the calendar for the next year
# changing the colour twice a second
deno run --unstable -A https://deno.land/x/pharus/cli/runthrough.ts config.json
```

## Background

This project came out of my days as a theological student, training for ordination as an Anglican priest.
One of the requirements for ordination in my Diocese is completion of [Clinical Pastoral Education](https://www.acpewa.org/).
For three months I was an intern chaplain at Royal Perth Hospital. It was a very intense experience: overall,
wonderful, but complex in the detail. I found myself spending some time in [St Mary's Cathedral](https://stmaryscathedralperth.com.au/) 
when I needed to, and noticed that they change the lighting around the sanctuary day by day according to the Calendar.

I decided to take that idea and bring it into my home. Changing the colour of a light each day was going to be 
too much work for me to keep it up, so I decided to automate it. I built the light as a little fun distraction while 
completing CPE; this version of the light is much more polished. (The original used an IKEA Tradfri controller and some
Python code to talk to it, but it kept breaking when the controller updated itself; this is version 2, and is pretty solid!)

While this started as a fun project, the liturgical light has added meaningfully to my pattern of daily worship. When I get
up in the morning, one of the first things I see is the colour of the day, coming through the study door.
When it's red, or white, I find myself wondering which saint or martyr is marked this day.

The initial release of this software was made on the Feast of the Epiphany, 2024. I'm not sure there
could be a much more appropriate day for that to happen!

## Future directions

At the moment, the lightglobe follows the Calendar of the Anglican Church of Australia.
It does this using my [church-calendar](https://github.com/grahame/church-calendar) library.
I am very open to adding support for further calendars, including those from other denominations,
or other provinces within the Anglican Communion.

## Need a hand?

I'm happy to help anyone who is trying to get this running and hits obstacles. Just open an issue on this
repository.

If you do get this up and running, I'd love to hear from you. I'm an Anglican Priest working in Digital Mission, and I hope this has some missional outworkings.
