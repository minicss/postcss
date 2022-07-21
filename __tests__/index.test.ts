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
      ":root { --red: red; } .red { color: var(--red); } .blue { color: blue; }"
      + " #red { color: red; } #blue { color: blue; }",
      { from: undefined },
    );

  expect(result.css)
    .toBe(":root { --_: red; } ._ { color: var(--_); } .a { color: blue; } #_ { color: red; } #a { color: blue; }");

  expect(existsSync(outputMapFile)).toBe(true);

  const nameMap = await fs.readFile(outputMapFile, "utf8");

  expect(JSON.parse(nameMap)).toEqual({
    classes: {
      red : "_",
      blue: "a",
    },
    ids: {
      red : "_",
      blue: "a",
    },
    variables: {
      red: "_",
    },
  });
});
