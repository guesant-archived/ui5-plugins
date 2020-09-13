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

import { fabric } from "fabric";
import { findIndexByObject } from "@ui5/shared-lib/lib/canvas/find-index-by-object";
import { Template } from "@fantastic-images/types/src/Template";

export const applySelectionToCanvas = async (
  canvas: fabric.Canvas,
  template: Template,
  selectedObjects: number[],
) => {
  if (selectedObjects.length) {
    const selected = canvas
      .getObjects()
      .filter((obj) =>
        selectedObjects.includes(
          findIndexByObject(canvas)(obj) -
            template.model.staticImages.filter(
              ({ position }) => position === "back",
            ).length,
        ),
      );
    canvas.discardActiveObject(new Event("NO_SYNC"));
    canvas.setActiveObject(
      new fabric.ActiveSelection(selected, {
        canvas: canvas,
      }),
      new Event("NO_SYNC"),
    );
  } else {
    canvas.discardActiveObject(new Event("NO_SYNC"));
  }
};
