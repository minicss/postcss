/* eslint-disable import/no-relative-parent-imports */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import postcss from "postcss";
import { createStream } from "table";
import minicss from "..";

const KB = 1024;

const ENCODING = "utf8" as const;

const DIR = resolve(process.cwd(), "benchmarks");

const files = readdirSync(DIR).filter(file => file.endsWith(".css"));

const stream = createStream({
  columnDefault: {
    alignment: "center",
    width    : 25,
  },
  columnCount: 4,
});

stream.write([
  "CSS File",
  "Original Size",
  "Renamed Size",
  "Improvement",
]);

async function benchmark(): Promise<void> {
  for (const file of files) {
    const from = resolve(DIR, file);

    const css = readFileSync(from, ENCODING);

    const originalSize = Buffer.byteLength(css);

    // eslint-disable-next-line no-await-in-loop
    const result = await postcss([minicss()]).process(
      css,
      {
        from,
        map: false,
      },
    );

    const renamedSize = Buffer.byteLength(result.css);

    stream.write([
      file.replace(/\.css$/, ""),
      `${ (originalSize / KB).toLocaleString("en-US", { maximumFractionDigits: 3 }) } KB`,
      `${ (renamedSize / KB).toLocaleString("en-US", { maximumFractionDigits: 3 }) } KB`,
      ((originalSize - renamedSize) / originalSize).toLocaleString("en-US", {
        style                : "percent",
        maximumFractionDigits: 3,
      }),
    ]);
  }
}

// eslint-disable-next-line no-console
benchmark().finally(() => console.log(""));
