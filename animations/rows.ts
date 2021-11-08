import { Animation, Color, Colors, Icicles } from "../src";

const compile = async () => {
  const xCount = 20;
  const yCount = 15;
  const icicles = new Icicles(xCount, yCount);
  const animation = new Animation({
    name: "Rzędy",
    optimize: true,
    versionNumber: 1,
    xCount,
    yCount,
    loopsCount: 5,
  });

  const columnsTo = (color: Color) => {
    for (let x = 0; x < xCount; x++) {
      icicles.setColumnColor(x, color);
      animation.addFrame(icicles.toFrame(32));
    }
  };
  const rowsTo = (color: Color) => {
    for (let y = 0; y < yCount; y++) {
      icicles.setRowColor(y, color);
      animation.addFrame(icicles.toFrame(32));
    }
  };
  rowsTo(Colors.green);
  columnsTo(Colors.red);
  rowsTo(Colors.blue);
  columnsTo(Colors.orange);
  rowsTo(Colors.magenta);
  columnsTo(Colors.oceanBlue);
  rowsTo(Colors.yellow);
  columnsTo(Colors.lawnGreen);
  rowsTo(Colors.violet);
  columnsTo(Colors.green);
  rowsTo(Colors.red);
  columnsTo(Colors.blue);
  rowsTo(Colors.orange);
  columnsTo(Colors.magenta);
  rowsTo(Colors.oceanBlue);
  columnsTo(Colors.yellow);
  rowsTo(Colors.lawnGreen);
  columnsTo(Colors.violet);

  await animation.toFile(`./compiled/rows.anim`);
};

compile();
