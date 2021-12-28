import { Animation, Color, Colors, Duration, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 30;
  const animation = new Animation({
    name: "Dimm-violet",
    optimize: true,
    versionNumber: 1,
    xCount,
    useRgb565: false,
    yCount,
    radioPanelsCount: 2,
    loopsCount: 0,
  });
  const icicles = new Icicles(animation);

  const dimm = (color: Color) => {
    let i = 0;
    for (let i = -Math.PI * 0.5; i <= Math.PI * 1.5; i += 0.1) {
      const val = (Math.sin(i) + 1) * 0.5;
      console.log(val);
      const target = Color.linearBlend(Colors.black, color, val);
      icicles.setAllPixelsColor(target);
      icicles.setRadioPanelColor(0, target);
      icicles.show(new Duration({ milliseconds: 20 }));
    }
  };
  dimm(Colors.violet);

  await animation.toFile(`./compiled/dimm-violet.anim`);
};

compile();
