import { MiniCSS } from "@minicss/core";
import { Helpers, Plugin } from "postcss";

export const CLASS_REGEX = /(?<className>-?(?:[_a-zA-Z]|\\[.:/\d])+(?:[-_a-zA-Z\d]|\\[.:/])*)/gm;
export const CLASS_SELECTOR_REGEX = new RegExp(`\\.${ CLASS_REGEX.source }`, "gm");

export const ID_REGEX = /(?<id>-?(?:[_a-zA-Z]|\\[.:/\d])+(?:[-_a-zA-Z\d]|\\[.:/])*)/gm;
export const ID_SELECTOR_REGEX = new RegExp(`#${ ID_REGEX.source }`, "gm");

export const VARIABLE_REGEX = /-{2}(?<variable>-?[_a-zA-Z]+[-_a-zA-Z\d]*)/gm;
export const PROPERTY_REGEX = new RegExp(`var\\(${ VARIABLE_REGEX.source }\\)`, "gm");

export const PROCESSED = Symbol("PROCESSED");

export interface OptionsI {
  classes?: boolean;
  ids?: boolean;
  outputMapFile?: string | null;
  variables?: boolean;
}

export type ProcessorsT = Pick<Plugin, Exclude<keyof Plugin, "postcssPlugin" | "prepare">>;

export type ProcessorT<T> = (miniCSS: MiniCSS, node: T, helper: Helpers) => Promise<void> | void;

export type PostCSSProcessorT<T> = (node: T, helper: Helpers) => Promise<void> | void;
