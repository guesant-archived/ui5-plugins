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

import * as React from "react";
import { InputText } from "@ui5/react-user-interface/lib/Form/InputText";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import {
  updateSelectedItems,
  fnFunction,
} from "@ui5/shared-lib/lib/template/update-selected-items";
import { sharedProperty } from "@ui5/shared-lib/lib/shared-property";

export default class InspectObjectFill extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Inspect Object Fill",
      },
    };
  }
  onSetup() {}
  async onMount() {
    await this.editor?.events.emit("SetInspector", {
      verifyCompatibility: ({ object: { type } }: any) =>
        ["textbox"].includes(type),
      component: () => {
        if (!this.editor) return <React.Fragment />;

        const { template, editor } = this.editor.state;
        const selectedObjects = template.model.fabricExported.objects.filter(
          (_, idx) => editor.selectedObjects.includes(idx),
        );

        const updateAll = (fn: fnFunction) => {
          this.editor?.onSetTemplate(
            updateSelectedItems({ selectedItems: editor.selectedObjects })({
              template,
            })(fn),
          );
        };

        return (
          <div style={{ padding: "6px" }}>
            <InputText
              type="color"
              rightPreview={true}
              value={sharedProperty(({ fill }) => fill, "")(selectedObjects)}
              onChange={({ target: { value } }) => {
                updateAll(() => ({ fill: value }));
              }}
            />
          </div>
        );
      },
    });
  }
}
