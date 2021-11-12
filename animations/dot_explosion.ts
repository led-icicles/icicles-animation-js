import {
  Animation,
  Color,
  Colors,
  VisualFrame,
  Icicles,
  Duration,
} from "../src";

const optimize = true;

const compile = async () => {
  const iciclesCount = 20;
  const ledsPerIcicle = 30;
  const icicles = new Icicles(iciclesCount, ledsPerIcicle);
  const animation = new Animation({
    name: "Eksplozja kulek",
    optimize,
    versionNumber: 1,
    xCount: iciclesCount,
    yCount: ledsPerIcicle,
    loopsCount: 2,
  });

  const explode = (color: Color) => {
    const centerIndex = Math.round (ledsPerIcicle / 2)
    for (let i = 0; i < iciclesCount / 2; i++) {
      icicles.setAllPixelsColor(Colors.black);
      icicles.setPixelColor(i, centerIndex, color);
      icicles.setPixelColor(19 - i, centerIndex, color);

      animation.addFrame(icicles.toFrame(new Duration({ milliseconds: 30 })));
    }

    icicles.setAllPixelsColor(Colors.white);
    const whiteFrame = icicles.toFrame(new Duration({ milliseconds: 150 }));
    animation.addFrame(whiteFrame);

    for (let index = 0; index < iciclesCount / 2; index++) {
      icicles.setColumnColor(9 - index, color.darken(index / 10));
      icicles.setColumnColor(10 + index, color.darken(index / 10));
    }
    const colorFrame = icicles.toFrame(new Duration({ milliseconds: 40 }));

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
    animation.addFrame(icicles.toFrame(new Duration({ milliseconds: 500 })));
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

  await animation.toFile(
    `./eksplozja-kulek${optimize ? "-optimized" : ""}.anim`
  );

  await Animation.fromFile(
    `./eksplozja-kulek${optimize ? "-optimized" : ""}.anim`
  );
};

compile();
