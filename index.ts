import { readFileSync } from "fs";
import Animation from "./icicles/animation";
import Color from "./icicles/color";
import Icicles from "./icicles/icicles";

const optimize = true;

const compile = async () => {
  const icicles = new Icicles(20, 15);
  const anim = new Animation("janek", 300);

  for (let i = 0; i < 300; i++) {
    icicles.setAllPixelsColor(new Color(0, 0, 0));
    icicles.setPixelColorAtIndex(i, new Color(255, 0, 0));
    anim.addFrame(icicles.toFrame(10), { optimize });
  }

  const tempFile = "./temp.anim";
  await anim.toFile(tempFile);

  const readedFile = readFileSync(tempFile);
  const file = Uint8Array.from(readedFile);
  console.log("readed", file);
};

compile();
