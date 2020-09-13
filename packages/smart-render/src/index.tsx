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
import * as fiCore from "@fantastic-images/core";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";

export default class SmartRender extends EditorPlugin {
  async forceRender() {
    if (this.editor && this.canvas) {
      const { canvas } = this;
      const { template } = this.editor.state;
      await fiCore.fabric.render.renderTemplate({ fabric })({
        canvas,
      })(template);
    }
  }
  onRegisterPlugin() {
    return {
      info: {
        name: "Smart Render Plugin",
      },
    };
  }
  onSetup() {
    this.editor?.events.on("CanvasForceRender", () => this.forceRender());
  }
  async onMount() {}
}
