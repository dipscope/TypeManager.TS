import { LogLevel } from './log.level';
import { Fn } from './fn';

export class Log
{
    public static logLevel: LogLevel = LogLevel.Error;

    public static error(message?: string, ...optionalParams: any[]): void 
    {
        const consoleExists      = !Fn.isNil(console) && Fn.isObject(console);
        const consoleErrorExists = consoleExists && Fn.isFunction(console.error);
        const consoleLogExists   = consoleExists && Fn.isFunction(console.log);

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
    
    public static debug(message?: string, ...optionalParams: any[]): void
    {
        const consoleExists    = !Fn.isNil(console) && Fn.isObject(console);
        const consoleLogExists = consoleExists && Fn.isFunction(console.log);

        if (consoleLogExists) 
        {
            console.log(message, ...optionalParams);
        }

        return;
    }
    
    public static info(message?: any, ...optionalParams: any[]): void
    {
        const consoleExists     = !Fn.isNil(console) && Fn.isObject(console);
        const consoleWarnExists = consoleExists && Fn.isFunction(console.warn);
        const consoleLogExists  = consoleExists && Fn.isFunction(console.log);

        if (consoleWarnExists)
        {
            console.warn(message, ...optionalParams);
        } 
        else if (consoleLogExists)
        {
            console.log(`WARNING: ${message}`, ...optionalParams);
        }

        return;
    }
}
