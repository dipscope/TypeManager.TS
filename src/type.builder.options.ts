import { LogLevel } from "./log.level";
import { Serializer } from "./serializer";
import { TypeCtor } from "./type.ctor";
import { TypeOptions } from "./type.options";

export interface TypeBuilderOptions
{
    logLevel?: LogLevel;
    typeOptionsMap?: Map<TypeCtor, TypeOptions>;
}