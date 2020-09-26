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
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import equal from "deep-equal";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";

export default class Zoom extends EditorPlugin {
  zoomHandler: any;

  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Zoom",
      },
    };
  }
  onSetup() {}
  async onMount() {}
  setZoomHandler = (newHandler: any) => {
    this.zoomHandler && this.canvas?.off("mouse:wheel", this.zoomHandler);
    this.zoomHandler = newHandler;
    this.canvas?.on("mouse:wheel", newHandler);
  };
  attachZoomListener() {
    if (this.canvas && this.editor) {
      const {
        template: {
          model: {
            sketch: { width, height },
          },
        },
      } = this.editor.state;
      const minZoom = 90 / Math.max(width, height);
      const maxZoom = 20;
      this.setZoomHandler(function (this: Canvas, { e }: any) {
        e.preventDefault();
        e.stopPropagation();
        this.zoomToPoint(
          new fabric.Point(e.offsetX, e.offsetY),
          Math.max(
            minZoom,
            Math.min(maxZoom, this.getZoom() * 0.999 ** e.deltaY),
          ),
        );
        this.requestRenderAll();
      });
    }
  }
  async onSetupCanvas() {
    if (this.editor) {
      this.editor?.events.on(
        "EditorOnSetTemplate",
        ([prevTemplate, currTemplate]: [Template, Template]) => {
          if (
            !equal(
              prevTemplate.model.sketch.width,
              currTemplate.model.sketch.width,
            ) ||
            !equal(
              prevTemplate.model.sketch.height,
              currTemplate.model.sketch.height,
            )
          ) {
            this.attachZoomListener();
          }
        },
      );
      this.attachZoomListener();
    }
  }
}
