import { PluginCreator } from "postcss";
import { OptionsI } from "./constants.js";
import minicss from "./plugin.js";

export = minicss as PluginCreator<OptionsI>;
