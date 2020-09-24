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

import { Template } from "@fantastic-images/types/src/Template";
import { findIndexByObject } from "@ui5/shared-lib/lib/canvas/find-index-by-object";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";
import ApplySelection from ".";

const discart = (canvas: Canvas) => {
  const activeObject = canvas.getActiveObject();
  if (activeObject && activeObject.type === "group") {
    (canvas.getActiveObject() as any).toActiveSelection();
  }
  canvas.discardActiveObject(new Event("NO_SYNC"));
};

const getSelected = ({
  canvas,
  template,
  selectedObjects,
}: {
  canvas: Canvas;
  template: Template;
  selectedObjects: number[];
}) =>
  canvas
    .getObjects()
    .filter((obj) =>
      selectedObjects.includes(
        findIndexByObject(canvas)(obj) -
          template.model.staticImages.filter(
            ({ position }) => position === "back",
          ).length,
      ),
    );

export const applySelectionToCanvas = async (plugin: ApplySelection) => {
  if (!plugin.editor || !plugin.canvas) return;
  const {
    canvas,
    editor: {
      state: {
        template,
        editor: { selectedObjects },
      },
    },
  } = plugin;
  if (selectedObjects.length) {
    const selected = getSelected({ canvas, template, selectedObjects });
    discart(canvas);
    canvas.setActiveObject(
      new fabric.ActiveSelection(selected, { canvas }),
      new Event("NO_SYNC"),
    );
  } else {
    discart(canvas);
  }
};
