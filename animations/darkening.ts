import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Darkening",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 2,
  });
  const icicles = new Icicles(animation);

  const dimm = (color: Color) => {
    let i = 0;
    for (let i = -Math.PI * 0.5; i <= Math.PI * 1.5; i += 0.05) {
      const val = (Math.sin(i) + 1) * 0.5;
      const target = Color.linearBlend(Colors.black, color, val);
      icicles.setAllPixelsColor(target);
      icicles.setRadioPanelColor(0, target);
      icicles.show(new Duration({ milliseconds: 60 }));
    }
  };
  dimm(Colors.red);
  dimm(Colors.lightBlue);
  dimm(Colors.orange);
  dimm(Colors.violet);
  dimm(Colors.lawnGreen);
  dimm(Colors.magenta);
  dimm(Colors.yellow);
  dimm(Colors.blue);
  dimm(Colors.green);

  await animation.toFile(`./compiled/darkening.anim`);
};

compile();
