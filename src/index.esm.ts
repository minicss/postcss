import { PluginCreator } from "postcss";
import { OptionsI } from "./constants.js";
import minicss from "./plugin.js";

export default minicss as PluginCreator<OptionsI>;

export const postcss = true;

export type { OptionsI };
