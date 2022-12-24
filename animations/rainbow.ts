import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Tęcza",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 2,
  });
  const icicles = new Icicles(animation);

  const rainbow = () => {
    for (let i = 0; i < 1; i += 0.0025) {
      const color = Color.hsl(i, 1, 0.5);
      icicles.setAllPixelsColor(color);
      icicles.setRadioPanelColor(0, color);
      icicles.show(new Duration({ milliseconds: 20 }));
    }
  };
  rainbow();

  await animation.toFile(`./compiled/rainbow.anim`);
};

compile();
