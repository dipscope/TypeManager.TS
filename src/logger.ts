import { LoggerLevel } from './logger-level';

/**
 * Main logger class used for displaying messages.
 * 
 * @type {Logger}
 */
export class Logger
{
    /**
     * Logger level defines what kind of messages should be displayed in the console.
     * 
     * @type {LoggerLevel}
     */
    private readonly loggerLevel: LoggerLevel;
    
    /**
     * Debug disabled?
     * 
     * @type {boolean}
     */
    private readonly debugDisabled: boolean;

    /**
     * Info disabled?
     * 
     * @type {boolean}
     */
    private readonly infoDisabled: boolean;

    /**
     * Warn disabled?
     * 
     * @type {boolean}
     */
    private readonly warnDisabled: boolean;

    /**
     * Error disabled?
     * 
     * @type {boolean}
     */
    private readonly errorDisabled: boolean;

    /**
     * Supports console?
     * 
     * @type {boolean}
     */
    private readonly supportsConsole: boolean;

    /**
     * Supports console log?
     * 
     * @type {boolean}
     */
    private readonly supportsConsoleLog: boolean;

    /**
     * Supports console info?
     * 
     * @type {boolean}
     */
    private readonly supportsConsoleInfo: boolean;

    /**
     * Supports console warn?
     * 
     * @type {boolean}
     */
    private readonly supportsConsoleWarn: boolean;

    /**
     * Supports console error?
     * 
     * @type {boolean}
     */
    private readonly supportsConsoleError: boolean;

    /**
     * Constructor.
     * 
     * @param {LoggerLevel} loggerLevel Logger level.
     */
    public constructor(loggerLevel: LoggerLevel)
    {
        this.loggerLevel = loggerLevel;
        this.debugDisabled = this.loggerLevel > LoggerLevel.Debug;
        this.infoDisabled = this.loggerLevel > LoggerLevel.Info;
        this.warnDisabled = this.loggerLevel > LoggerLevel.Warn;
        this.errorDisabled = this.loggerLevel > LoggerLevel.Error;
        this.supportsConsole = console !== undefined && console !== null;
        this.supportsConsoleLog = this.supportsConsole && console.log !== undefined && console.log !== null;
        this.supportsConsoleInfo = this.supportsConsole && console.info !== undefined && console.info !== null;
        this.supportsConsoleWarn = this.supportsConsole && console.warn !== undefined && console.warn !== null;
        this.supportsConsoleError = this.supportsConsole && console.error !== undefined && console.error !== null;

        return;
    }

    /**
     * Formats message based on component and level.
     * 
     * @param {string} component Component which logs the message.
     * @param {string} loggerLevel Logger level.
     * @param {string} message Message to display.
     * 
     * @returns {string} Formatted message.
     */
    private format(component: string, loggerLevel: string, message: string): string
    {
        return `[${component}][${loggerLevel}]: ${message}`;
    }

    /**
     * Displays debug message.
     * 
     * @param {string} component Component which logs the message.
     * @param {string} message Message to display.
     * @param {ReadonlyArray<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void} Nothing.
     */
    public debug(component: string, message: string, ...optionalParams: ReadonlyArray<any>): void
    {
        if (this.debugDisabled)
        {
            return;
        }

        if (this.supportsConsoleLog)
        {
            const debugMessage = this.format(component, 'Debug', message);

            console.log(debugMessage, ...optionalParams);

            return;
        }

        return;
    }

    /**
     * Displays info message.
     * 
     * @param {string} component Component which logs the message.
     * @param {string} message Message to display.
     * @param {ReadonlyArray<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void} Nothing.
     */
    public info(component: string, message: string, ...optionalParams: ReadonlyArray<any>): void
    {
        if (this.infoDisabled)
        {
            return;
        }

        if (this.supportsConsoleInfo)
        {
            const infoMessage = this.format(component, 'Info', message);

            console.info(infoMessage, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            const infoMessage = this.format(component, 'Info', message);

            console.log(infoMessage, ...optionalParams);

            return;
        }

        return;
    }

    /**
     * Displays warn message.
     * 
     * @param {string} component Component which logs the message.
     * @param {string} message Message to display.
     * @param {ReadonlyArray<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void} Nothing.
     */
    public warn(component: string, message: any, ...optionalParams: ReadonlyArray<any>): void
    {
        if (this.warnDisabled)
        {
            return;
        }

        if (this.supportsConsoleWarn)
        {
            const warnMessage = this.format(component, 'Warn', message);

            console.warn(warnMessage, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            const warnMessage = this.format(component, 'Warn', message);

            console.log(warnMessage, ...optionalParams);
            
            return;
        }

        return;
    }

    /**
     * Displays error message.
     * 
     * @param {string} component Component which logs the message.
     * @param {string} message Message to display.
     * @param {ReadonlyArray<any>} optionalParams Optional data related to a message.
     * 
     * @returns {void} Nothing.
     */
    public error(component: string, message: string, ...optionalParams: ReadonlyArray<any>): void 
    {
        if (this.errorDisabled)
        {
            return;
        }

        if (this.supportsConsoleError)
        {
            const errorMessage = this.format(component, 'Error', message);

            console.error(errorMessage, ...optionalParams);

            return;
        }

        if (this.supportsConsoleLog)
        {
            const errorMessage = this.format(component, 'Error', message);

            console.log(errorMessage, ...optionalParams);
            
            return;
        }

        return;
    }
}
