/* eslint-disable no-undefined,import/no-relative-parent-imports */
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import { resolve } from "node:path";
import postcss from "postcss";
import minicss from "../src/index.cjs.js";

it("should set postcss to be true", () => {
  expect(minicss.postcss).toBe(true);

  expect(typeof minicss).toBe("function");
});

it("should rename css classes", async () => {
  const result = await postcss([minicss()])
    .process(".red { color: red; } .blue { color: blue; }", { from: undefined });

  expect(result.css).toBe("._ { color: red; } .a { color: blue; }");
});

it("should not rename css classes", async () => {
  const result = await postcss([minicss({ classes: false })])
    .process(".red { color: red; } .blue { color: blue; }", { from: undefined });

  expect(result.css).toBe(".red { color: red; } .blue { color: blue; }");
});

it("should rename css ids", async () => {
  const result = await postcss([minicss()])
    .process("#red { color: red; } #blue { color: blue; }", { from: undefined });

  expect(result.css).toBe("#_ { color: red; } #a { color: blue; }");
});

it("should not rename css ids", async () => {
  const result = await postcss([minicss({ ids: false })])
    .process("#red { color: red; } #blue { color: blue; }", { from: undefined });

  expect(result.css).toBe("#red { color: red; } #blue { color: blue; }");
});

it("should rename css keyframes", async () => {
  const result = await postcss([minicss()])
    .process(
      "@keyframes color-change { from { color: blue; } to { color: red; } } .foo { animation-name: none; }",
      { from: undefined },
    );

  expect(result.css).toBe("@keyframes _ { from { color: blue; } to { color: red; } } ._ { animation-name: none; }");
});

it("should not rename css keyframes", async () => {
  const result = await postcss([minicss({ keyframes: false })])
    .process(
      "@keyframes color-change { from { color: blue; } to { color: red; } } .foo { animation-name: none; }",
      { from: undefined },
    );

  expect(result.css)
    .toBe("@keyframes color-change { from { color: blue; } to { color: red; } } ._ { animation-name: none; }");
});

it("should rename css variables", async () => {
  const result = await postcss([minicss()])
    .process(":root { --red: red; } .red { color: var(--red); }", { from: undefined });

  expect(result.css).toBe(":root { --_: red; } ._ { color: var(--_); }");
});

it("should not rename css variables", async () => {
  const result = await postcss([minicss({ variables: false })])
    .process(":root { --red: red; } .red { color: var(--red); }", { from: undefined });

  expect(result.css).toBe(":root { --red: red; } ._ { color: var(--red); }");
});

it("should output the name map results at the provided file path", async () => {
  const outputMapFile = resolve(os.tmpdir(), "minicss.map.json");

  const result = await postcss([minicss({ outputMapFile })])
    .process(
      ":root { --red: red; }"
      + " @keyframes color-change { from { color: blue; } to { color: red; } }"
      + " .red { color: var(--red); animation: none; } .blue { color: blue; animation: 1s color-change; }"
      + " #red { color: red; animation: color-change 1s; } #blue { color: blue; animation-name: color-change; }",
      { from: undefined },
    );

  expect(result.css)
    .toBe(":root { --_: red; }"
      + " @keyframes _ { from { color: blue; } to { color: red; } }"
      + " ._ { color: var(--_); animation: none; } .a { color: blue; animation: 1s _; }"
      + " #_ { color: red; animation: _ 1s; } #a { color: blue; animation-name: _; }");

  expect(existsSync(outputMapFile)).toBe(true);

  const nameMap = await fs.readFile(outputMapFile, "utf8");

  expect(JSON.parse(nameMap)).toEqual({
    classes: {
      last: "a",
      map : {
        red : "_",
        blue: "a",
      },
      selectors: {
        start  : [],
        contain: [],
        end    : [],
      },
    },
    ids: {
      last: "a",
      map : {
        red : "_",
        blue: "a",
      },
      selectors: {
        start  : [],
        contain: [],
        end    : [],
      },
    },
    keyframes: {
      last     : "_",
      map      : { "color-change": "_" },
      selectors: {
        start  : [],
        contain: [],
        end    : [],
      },
    },
    variables: {
      last     : "_",
      map      : { red: "_" },
      selectors: {
        start  : [],
        contain: [],
        end    : [],
      },
    },
  });
});
