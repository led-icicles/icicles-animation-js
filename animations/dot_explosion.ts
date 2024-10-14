import {
  Animation,
  Color,
  Colors,
  VisualFrame,
  Icicles,
  Duration,
} from "../src";

const optimize = false;

const compile = async () => {
  const iciclesCount = 32;
  const ledsPerIcicle = 16;
  const animation = new Animation({
    name: "Eksplozja kulek oylv",
    optimize,
    versionNumber: 1,
    xCount: iciclesCount,
    radioPanelsCount: 2,
    yCount: ledsPerIcicle,
    loopsCount: 1,
    useRgb565: false,
  });
  const icicles = new Icicles(animation);

  const explode = (color: Color) => {
    const centerIndex = Math.round(ledsPerIcicle / 2);
    for (let i = 0; i < iciclesCount / 2; i++) {
      icicles.setAllPixelsColor(Colors.black);
      icicles.setPixelColor(i, centerIndex, color);
      icicles.setPixelColor(iciclesCount - 1 - i, centerIndex, color);

      animation.addFrame(icicles.toFrame(new Duration({ milliseconds: 30 })));
    }

    icicles.setAllPixelsColor(Colors.white);
    const whiteFrame = icicles.toFrame(new Duration({ milliseconds: 150 }));
    icicles.setRadioPanelColor(0, Colors.white);
    animation.addFrame(whiteFrame);

    for (let index = 0; index < iciclesCount / 2; index++) {
      icicles.setColumnColor(
        iciclesCount / 2 - 1 - index,
        color.darken(index / 10)
      );
      icicles.setColumnColor(
        iciclesCount / 2 + index,
        color.darken(index / 10)
      );
    }
    const colorFrame = icicles.toFrame(new Duration({ milliseconds: 40 }));

    let blend = 0;
    while (blend < 1) {
      blend += 0.075;
      const frame = VisualFrame.linearBlend(whiteFrame, colorFrame, blend, 20);
      icicles.setRadioPanelColor(
        0,
        Color.linearBlend(Colors.white, color, blend)
      );
      animation.addFrame(frame);
    }

    blend = 0;
    while (blend < 1) {
      blend += 0.025;
      const frame = colorFrame.darken(blend);
      icicles.setRadioPanelColor(
        0,
        Color.linearBlend(color, Colors.black, blend)
      );
      animation.addFrame(frame);
    }

    icicles.setAllPixelsColor(Colors.black);
    icicles.setRadioPanelColor(0, Colors.black);
    animation.addFrame(icicles.toFrame(new Duration({ milliseconds: 500 })));
  };

  // explode(Colors.red);
  // explode(Colors.blue);
  // explode(Colors.orange);
  // explode(Colors.magenta);
  explode(Colors.oceanBlue);
  explode(Colors.yellow);
  explode(Colors.lawnGreen);
  explode(Colors.violet);

  await animation.toFile(
    `compiled/dots${optimize ? "-optimized-rgb565" : ""}-oylv.anim`
  );
};

compile();
