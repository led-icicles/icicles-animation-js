import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Levels",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 1,
  });
  const icicles = new Icicles(animation);
  let shift = 0;
  const show = (left: Color, right: Color, size: number, accel: number) => {
    icicles.setAllPixelsColor(Colors.black);

    for (let x = 0; x < xCount; x++) {
      const val = (Math.sin(x * Math.PI + shift) + 1) / 2;
      const toY = val * size;
      const target = Color.linearBlend(left, right, val);
      for (let y = 0; y < toY; y++) {
        icicles.setPixelColor(x, y, target);
      }
    }
    shift += accel;
    icicles.show(new Duration({ milliseconds: 16 }));
  };

  // for (let i = 0; i < yCount; i += 0.5) {
  //   show(i);
  // }

  for (let i = 0; i < 1; i += 0.001) {
    show(Colors.red, Colors.blue, yCount, i);
  }

  // for (let i = yCount; i >= 0; i -= 0.5) {
  //   show(i);
  // }

  await animation.toFile(`./compiled/levels.anim`);
};

compile();
