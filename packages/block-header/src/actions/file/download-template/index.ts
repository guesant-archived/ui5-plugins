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

import { ActionItem } from "@ui5/react-user-interface/lib/Actions";
import { getKey } from "../../../get-key";
import EditorHeader from "../../..";

const download = (path: string, filename: string) => {
  const a = document.createElement("a");
  a.setAttribute("href", path);
  a.setAttribute("download", filename);
  a.style.display = "none";
  a.click();
};

export const downloadTemplate = (plugin: EditorHeader): ActionItem => [
  { value: getKey(Math.random()), children: "Exportar Template" },
  async () => {
    if (plugin.editor) {
      const { template } = plugin.editor.state;
      const destfile = "template.json";
      const outputJSON = JSON.stringify(optimizedTemplate);
      const output = window.Blob
        ? URL.createObjectURL(
            new Blob([outputJSON], { type: "application/json" }),
          )
        : "data:text/plain;charset=utf-8," + encodeURIComponent(outputJSON);
      download(output, destfile);
    }
  },
];