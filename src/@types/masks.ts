import { MasksTypes } from "./input";

export type Masks = MasksTypes | Array<string | RegExp> | Function;

export type ValueType = string | number | string[] | undefined;
export type MaskChar = string | RegExp | MasksTypes;
export type MaskType = MaskChar[] | ((value: string) => MaskChar[]);
