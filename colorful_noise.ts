import Animation from "./icicles/animation";
import Color, { Colors, IndexedColor } from "./icicles/color";
import Icicles from "./icicles/icicles";

const optimize = true;

const compile = async () => {
  const icicles = new Icicles(20, 15);
  const anim = new Animation(`Kolorowy szum`, 300, { optimize });

  const generateNoiseWithColor = (color: Color) => {
    const pixels = icicles.pixels;

    const indexedPixels = pixels.map(
      (color, index) => new IndexedColor(index, color)
    );

    /// generate noise pixel by pixel
    while (indexedPixels.length > 0) {
      const randomPixelIndex = Math.floor(Math.random() * indexedPixels.length);

      const [removedPixel] = indexedPixels.splice(randomPixelIndex, 1);

      icicles.setPixelColorAtIndex(removedPixel.index, color);

      anim.addFrame(icicles.toFrame(10));
    }

    /// darken all pixels to 0;
    let progress: number = 0.0;
    while (progress < 1.0) {
      progress += 0.01;

      const newColor = color.darken(progress);
      icicles.setAllPixelsColor(newColor);

      anim.addFrame(icicles.toFrame(40));
    }

    /// wait for second before next cycle
    anim.addFrame(icicles.toFrame(1000));
  };

  generateNoiseWithColor(Colors.white);
  generateNoiseWithColor(Colors.orange);
  generateNoiseWithColor(Colors.oceanBlue);
  generateNoiseWithColor(Colors.magenta);
  generateNoiseWithColor(Colors.red);
  generateNoiseWithColor(Colors.blue);
  generateNoiseWithColor(Colors.green);

  await anim.toFile(`./kolorowy-szum${optimize ? "-optimized" : ""}.anim`);

  // const readedFile = readFileSync('./123.anim' ??`./optimized-${optimize}.anim`);
  // const file = Uint8Array.from(readedFile);
  // console.log("readed", file);
};

compile();
