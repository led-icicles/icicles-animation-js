import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 32;
  const yCount = 16;
  const animation = new Animation({
    name: "Szum",
    optimize: true,
    xCount,
    yCount,
    useRgb565: false,
    loopsCount: 1,
    radioPanelsCount: 2,
  });
  const icicles = new Icicles(animation);

  const addNoiseFrame = (color: Color) => {
    const newPixels = icicles.pixels.map(() =>
      Math.random() > 0.5 ? Colors.black : color
    );
    icicles.setPixels(newPixels);
    icicles.show(new Duration({ milliseconds: 33 }));
  };

  const addNoisePart = (color: Color) => {
    const frames = 60;
    for (let i = 0; i < frames; i++) {
      icicles.setRadioPanelColor(1, color.darken(Math.sin((i + Math.PI)  * 0.25)));
      icicles.setRadioPanelColor(2, color.darken(Math.sin(i * 0.25)));
      
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
