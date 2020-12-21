import Color from "./color";
import Frame from "./frame";

class Icicles {
  public readonly leds: Array<Color>;
  constructor(
    public readonly iciclesCount: number,
    public readonly ledsPerIcicle: number
  ) {
    this.leds = new Array(iciclesCount * ledsPerIcicle).fill(
      new Color(0, 0, 0)
    );
  }

  getLedIndex = (icicle: number, led: number) => {
    return icicle * this.ledsPerIcicle + led;
  };

  setLedColor = (icicle: number, led: number, color: Color) => {
    const index = this.getLedIndex(icicle, led);
    this.leds[index] = color;
  };

  getLedColor = (icicle: number, led: number): Color => {
    const index = this.getLedIndex(icicle, led);
    return this.leds[index];
  };

  setAllLedsColor = (color: Color) => {
    this.leds.fill(color);
  };

  toVisualFrame = (duration: number) => {
    return new Frame(
      this.leds.map((color) => color.toJson()),
      duration
    );
  };
}

export default Icicles;
