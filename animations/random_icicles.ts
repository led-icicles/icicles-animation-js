import { randomInt } from "crypto";
import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 32;
  const yCount = 16;
  const animation = new Animation({
    name: "Losowy sopel",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 1,
  });
  const icicles = new Icicles(animation);

  const showOneColumn = (x: number, color: Color, speed: number) => {
    for (let i = -Math.PI * 0.5; i <= Math.PI * 1.5; i += speed) {
      const val = (Math.sin(i) + 1) * 0.5;
      const target = Color.linearBlend(Colors.black, color, val);
      icicles.setAllPixelsColor(Colors.black);
      icicles.setRadioPanelColor(0, target);
      icicles.setColumnColor(x, target);
      icicles.show(new Duration({ milliseconds: 20 }));
    }
  };

  const showRandomIciclesOfColor = (color: Color) => {
    const durations = [
      { duration: 2000, speed: 0.05, count: 2 },
      { duration: 1000, speed: 0.1, count: 2 },
      { duration: 500, speed: 0.15, count: 2 },
      { duration: 250, speed: 0.2, count: 2 },
      { duration: 100, speed: 0.4, count: 4 },
      { duration: 50, speed: 0.8, count: 8 },
      { duration: 16, speed: Math.PI / 2, count: 8 },
    ];

    for (let x = 0; x < durations.length * 2; x++) {
      const index = Math.abs(
        x < durations.length ? x : x - durations.length * 2 + 1
      );
      const { duration, speed, count } = durations[index];
      let i = 0;
      while (i++ < count) {
        icicles.setAllPixelsColor(Colors.black);
        icicles.show(new Duration({ milliseconds: duration }));
        const icicle = randomInt(xCount);
        showOneColumn(icicle, color, speed);
      }
    }
  };
  showRandomIciclesOfColor(Colors.lawnGreen);
  showRandomIciclesOfColor(Colors.red);
  showRandomIciclesOfColor(Colors.lightBlue);
  showRandomIciclesOfColor(Colors.magenta);

  await animation.toFile(`./compiled/random_icicles.anim`);
};

compile();
