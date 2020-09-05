#!/usr/bin/env node

//region Preamble
/**
 * https://github.com/guesant/ui5-monorepo
 * Copyright (C) 2020 Gabriel Rodrigues
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
//endregion

const glob = require("glob");
const { join } = require("path");
const { readFileSync, writeFileSync } = require("fs");
const { genericJS } = require("./preamble");

const basepath = join(__dirname, "../../packages/*");

glob(
  join(basepath, "!(node_modules|lib)/**/*.{js,jsx,ts,tsx}"),
  { nodir: true },
  (_, files) => {
    files.forEach((file) => {
      console.log(file);
      const fileContents = readFileSync(file, "utf-8");
      const hasPreamble = fileContents.includes("//region Preamble");
      const [start, end] = hasPreamble
        ? [
            fileContents.indexOf("//region Preamble"),
            fileContents.indexOf("//endregion") + 11,
          ]
        : [0, 0];
      const [before, after] = [
        fileContents.slice(0, start).trim(),
        fileContents.slice(end).trimLeft(),
      ];
      writeFileSync(file, [before, genericJS, after].join("\n\n").trimLeft());
    });
  },
);
