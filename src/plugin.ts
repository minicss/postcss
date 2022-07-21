import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { MiniCSS } from "@minicss/core";
import { Plugin } from "postcss";
import { OptionsI, ProcessorsT } from "./constants.js";
import { processClasses, processClassesAndIds, processIds, processor, processVariables } from "./utils.js";

function minicss(options: OptionsI = {}): Plugin {
  const { classes = true, ids = true, variables = true, outputMapFile = null } = options;

  return {
    postcssPlugin: "minicss",
    prepare(): ProcessorsT {
      const processors: ProcessorsT = {};

      const miniCSS = (new MiniCSS);

      if (classes && ids) processors.Rule = processor(miniCSS, processClassesAndIds);
      else if (classes) processors.Rule = processor(miniCSS, processClasses);
      else if (ids) processors.Rule = processor(miniCSS, processIds);

      if (variables) processors.Declaration = processor(miniCSS, processVariables);

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
