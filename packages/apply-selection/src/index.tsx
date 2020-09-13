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
import { applySelectionToCanvas } from "./applySelectionToCanvas";

export default class ApplySelection extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Apply Selection",
      },
    };
  }
  async applySelection(render = true) {
    if (this.editor && this.canvas) {
      const { canvas } = this;
      const { template, editor } = this.editor.state;
      await applySelectionToCanvas(canvas, template, editor.selectedObjects);
      render && canvas.requestRenderAll();
    }
  }
  onSetup() {
    this.editor?.events.on("ApplySelection", (render: boolean) =>
      this.applySelection(render),
    );
  }
  async onMount() {}
}
