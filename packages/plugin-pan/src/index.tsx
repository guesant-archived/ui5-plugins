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
import { Canvas } from "fabric/fabric-impl";

interface PanCanvas extends Canvas {
  isDragging: boolean;
  lastPosX: number;
  lastPosY: number;
}

export default class Pan extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Pan",
      },
    };
  }
  onSetup() {}
  onMount() {}
  async onSetupCanvas() {
    if (this.canvas) {
      this.canvas.on("mouse:down", function (this: PanCanvas, { e }: any) {
        if (e.altKey) {
          this.isDragging = true;
          this.selection = false;
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
      this.canvas.on("mouse:move", function (this: PanCanvas, { e }: any) {
        if (this.isDragging) {
          const vpt = this.viewportTransform || [];
          vpt[4] += e.clientX - this.lastPosX;
          vpt[5] += e.clientY - this.lastPosY;
          this.setViewportTransform(this.viewportTransform as any);
          this.requestRenderAll();
          this.lastPosX = e.clientX;
          this.lastPosY = e.clientY;
        }
      });
      this.canvas.on("mouse:up", function (this: PanCanvas) {
        this.setViewportTransform(this.viewportTransform as any);
        this.isDragging = false;
        this.selection = true;
      });
    }
  }
}
