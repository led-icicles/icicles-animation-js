import {
  Animation,
  Color,
  Colors,
  Duration,
  Icicles,
  IndexedColor,
} from "../src";

const compile = async () => {
  const iciclesCount = 20;
  const ledsPerIcicle = 30;
  const anim = new Animation({
    name: `Kolorowy szum`,
    optimize: true,
    xCount: iciclesCount,
    yCount: ledsPerIcicle,
    loopsCount: 1,
    useRgb565: true,
  });
  const icicles = new Icicles(anim);

  const generateNoiseWithColor = (color: Color) => {
    const pixels = icicles.pixels;

    const indexedPixels = pixels.map(
      (color, index) => new IndexedColor(index, color)
    );

    const getRandomPixelIndex = () =>
      Math.floor(Math.random() * indexedPixels.length);

    let index = 0;
    /// generate noise pixel by pixel
    while (indexedPixels.length > 0) {
      const randomPixelIndex = getRandomPixelIndex();
      const [removedPixel] = indexedPixels.splice(randomPixelIndex, 1);
      icicles.setPixelColorAtIndex(removedPixel.index, color);
      if (++index % 10 === 0) {
        anim.addFrame(icicles.toFrame(new Duration({ milliseconds: 16 })));
      }
    }
    /// wait for 500ms before next cycle
    anim.addFrame(icicles.toFrame(new Duration({ milliseconds: 500 })));
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

  await anim.toFile(`./compiled/kolorowy-szum-rgb565.anim`);
};

compile();
