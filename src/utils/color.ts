import { UINT_8_MAX_SIZE } from ".";

export type ColorJson = { r: number; g: number; b: number };

export class Color {
  private readonly _value: number;
  public get value(): number {
    return this._value;
  }

  constructor(red: number = 0, green: number = 0, blue: number = 0) {
    if (
      red > UINT_8_MAX_SIZE ||
      green > UINT_8_MAX_SIZE ||
      blue > UINT_8_MAX_SIZE ||
      red < 0 ||
      green < 0 ||
      blue < 0
    ) {
      throw new Error(
        "Color components (red, green, blue) should be larger or equal 0 but no larger than 255."
      );
    }
    this._value = (red << 16) + (green << 8) + blue;
  }

  public get red(): number {
    return (this._value & 0xff0000) >> 16;
  }
  public get green(): number {
    return (this._value & 0x00ff00) >> 8;
  }
  public get blue(): number {
    return this._value & 0x0000ff;
  }

  public toJson = (): ColorJson => ({
    r: this.red,
    g: this.green,
    b: this.blue,
  });

  public toRgb565(): number {
    return (
      ((this.red & 0xf8) << 8) + ((this.green & 0xfc) << 3) + (this.blue >> 3)
    );
  }

  public notEquals = (color: Color) => !this.equals(color);

  public equals = (color: Color): boolean =>
    this.red === color.red &&
    this.green === color.green &&
    this.blue === color.blue;

  public toIndexedColor = (index: number): IndexedColor =>
    new IndexedColor(index, this);

  public darken = (progress: number): Color =>
    Color.linearBlend(this, new Color(0, 0, 0), progress);

  static linearBlend = (left: Color, right: Color, progress: number): Color => {
    const MIN_PROGRESS = 0.0;
    const MAX_PROGRESS = 1.0;
    const clampedProgress =
      progress > MAX_PROGRESS
        ? MAX_PROGRESS
        : progress < MIN_PROGRESS
        ? MIN_PROGRESS
        : progress;
    return new Color(
      left.red + (right.red - left.red) * clampedProgress,
      left.green + (right.green - left.green) * clampedProgress,
      left.blue + (right.blue - left.blue) * clampedProgress
    );
  };

  public copyWith = ({
    red,
    green,
    blue,
  }: {
    red?: number;
    green?: number;
    blue?: number;
  } = {}): Color =>
    new Color(red ?? this.red, green ?? this.green, blue ?? this.blue);
}

export class IndexedColor extends Color {
  constructor(public readonly index: number, color: Color) {
    super(color.red, color.green, color.blue);
  }

  public toColor(): Color {
    return new Color(this.red, this.green, this.blue);
  }

  public copyWith = ({
    red,
    green,
    blue,
    index,
  }: {
    red?: number;
    green?: number;
    blue?: number;
    index?: number;
  } = {}) =>
    new IndexedColor(index ?? this.index, super.copyWith({ red, green, blue }));
}

/// Contains predefined colors that are used on icicles controler.
export abstract class Colors {
  static readonly green = new Color(0, 255, 0);
  static readonly red = new Color(255, 0, 0);
  static readonly blue = new Color(0, 0, 255);
  static readonly lightBlue = new Color(0, 255, 255);
  static readonly yellow = new Color(255, 255, 0);
  static readonly magenta = new Color(255, 0, 255);
  static readonly orange = new Color(255, 51, 0);
  static readonly violet = new Color(60, 0, 100);
  static readonly oceanBlue = new Color(0, 255, 50);
  static readonly lawnGreen = new Color(80, 192, 0);
  static readonly black = new Color(0, 0, 0);
  static readonly white = new Color(255, 255, 255);

  static readonly colors = [
    Colors.green,
    Colors.red,
    Colors.blue,
    Colors.lightBlue,
    Colors.yellow,
    Colors.magenta,
    Colors.orange,
    Colors.violet,
    Colors.oceanBlue,
    Colors.lawnGreen,
  ];

  public get randomColor(): Color {
    return Colors.colors[Math.floor(Math.random() * Colors.colors.length)];
  }
}
