import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Szum",
    optimize: true,
    xCount,
    yCount,
    useRgb565: false,
    loopsCount: 5,
    radioPanelsCount: 2,
  });
  const icicles = new Icicles(animation);

  const addNoiseFrame = (color: Color) => {
    const newPixels = icicles.pixels.map(() =>
      Math.random() > 0.5 ? Colors.black : color
    );
    icicles.setPixels(newPixels);
    icicles.show(new Duration({ milliseconds: 16 }));
  };

  const addNoisePart = (color: Color) => {
    let x = 0;
    for (let i = 0; i < 300; i++) {
      if (i % 60 == 0) {
        if (x % 2 == 0) {
          icicles.setRadioPanelColor(0, color);
        } else {
          icicles.setRadioPanelColor(1, new Color());
        }
        x++;
      }
      addNoiseFrame(color);
    }
  };

  addNoisePart(Colors.white);
  addNoisePart(Colors.red);
  addNoisePart(Colors.oceanBlue);
  addNoisePart(Colors.lawnGreen);
  addNoisePart(Colors.violet);
  addNoisePart(Colors.orange);

  await animation.toFile(`./compiled/szum.anim`);
};

compile();
