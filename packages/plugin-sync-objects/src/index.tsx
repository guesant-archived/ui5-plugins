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

import { UPDATE_OBJECT } from "@fantastic-images/lib/dist/model/mutations/update-object";
import { findIndexByObject } from "@ui5/shared-lib/lib/canvas/find-index-by-object";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { fabric } from "fabric";
import { Canvas, Object } from "fabric/fabric-impl";

const reactive = (canvas: Canvas) => (trigger: string, fn: any) =>
  trigger.split(" ").forEach((i) => canvas.on(i, fn));

const getTargets = (e: any): Object[] =>
  e.target._objects ? e.target._objects : e.target.group._objects;

export default class SyncObjects extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 Plugin Sync Objects",
      },
    };
  }
  onSetup() {}
  async onMount() {}
  async watchToChanges() {
    if (this.canvas && this.editor) {
      const { canvas } = this;
      const _reactive = reactive(canvas);
      const findIndexByObject_ = findIndexByObject(canvas);
      _reactive("object:modified", async (e: any) => {
        if (!this.editor) return;
        const { template } = this.editor.state;
        const target = getTargets(e);
        await this.editor.onSetTemplate(
          target
            .map(
              (obj) =>
                [
                  obj,
                  findIndexByObject_(obj) -
                    template.model.staticImages.filter(
                      ({ position }) => position === "back",
                    ).length,
                  findIndexByObject_(obj),
                ] as [Object, number, number],
            )
            .map(([object, itemIndex, canvasIndex]): [any, number, number] => {
              const { x: left, y: top } = fabric.util.transformPoint(
                new fabric.Point(object.left || 0, object.top || 0),
                (object.group as any).calcOwnMatrix(),
              );
              return [
                { ...object.toObject(), left, top },
                itemIndex,
                canvasIndex,
              ];
            })
            .reduce(
              (acc, [object, idx]) => UPDATE_OBJECT(idx, object)(acc),
              template,
            ),
        );
      });
    }
  }
  async onSetupCanvas() {
    await this.watchToChanges();
  }
}
