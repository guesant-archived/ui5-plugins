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

import { findIndexByObject } from "@ui5/shared-lib/lib/canvas/find-index-by-object";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { Canvas, Object } from "fabric/fabric-impl";

const reactive = (canvas: Canvas) => (trigger: string, fn: any) =>
  trigger.split(" ").forEach((i) => canvas.on(i, fn));

export default class SyncSelection extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Sync Selection",
      },
    };
  }
  onSetup() {}
  async onMount() {}
  async onSetupCanvas() {
    if (this.canvas) {
      const _reactive = reactive(this.canvas);
      const findIndexByObject_ = findIndexByObject(this.canvas);
      _reactive("selection:created selection:updated", (e: any) => {
        this.editor?.onSetEditor({
          ...this.editor.state.editor,
          selectedObjects: e.selected.map(
            (object: Object) =>
              findIndexByObject_(object) -
              (this.editor?.state.template.model.staticImages.length || 0),
          ),
        });
      });
      _reactive("selection:cleared", () => {
        this.editor?.onSetEditor({
          ...this.editor.state.editor,
          selectedObjects: [],
        });
      });
    }
  }
}
