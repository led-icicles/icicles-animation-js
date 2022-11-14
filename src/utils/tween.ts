export class Tween {
  constructor(public readonly begin: number, public readonly end: number) {}

  public lerp(t: number): number {
    return this.begin + (this.end - this.begin) * t;
  }

  public transform(t: number): number {
    if (t == 0.0) return this.begin;
    if (t == 1.0) return this.end;
    return this.lerp(t);
  }
}
