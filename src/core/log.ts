import { Fn } from './fn';
import { LogLevel } from './log-level';

/**
 * Main logger class.
 * 
 * @type {Log}
 */
export class Log
{
    /**
     * Log level defines what kind of messages should be displayed in console.
     * 
     * @type {LogLevel}
     */
    public logLevel: LogLevel;

    /**
     * Constructor.
     * 
     * @param {LogLevel} logLevel Log level.
     */
    public constructor(logLevel: LogLevel)
    {
        this.logLevel = logLevel;

        return;
    }

    /**
     * Info log level is enabled?
     * 
     * @type {boolean}
     */
    public get infoEnabled(): boolean
    {
        return this.logLevel <= LogLevel.Info;
    }

    /**
     * Warn log level is enabled?
     * 
     * @type {boolean}
     */
    public get warnEnabled(): boolean
    {
        return this.logLevel <= LogLevel.Warn;
    }

    /**
     * Error log level is enabled?
     * 
     * @type {boolean}
     */
    public get errorEnabled(): boolean
    {
        return this.logLevel <= LogLevel.Error;
    }

    /**
     * Displays info message.
     * 
     * @param {string} message Message to display.
     * @param {any[]} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public info(message: string, ...optionalParams: any[]): void
    {
        const consoleExists = !Fn.isNil(console) && Fn.isObject(console);
        const consoleInfoExists = consoleExists && Fn.isFunction(console.info);
        const consoleLogExists = consoleExists && Fn.isFunction(console.log);

        if (consoleInfoExists)
        {
            console.info(message, ...optionalParams);
        }
        else if (consoleLogExists)
        {
            console.log(`INFO: ${message}`, ...optionalParams);
        }

        return;
    }

    /**
     * Displays warn message.
     * 
     * @param {string} message Message to display.
     * @param {any[]} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public warn(message: any, ...optionalParams: any[]): void
    {
        const consoleExists = !Fn.isNil(console) && Fn.isObject(console);
        const consoleWarnExists = consoleExists && Fn.isFunction(console.warn);
        const consoleLogExists = consoleExists && Fn.isFunction(console.log);

        if (consoleWarnExists)
        {
            console.warn(message, ...optionalParams);
        } 
        else if (consoleLogExists)
        {
            console.log(`WARN: ${message}`, ...optionalParams);
        }

        return;
    }

    /**
     * Displays error message.
     * 
     * @param {string} message Message to display.
     * @param {any[]} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public error(message: string, ...optionalParams: any[]): void 
    {
        const consoleExists = !Fn.isNil(console) && Fn.isObject(console);
        const consoleErrorExists = consoleExists && Fn.isFunction(console.error);
        const consoleLogExists = consoleExists && Fn.isFunction(console.log);

        if (consoleErrorExists)
        {
            console.error(message, ...optionalParams);
        } 
        else if (consoleLogExists)
        {
            console.log(`ERROR: ${message}`, ...optionalParams);
        }

        return;
    }
}
