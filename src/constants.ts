import { MiniCSS } from "@minicss/core";
import { Helpers, Plugin } from "postcss";

export const NAME_REGEX = /-?(?:[_a-zA-Z]|\\[.:/\d])+(?:[-_a-zA-Z\d]|\\[.:/])*/g;

export const CLASS_SELECTOR_REGEX = new RegExp(`\\.(${ NAME_REGEX.source })`, "g");

export const ID_SELECTOR_REGEX = new RegExp(`#(${ NAME_REGEX.source })`, "g");

export const VARIABLE_REGEX = new RegExp(`-{2}(${ NAME_REGEX.source })`, "g");

export const VARIABLE_USAGE_REGEX = new RegExp(`var\\(${ VARIABLE_REGEX.source }\\)`, "g");

export const ATTRIBUTE_SELECTOR_REGEX = new RegExp(
  `\\[ *(?<attribute>class|id) *(?<operator>[~|^*$]?=) *(?<quotes>['"]?) *(?<value>${
    NAME_REGEX.source
  }) *\\k<quotes> *(?<caseSensitivity>[iIsS]?) *\\]`,
  "g",
);

export const ANIMATION_NAMES = ["none", "initial", "inherit"];

export const PROCESSED = Symbol("PROCESSED");

export interface OptionsI {
  classes?: boolean;
  ids?: boolean;
  keyframes?: boolean;
  outputMapFile?: string | null;
  variables?: boolean;
}

export type ProcessorsT = Pick<Plugin, Exclude<keyof Plugin, "postcssPlugin" | "prepare">>;

export type ProcessorT<T> = (miniCSS: MiniCSS, node: T, helper: Helpers) => Promise<void> | void;

export type PostCSSProcessorT<T> = (node: T, helper: Helpers) => Promise<void> | void;
