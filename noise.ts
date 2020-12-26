import Animation from "./icicles/animation";
import Color, { Colors } from "./icicles/color";
import Icicles from "./icicles/icicles";

const optimize = false;

const compile = async () => {
  const icicles = new Icicles(20, 15);
  const anim = new Animation(`Szum`, 300, { optimize });

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

  await anim.toFile(`./szum${optimize ? "-optimized" : ""}.anim`);

  // const readedFile = readFileSync('./123.anim' ??`./optimized-${optimize}.anim`);
  // const file = Uint8Array.from(readedFile);
  // console.log("readed", file);
};

compile();
