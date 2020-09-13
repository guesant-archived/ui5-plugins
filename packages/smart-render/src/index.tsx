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
import * as fiCore from "@fantastic-images/core";
import { Template } from "@fantastic-images/types/src/Template";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { getChanges } from "./get-changes";

const hasOwnProperty = (object: any, index: string) =>
  Object.prototype.hasOwnProperty.bind(object, index);

const needsFullRender = ([currentTemplate, newTemplate]: [
  Template,
  Template,
]) =>
  !equal(currentTemplate.model.sketch, newTemplate.model.sketch, {
    strict: true,
  }) ||
  !equal(currentTemplate.model.staticImages, newTemplate.model.staticImages, {
    strict: true,
  });

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
  async smartRender([currTemplate, newTemplate]: [Template, Template]) {
    if (needsFullRender([currTemplate, newTemplate])) {
      await this.forceRender();
    } else {
      if (this.editor && this.canvas) {
        const { canvas } = this;
        const { template } = this.editor.state;
        const changes = getChanges(canvas, template);
        if (changes.length) {
          canvas.discardActiveObject(new Event("NO_SYNC"));
          changes.forEach(({ canvasItem, changedProperties }) => {
            canvasItem.set(changedProperties);
            ["left", "top"].some((i) => hasOwnProperty(changedProperties, i)) &&
              canvasItem.setCoords();
          });
          this.editor.events.emit("ApplySelection", false);
          canvas.requestRenderAll();
        }
      }
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
    this.editor?.events.on("CanvasSmartRender", (arg0: any) =>
      this.smartRender(arg0),
    );
  }
  async onMount() {}
  async onSetupCanvas() {
    await this.forceRender();
  }
}
