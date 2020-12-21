export type ColorJson = { r: number; g: number; b: number };

export class Color {
  constructor(
    public readonly red: number,
    public readonly green: number,
    public readonly blue: number
  ) {}

  toJson = (): ColorJson => ({
    r: this.red,
    g: this.green,
    b: this.blue,
  });

  notEquals = (color: Color) => !this.equals(color);

  equals = (color: Color): boolean =>
    this.red === color.red &&
    this.green === color.green &&
    this.blue === color.blue;

  toIndexedColor = (index: number): IndexedColor =>
    new IndexedColor(index, this);
}

export class IndexedColor {
  constructor(public readonly index: number, public readonly color: Color) {}
}

export default Color;
