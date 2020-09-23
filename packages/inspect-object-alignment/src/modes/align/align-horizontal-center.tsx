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

import { getBoundingRect } from "@ui5/shared-lib/lib/template/get-bounding-rect";
import { getObjectsByIndex } from "@ui5/shared-lib/lib/template/get-objects-by-index";
import { updator } from "@ui5/shared-lib/lib/template/updator";
import InspectObjectAlignment from "../../";
import { generateHorizontalCenter } from "../../helpers/generate-horizontal-center";

export const alignHorizontalCenter = (
  plugin: InspectObjectAlignment,
): React.ButtonHTMLAttributes<HTMLButtonElement> => {
  if (!plugin.editor) return {};
  const {
    template,
    editor: { selectedObjects },
  } = plugin.editor.state;
  const update = updator(plugin);
  return {
    children: "hc",
    onClick: async () => {
      await update(
        generateHorizontalCenter(
          getObjectsByIndex(template)(selectedObjects)
            .map((object) => getBoundingRect(object))
            .reduce(
              ([minLeft, maxRight], { boxLeft, boxRight }) => [
                Math.min(boxLeft, minLeft),
                Math.max(boxRight, maxRight),
              ],
              [Infinity, -Infinity],
            )
            .reduce((acc, i) => (isNaN(acc) ? i : (acc + i) / 2), NaN),
        ),
      );
    },
  };
};
