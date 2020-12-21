import Animation from "./icicles/animation";
import Color from "./icicles/color";
import Icicles from "./icicles/icicles";

const compile = async () => {
  const icicles = new Icicles(20, 15);
  const anim = new Animation("anim", 300);

  icicles.setAllLedsColor(new Color(0, 0, 0));
  anim.addFrame(icicles.toVisualFrame(1000));
  icicles.setAllLedsColor(new Color(255, 255, 255));
  anim.addFrame(icicles.toVisualFrame(10));

    for (let i = 0; i < 100000; i++) {
      icicles.setAllLedsColor(new Color(255, 255, 255));
      anim.addFrame(icicles.toVisualFrame(10));
    }

  const tempFile = "./temp.anim";
  await anim.toFile(tempFile);

//   const readedFile = readFileSync(tempFile);
//   const file = Uint8Array.from(readedFile);
//   console.log("readed", file);
};

compile();
