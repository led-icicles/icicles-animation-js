export interface DurationOptions {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export class Duration {
  private readonly _milliseconds: number;

  public static millisecondsPerSecond = 1000;
  public static secondsPerMinute = 60;
  public static minutesPerHour = 60;
  public static hoursPerDay = 24;

  private static millisecondsPerMinute =
    Duration.millisecondsPerSecond * Duration.secondsPerMinute;
  private static millisecondsPerHour =
    Duration.millisecondsPerMinute * Duration.minutesPerHour;
  private static millisecondsPerDay =
    Duration.millisecondsPerHour * Duration.hoursPerDay;

  public get days(): number {
    return Math.trunc(this._milliseconds / Duration.millisecondsPerDay);
  }

  public get hours(): number {
    return Math.trunc(this._milliseconds / Duration.millisecondsPerHour);
  }

  public get minutes(): number {
    return Math.trunc(this._milliseconds / Duration.millisecondsPerMinute);
  }

  public get seconds(): number {
    return Math.trunc(this._milliseconds / Duration.millisecondsPerSecond);
  }
  public get milliseconds(): number {
    return Math.trunc(this._milliseconds);
  }

  constructor({
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  }: DurationOptions) {
    this._milliseconds =
      Duration.millisecondsPerDay * days +
      Duration.millisecondsPerHour * hours +
      Duration.millisecondsPerMinute * minutes +
      Duration.millisecondsPerSecond * seconds +
      milliseconds;
  }
}
