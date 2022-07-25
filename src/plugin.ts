import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { ATTRIBUTE, MiniCSS } from "@minicss/core";
import { Plugin } from "postcss";
import { OptionsI, ProcessorsT } from "./constants.js";
import {
  processAttributeSelectors,
  processClasses,
  processDeclarations,
  processIds,
  processKeyframes,
  processKeyframesUsages,
  processor,
  processRules,
  processVariables,
  replaceAttributeSelectors,
} from "./utils.js";

function minicss(options: OptionsI = {}): Plugin {
  const { classes = true, ids = true, keyframes = true, variables = true, outputMapFile = null } = options;

  return {
    postcssPlugin: "minicss",
    prepare(): ProcessorsT {
      const miniCSS = (new MiniCSS);

      const processors: ProcessorsT = {
        Once(root) {
          root.walkRules(rule => processAttributeSelectors(miniCSS, rule));

          miniCSS.optimize();

          if (classes && ids) root.walkRules(rule => replaceAttributeSelectors(miniCSS, rule));
          else if (classes) root.walkRules(rule => replaceAttributeSelectors(miniCSS, rule, ATTRIBUTE.CLASS));
          else if (ids) root.walkRules(rule => replaceAttributeSelectors(miniCSS, rule, ATTRIBUTE.ID));
        },
      };

      if (classes && ids) processors.Rule = processor(miniCSS, processRules);
      else if (classes) processors.Rule = processor(miniCSS, processClasses);
      else if (ids) processors.Rule = processor(miniCSS, processIds);

      if (keyframes) processors.AtRule = processor(miniCSS, processKeyframes);

      if (variables && keyframes) processors.Declaration = processor(miniCSS, processDeclarations);
      else if (variables) processors.Declaration = processor(miniCSS, processVariables);
      else if (keyframes) processors.Declaration = processor(miniCSS, processKeyframesUsages);

      if (outputMapFile != null) {
        processors.OnceExit = async (): Promise<void> => writeFile(
          resolve(process.cwd(), outputMapFile),
          JSON.stringify(miniCSS),
          "utf8",
        );
      }

      return processors;
    },
  };
}

minicss.postcss = true;

export default minicss;
