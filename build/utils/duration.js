export class Duration {
    constructor({ days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, }) {
        this._milliseconds =
            Duration.millisecondsPerDay * days +
                Duration.millisecondsPerHour * hours +
                Duration.millisecondsPerMinute * minutes +
                Duration.millisecondsPerSecond * seconds +
                milliseconds;
    }
    get days() {
        return Math.trunc(this._milliseconds / Duration.millisecondsPerDay);
    }
    get hours() {
        return Math.trunc(this._milliseconds / Duration.millisecondsPerHour);
    }
    get minutes() {
        return Math.trunc(this._milliseconds / Duration.millisecondsPerMinute);
    }
    get seconds() {
        return Math.trunc(this._milliseconds / Duration.millisecondsPerSecond);
    }
    get milliseconds() {
        return Math.trunc(this._milliseconds);
    }
}
Duration.millisecondsPerSecond = 1000;
Duration.secondsPerMinute = 60;
Duration.minutesPerHour = 60;
Duration.hoursPerDay = 24;
Duration.millisecondsPerMinute = Duration.millisecondsPerSecond * Duration.secondsPerMinute;
Duration.millisecondsPerHour = Duration.millisecondsPerMinute * Duration.minutesPerHour;
Duration.millisecondsPerDay = Duration.millisecondsPerHour * Duration.hoursPerDay;
