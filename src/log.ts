import { isFunction, isObject } from 'lodash';
import { LogLevel } from './log-level';

/**
 * Main logger class used by serializers for displaying messages.
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
    public readonly logLevel: LogLevel;

    /**
     * Info enabled?
     * 
     * @type {boolean}
     */
    public readonly infoEnabled: boolean;

    /**
     * Warn enabled?
     * 
     * @type {boolean}
     */
    public readonly warnEnabled: boolean;

    /**
     * Error enabled?
     * 
     * @type {boolean}
     */
    public readonly errorEnabled: boolean;

    /**
     * Supports console?
     * 
     * @type {boolean}
     */
    public readonly supportsConsole: boolean;

    /**
     * Supports console log?
     * 
     * @type {boolean}
     */
    public readonly supportsConsoleLog: boolean;

    /**
     * Supports console info?
     * 
     * @type {boolean}
     */
    public readonly supportsConsoleInfo: boolean;

    /**
     * Supports console warn?
     * 
     * @type {boolean}
     */
    public readonly supportsConsoleWarn: boolean;

    /**
     * Supports console error?
     * 
     * @type {boolean}
     */
    public readonly supportsConsoleError: boolean;

    /**
     * Constructor.
     * 
     * @param {LogLevel} logLevel Log level.
     */
    public constructor(logLevel: LogLevel)
    {
        this.logLevel = logLevel;
        this.infoEnabled = this.logLevel <= LogLevel.Info;
        this.warnEnabled = this.logLevel <= LogLevel.Warn;
        this.errorEnabled = this.logLevel <= LogLevel.Error;
        this.supportsConsole = isObject(console);
        this.supportsConsoleLog = this.supportsConsole && isFunction(console.log);
        this.supportsConsoleInfo = this.supportsConsole && isFunction(console.info);
        this.supportsConsoleWarn = this.supportsConsole && isFunction(console.warn);
        this.supportsConsoleError = this.supportsConsole && isFunction(console.error);

        return;
    }

    /**
     * Displays info message.
     * 
     * @param {string} message Message to display.
     * @param {Array<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public info(message: string, ...optionalParams: Array<any>): void
    {
        if (this.supportsConsoleInfo)
        {
            console.info(message, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            console.log(`INFO: ${message}`, ...optionalParams);

            return;
        }

        return;
    }

    /**
     * Displays warn message.
     * 
     * @param {string} message Message to display.
     * @param {Array<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public warn(message: any, ...optionalParams: Array<any>): void
    {
        if (this.supportsConsoleWarn)
        {
            console.warn(message, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            console.log(`WARN: ${message}`, ...optionalParams);
            
            return;
        }

        return;
    }

    /**
     * Displays error message.
     * 
     * @param {string} message Message to display.
     * @param {Array<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void}
     */
    public error(message: string, ...optionalParams: Array<any>): void 
    {
        if (this.supportsConsoleError)
        {
            console.error(message, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            console.log(`ERROR: ${message}`, ...optionalParams);
            
            return;
        }

        return;
    }
}
