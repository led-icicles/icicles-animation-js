import { Animation, Color, Colors, Icicles, IndexedColor } from "../src";

const compile = async () => {
  const iciclesCount = 20;
  const ledsPerIcicle = 30;
  const icicles = new Icicles(iciclesCount, ledsPerIcicle);

  const anim = new Animation({
    name: `Kolorowy szum`,
    optimize: true,
    xCount: iciclesCount,
    yCount: ledsPerIcicle,
    loopsCount: 1,
  });

  const generateNoiseWithColor = (color: Color) => {
    const pixels = icicles.pixels;

    const indexedPixels = pixels.map(
      (color, index) => new IndexedColor(index, color)
    );

    const getRandomPixelIndex = () =>
      Math.floor(Math.random() * indexedPixels.length);

    /// generate noise pixel by pixel
    while (indexedPixels.length > 0) {
      const randomPixelIndex = getRandomPixelIndex();
      const [removedPixel] = indexedPixels.splice(randomPixelIndex, 1);
      icicles.setPixelColorAtIndex(removedPixel.index, color);
      anim.addFrame(icicles.toFrame(16));
    }
    /// wait for second before next cycle
    anim.addFrame(icicles.toFrame(500));
  };

  generateNoiseWithColor(Colors.white);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.orange);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.oceanBlue);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.magenta);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.red);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.blue);
  generateNoiseWithColor(Colors.black);
  generateNoiseWithColor(Colors.green);
  generateNoiseWithColor(Colors.black);

  await anim.toFile(`./compiled/kolorowy-szum.anim`);
};

compile();
