import { Animation, Color, Colors, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const icicles = new Icicles(xCount, yCount);
  const anim = new Animation({ name: "Szum", optimize: true, xCount, yCount });

  const addNoiseFrame = (color: Color) => {
    const newPixels = icicles.pixels.map(() =>
      Math.random() > 0.5 ? Colors.black : color
    );
    icicles.setPixels(newPixels);
    anim.addFrame(icicles.toFrame(50));
  };

  const addNoisePart = (color: Color) => {
    for (let i = 0; i < 300; i++) {
      addNoiseFrame(color);
    }
  };

  addNoisePart(Colors.white);
  addNoisePart(Colors.red);
  addNoisePart(Colors.oceanBlue);
  addNoisePart(Colors.lawnGreen);
  addNoisePart(Colors.violet);
  addNoisePart(Colors.orange);

  await anim.toFile(`./compiled/szum.anim`);
};

compile();
