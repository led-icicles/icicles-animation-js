import Animation from "../icicles/animation";
import Color from "../icicles/color";
import Icicles from "../icicles/icicles";

describe("Animation works correctly", () => {
  test("Encodes name correctly", () => {
    const animation = new Animation("animation", 300);

    expect(animation.getEncodedAnimationName()).toMatchInlineSnapshot(`
      Uint8Array [
        97,
        110,
        105,
        109,
        97,
        116,
        105,
        111,
        110,
        0,
      ]
    `);
  });

  test("VisualFrames works corretly", () => {
    const iciclesSize = 4;
    const icicles = new Icicles(1, iciclesSize);
    const animation = new Animation("animation", icicles.pixels.length, {
      optimize: false,
    });
    for (let i = 0; i < iciclesSize; i++) {
      icicles.setAllPixelsColor(new Color(0, 0, 0));
      icicles.setPixelColorAtIndex(i, new Color(255, 255, 255));
      animation.addFrame(icicles.toFrame(400));
    }

    expect(animation.toFileData()).toMatchSnapshot();
  });

  test("Creates AdditiveFrame corretly", () => {
    const iciclesSize = 4;
    const icicles = new Icicles(1, iciclesSize);
    const animation = new Animation("animation", icicles.pixels.length, {
      optimize: true,
    });
    for (let i = 0; i < iciclesSize; i++) {
      icicles.setAllPixelsColor(new Color(0, 0, 0));
      icicles.setPixelColorAtIndex(i, new Color(255, 255, 255));
      animation.addFrame(icicles.toFrame(400));
    }

    expect(animation.toFileData()).toMatchSnapshot();
  });
});
