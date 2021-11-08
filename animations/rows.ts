import { Animation } from "../src/animation";
import { Color, Colors } from "../src/color";
import { Icicles } from "../src/icicles";

const optimize = true;

const compile = async () => {
  const xCount = 20;
  const yCount = 15;
  const icicles = new Icicles(xCount, yCount);
  const animation = new Animation({
    name: "Rzędy",
    optimize,
    versionNumber: 1,
    xCount,
    yCount,
    loopsCount: 2,
  });

  const colorTrip = (color: Color) => {
    for (let y = 0; y < yCount; y++) {
      for (let x = 0; x < xCount; x++) {
        icicles.setAllPixelsColor(new Color(0, 0, 0));
        icicles.setPixelColor(x, y, color);
        animation.addFrame(icicles.toFrame(10));
      }
    }
  };

  colorTrip(Colors.red);
  colorTrip(Colors.green);

  await animation.toFile(`./compiled/rows${optimize ? "-optimized" : ""}.anim`);
  await Animation.fromFile(
    `./compiled/rows${optimize ? "-optimized" : ""}.anim`
  );
};

compile();
