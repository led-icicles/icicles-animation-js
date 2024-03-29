import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Tęcza horyzontalna",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 10,
  });
  const icicles = new Icicles(animation);

  const rainbow = () => {
    for (let i = 0; i < 1; i += 0.02) {
      for (let x = 0; x < xCount; x++) {
        const color = Color.hsl((i + x * 0.05) % 1, 1, 0.5);

        if (x === 6) {
          icicles.setRadioPanelColor(1, color);
        } else if (x === 19 - 6) {
          icicles.setRadioPanelColor(2, color);
        }

        icicles.setColumnColor(x, color);
      }

      icicles.show(new Duration({ milliseconds: 20 }));
    }
  };
  rainbow();

  await animation.toFile(`./compiled/Rainbow-horizontal.anim`);
};

compile();
