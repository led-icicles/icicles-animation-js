export interface DurationOptions {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}
export declare class Duration {
    private readonly _milliseconds;
    static millisecondsPerSecond: number;
    static secondsPerMinute: number;
    static minutesPerHour: number;
    static hoursPerDay: number;
    private static millisecondsPerMinute;
    private static millisecondsPerHour;
    private static millisecondsPerDay;
    get days(): number;
    get hours(): number;
    get minutes(): number;
    get seconds(): number;
    get milliseconds(): number;
    constructor({ days, hours, minutes, seconds, milliseconds, }: DurationOptions);
}
