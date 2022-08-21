import { ATTRIBUTE, MiniCSS } from "@minicss/core";
import { AtRule, Declaration, Node, Rule } from "postcss";
import {
  ANIMATION_NAMES,
  ATTRIBUTE_SELECTOR_REGEX,
  CLASS_SELECTOR_REGEX,
  ID_SELECTOR_REGEX,
  PostCSSProcessorT,
  PROCESSED,
  ProcessorT,
  VARIABLE_USAGE_REGEX,
} from "./constants.js";

export function processAttributeSelectors(miniCSS: MiniCSS, rule: Rule): void {
  rule.selector = rule.selector.replaceAll(ATTRIBUTE_SELECTOR_REGEX, (_, ...match) => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const { attribute, operator, value, caseSensitivity } = match[7];

    try {
      miniCSS.addAttributeSelector({
        attribute,
        operator,
        value,
        caseSensitivity,
      });
    } catch (error) {
      /* istanbul ignore next */
      rule.error((error as Error).message);
    }

    return _;
  });
}

export function replaceAttributeSelectors(miniCSS: MiniCSS, rule: Rule, attr?: ATTRIBUTE): void {
  rule.selector = rule.selector
    .replaceAll(ATTRIBUTE_SELECTOR_REGEX, (_, ...match) => {
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const { attribute, operator, quotes, value, caseSensitivity } = match[7];

      /* istanbul ignore next */
      if (attr && attribute !== attr) return _;

      try {
        const result = miniCSS.attributeSelector({
          attribute,
          operator,
          value,
          caseSensitivity,
        });

        return `[${
          attribute
        }${
          result.operator
        }${
          quotes
        }${
          result.value
        }${
          quotes
        }${
          /* istanbul ignore next */
          caseSensitivity ? ` ${ caseSensitivity }` : ""
        }]`;
      } catch (error) /* istanbul ignore next */ {
        rule.error((error as Error).message);

        return _;
      }
    });
}

export function processClasses(miniCSS: MiniCSS, rule: Rule): void {
  rule.selector = rule.selector.replaceAll(CLASS_SELECTOR_REGEX, (_, className) => `.${ miniCSS.classes().rename(className) }`);
}

export function processIds(miniCSS: MiniCSS, rule: Rule): void {
  rule.selector = rule.selector.replaceAll(ID_SELECTOR_REGEX, (_, id) => `#${ miniCSS.ids().rename(id) }`);
}

export function processRules(miniCSS: MiniCSS, rule: Rule): void {
  processClasses(miniCSS, rule);

  processIds(miniCSS, rule);
}

export function processVariables(miniCSS: MiniCSS, decl: Declaration): void {
  const { variable, prop, value } = decl;

  if (variable) decl.prop = `--${ miniCSS.variables().rename(prop.substring(2)) }`;

  decl.value = value.replaceAll(VARIABLE_USAGE_REGEX, (_, property) => `var(--${ miniCSS.variables().rename(property) })`);
}

export function processKeyframes(miniCSS: MiniCSS, atRule: AtRule): void {
  if (atRule.name.endsWith("keyframes")) atRule.params = miniCSS.keyframes().rename(atRule.params);
}

export function processKeyframesUsages(miniCSS: MiniCSS, decl: Declaration): void {
  const { prop, value } = decl;

  if (prop.endsWith("animation-name")) {
    if (ANIMATION_NAMES.includes(value) || value.startsWith("var(--")) return;

    decl.value = miniCSS.keyframes().rename(value);

    return;
  }

  if (!prop.endsWith("animation")) return;

  const words = value.split(" ");

  let name = words[0];
  let pattern = `^${ name }`;

  if (/^\d/.test(name)) {
    name = words[words.length - 1];
    pattern = `${ name }$`;
  }

  if (ANIMATION_NAMES.includes(name) || name.startsWith("var(--")) return;

  decl.value = value.replace(new RegExp(pattern), miniCSS.keyframes().rename(name));
}

export function processDeclarations(miniCSS: MiniCSS, decl: Declaration): void {
  processVariables(miniCSS, decl);

  processKeyframesUsages(miniCSS, decl);
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
