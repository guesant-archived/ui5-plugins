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

import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { fabric } from "fabric";
import { Canvas } from "fabric/fabric-impl";

export default class Zoom extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Zoom",
      },
    };
  }
  onSetup() {}
  async onMount() {}
  async onSetupCanvas() {
    if (this.canvas) {
      this.canvas.on("mouse:wheel", function (this: Canvas, { e }: any) {
        e.preventDefault();
        e.stopPropagation();
        this.zoomToPoint(
          new fabric.Point(e.offsetX, e.offsetY),
          Math.max(0.45, Math.min(20, this.getZoom() * 0.999 ** e.deltaY)),
        );
        this.requestRenderAll();
      });
    }
  }
}
