import { Animation, Color, Colors, Curves, Duration, Icicles } from "../src";
type GradientDefinition = { left: Color; right: Color };

const compileGradients = async (
  definitions: Array<GradientDefinition & { name: string; filename: string }>
) => {
  const xCount = 20;
  const yCount = 30;
  for (const definition of definitions) {
    const animation = new Animation({
      name: definition.name,
      optimize: true,
      versionNumber: 1,
      xCount,
      useRgb565: false,
      yCount,
      radioPanelsCount: 2,
      loopsCount: 6,
    });
    const icicles = new Icicles(animation);
    const drawGradient = (left: Color, right: Color) => {
      for (let i = 0; i < xCount; i++) {
        const color = Color.linearBlend(left, right, (i + 1) / xCount);
        icicles.setColumnColor(i, color);
      }
      icicles.setRadioPanelColor(1, left);
      icicles.setRadioPanelColor(2, right);
      icicles.show(new Duration({ milliseconds: 33 }));
    };

    const animateGradient = (
      from: GradientDefinition,
      to: GradientDefinition
    ) => {
      const MAX = 32;
      for (let i = 0; i <= MAX; i++) {
        const progress = Curves.easeInExpo.transform(i / MAX);
        const left = Color.linearBlend(from.left, to.left, progress);
        const right = Color.linearBlend(from.right, to.right, progress);
        drawGradient(left, right);
      }
    };

    animateGradient(
      {
        left: definition.left,
        right: definition.right,
      },
      {
        left: definition.right,
        right: definition.left,
      }
    );
    animateGradient(
      {
        left: definition.right,
        right: definition.left,
      },
      {
        left: definition.left,
        right: definition.right,
      }
    );
    await animation.toFile(`./compiled/${definition.filename}.anim`);
  }
};

const compile = async () => {
  await compileGradients([
    {
      left: Colors.lightBlue,
      right: Colors.black,
      name: "Gradient niebieski",
      filename: "01.Gradient-lightblue",
    },
    {
      left: Colors.orange,
      right: Colors.black,
      name: "Gradient pomarańczowy",
      filename: "02.Gradient-orange",
    },
    {
      left: Colors.lawnGreen,
      right: Colors.black,
      name: "Gradient zielony",
      filename: "03.Gradient-lawnGreen",
    },
  ]);
};

compile();
