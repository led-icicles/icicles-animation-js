import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Tęcza wertykalna",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 5,
  });
  const icicles = new Icicles(animation);

  const rainbow = () => {
    for (let i = 0; i < 1; i += 0.015) {
      for (let y = 0; y <= yCount; y++) {
        // const color = Color.hsl((i + y * 0.5) % 1, 1, 0.5);
        const color = Color.hsl((i + y * 0.05) % 1, 1, 0.5);

        if (y === yCount) {
          icicles.setRadioPanelColor(0, color);
        } else {
          icicles.setRowColor(y, color);
        }
      }

      icicles.show(new Duration({ milliseconds: 33 }));
    }
  };
  rainbow();

  await animation.toFile(`./compiled/Rainbow-vertical.anim`);
};

compile();
