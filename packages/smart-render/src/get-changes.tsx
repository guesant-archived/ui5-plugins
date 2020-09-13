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

import equal from "deep-equal";
import { fabric } from "fabric";
import { Object as FabricObject } from "fabric/fabric-impl";
import { Template } from "@fantastic-images/types/src/Template";

export const getChanges = (
  canvas: fabric.Canvas,
  {
    model: {
      fabricExported: { objects },
      staticImages,
    },
  }: Template,
) =>
  objects
    .map((obj, idx) => {
      const canvasIndex = staticImages.length + idx;
      const canvasItem = (canvas as any).item(canvasIndex) as FabricObject;
      const canvasObj = canvasItem.toObject();
      return {
        obj,
        canvasItem,
        canvasIndex,
        changedProperties: [...Object.keys(canvasObj), ...Object.keys(obj)]
          .filter((i, idx, arr) => arr.indexOf(i) === idx)
          .map((key) => [key, obj[key], canvasObj[key]])
          .filter(([, val1, val2]) => !equal(val1, val2, { strict: true }))
          .reduce((acc, [key, newValue]) => ({ ...acc, [key]: newValue }), {}),
      };
    })
    .filter(({ changedProperties }) => Object.keys(changedProperties).length);
