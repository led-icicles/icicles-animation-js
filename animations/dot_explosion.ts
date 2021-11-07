import Animation from "../icicles/animation";
import Color, { Colors } from "../icicles/color";
import VisualFrame from "../icicles/frames/visual_frame";
import Icicles from "../icicles/icicles";

const optimize = true;

const compile = async () => {
  const iciclesCount = 20;
  const ledsPerIcicle = 15;
  const icicles = new Icicles(iciclesCount, ledsPerIcicle);
  const animation = new Animation({
    name: "Eksplozja kulek",
    optimize,
    version: 1,
    xCount: iciclesCount,
    yCount: ledsPerIcicle,
    loops: 1,
  });

  const explode = (color: Color) => {
    for (let i = 0; i < iciclesCount / 2; i++) {
      icicles.setAllPixelsColor(Colors.black);
      icicles.setPixelColor(i, 6, color);
      icicles.setPixelColor(19 - i, 6, color);

      animation.addFrame(icicles.toFrame(30));
    }

    icicles.setAllPixelsColor(Colors.white);
    const whiteFrame = icicles.toFrame(150);
    animation.addFrame(whiteFrame);

    for (let index = 0; index < iciclesCount / 2; index++) {
      icicles.setIcicleColor(9 - index, color.darken(index / 10));
      icicles.setIcicleColor(10 + index, color.darken(index / 10));
    }
    const colorFrame = icicles.toFrame(40);

    let blend = 0;
    while (blend < 1) {
      blend += 0.075;
      const frame = VisualFrame.linearBlend(whiteFrame, colorFrame, blend, 20);
      animation.addFrame(frame);
    }

    blend = 0;
    while (blend < 1) {
      blend += 0.025;
      const frame = colorFrame.darken(blend);
      animation.addFrame(frame);
    }

    icicles.setAllPixelsColor(Colors.black);
    animation.addFrame(icicles.toFrame(500));
  };

  explode(Colors.green);
  explode(Colors.red);
  explode(Colors.blue);
  explode(Colors.orange);
  explode(Colors.magenta);
  explode(Colors.oceanBlue);
  explode(Colors.yellow);
  explode(Colors.lawnGreen);
  explode(Colors.violet);

  /// play 2 times
  explode(Colors.green);
  explode(Colors.red);
  explode(Colors.blue);
  explode(Colors.orange);
  explode(Colors.magenta);
  explode(Colors.oceanBlue);
  explode(Colors.yellow);
  explode(Colors.lawnGreen);
  explode(Colors.violet);

  await animation.toFile(
    `./eksplozja-kulek${optimize ? "-optimized" : ""}.anim`
  );
};

compile();
