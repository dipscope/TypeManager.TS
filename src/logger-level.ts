/**
 * Logger level.
 * 
 * @type {LoggerLevel}
 */
export enum LoggerLevel
{
    /**
     * All details are displayed. On this level everything
     * is logged including info, warn and errors.
     */
    Debug = 0,

    /**
     * Important details are displayed. Debug messages are not shown.
     * On this level warn and errors are included.
     */
    Info = 1,

    /**
     * Warning and errors are displayed without debug and info
     * messages.
     */
    Warn = 2,

    /**
     * Only errors are displayed.
     */
    Error = 3,

    /**
     * Nothing is displayed. All messages are hidden.
     */
    None = 4
}
