import {
  Animation,
  Color,
  Colors,
  Curves,
  Duration,
  Icicles,
  Tween,
} from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Poziomy",
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
    const radio1 = (Math.sin(0 * Math.PI + shift) + 1) / 2;
    const radio2 = (Math.sin(0 * Math.PI + shift) + 1) / 2;

    const target1 = Color.linearBlend(left, right, radio1);
    const target2 = Color.linearBlend(right, left, radio2);
    icicles.setRadioPanelColor(1, target1);
    icicles.setRadioPanelColor(2, target2);
    icicles.show(new Duration({ milliseconds: 16 }));
  };

  const tween = new Tween(0.05, 0.35);
  const cycle = (left: Color, right: Color) => {
    for (let i = 0; i < 1; i += 0.001) {
      show(
        left,
        right,
        yCount,
        tween.transform(Curves.easeInQuint.transform(i))
      );
    }
    for (let i = 1; i >= 0; i -= 0.001) {
      show(
        left,
        right,
        yCount,
        tween.transform(Curves.easeInQuint.transform(i))
      );
    }
  };

  for (let i = 0; i < yCount; i += 0.25) {
    show(Colors.red, Colors.blue, i, 0.05);
  }

  cycle(Colors.red, Colors.blue);
  cycle(Colors.lawnGreen, Colors.violet);
  cycle(Colors.lightBlue, Colors.orange);

  for (let i = yCount; i >= 0; i -= 0.25) {
    show(Colors.lightBlue, Colors.orange, i, 0.05);
  }

  await animation.toFile(`./compiled/levels.anim`);
};

compile();
