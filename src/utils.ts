import { MiniCSS } from "@minicss/core";
import { Declaration, Node, Rule } from "postcss";
import {
  CLASS_SELECTOR_REGEX,
  ID_SELECTOR_REGEX,
  PostCSSProcessorT,
  PROCESSED,
  ProcessorT,
  PROPERTY_REGEX,
} from "./constants.js";

export function processClasses(miniCSS: MiniCSS, rule: Rule): void {
  rule.selector = rule.selector.replace(CLASS_SELECTOR_REGEX, (_, className) => `.${ miniCSS.class(className) }`);
}

export function processIds(miniCSS: MiniCSS, rule: Rule): void {
  rule.selector = rule.selector.replace(ID_SELECTOR_REGEX, (_, id) => `#${ miniCSS.id(id) }`);
}

export function processClassesAndIds(miniCSS: MiniCSS, rule: Rule): void {
  processClasses(miniCSS, rule);

  processIds(miniCSS, rule);
}

export function processVariables(miniCSS: MiniCSS, decl: Declaration): void {
  if (decl.variable) decl.prop = `--${ miniCSS.variable(decl.prop.substring(2)) }`;

  decl.value = decl.value.replace(PROPERTY_REGEX, (_, property) => `var(--${ miniCSS.variable(property) })`);
}

export function processor<T extends Node>(miniCSS: MiniCSS, fn: ProcessorT<T>): PostCSSProcessorT<T> {
  return (node, helpers) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((node as any)[PROCESSED]) return;

    fn(miniCSS, node, helpers);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node as any)[PROCESSED] = true;
  };
}
