export type ColorJson = { r: number; g: number; b: number };

class Color {
  constructor(public red: number, public green: number, public blue: number) {}

  toJson = (): ColorJson => ({
    r: this.red,
    g: this.green,
    b: this.blue,
  });
}

export default Color;
