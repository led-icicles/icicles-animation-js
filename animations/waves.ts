import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Fale",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 1,
  });
  const icicles = new Icicles(animation);

  let waves = [
    { x: 0, color: Colors.blue, i: 0.04, height: 1 },
    { x: 0, color: Colors.magenta, i: 0.025, height: 0.9 },
    { x: 0, color: Colors.violet, i: 0.03, height: 0.95 },
    { x: 0, color: Colors.lightBlue, i: 0.035, height: 0.9 },
  ];

  const show = (size: number) => {
    icicles.setAllPixelsColor(Colors.black);
    for (let i = 0; i < waves.length; i++) {
      waves[i].x = waves[i].x + waves[i].i;
      const val = waves[i].x;
      const color = waves[i].color;
      const height = waves[i].height;
      for (let x = 0; x < xCount; x++) {
        const toY = Math.sin(val + x * 0.1) * size * height;
        for (let y = 0; y < toY; y++) {
          icicles.setPixelColor(x, y, color);
        }
      }
      const val2 = Math.abs(Math.sin(val + 0 * 0.1));

      icicles.setRadioPanelColor(
        0,
        Color.linearBlend(waves[0].color, waves[1].color, val2)
      );
    }
    icicles.show(new Duration({ milliseconds: 33 }));
  };

  for (let i = 0; i < yCount; i += 1) {
    show(i);
  }

  for (let i = 0; i < 400; i++) {
    show(yCount);
  }

  for (let i = yCount; i >= 0; i -= 1) {
    show(i);
  }

  await animation.toFile(`./compiled/waves.anim`);
};

compile();
