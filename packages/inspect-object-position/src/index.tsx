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
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import {
  updateSelectedItems,
  fnFunction,
} from "@ui5/shared-lib/lib/template/update-selected-items";
import { sharedProperty } from "@ui5/shared-lib/lib/shared-property";
import { InputText } from "@ui5/react-user-interface/lib/Form/InputText";

export default class InspectObjectPosition extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Inspect Object Position",
      },
    };
  }
  onSetup() {}
  onMount() {
    this.editor?.events.emit("SetInspector", {
      verifyCompatibility: () => true,
      component: () => {
        if (!this.editor) return <React.Fragment />;
        const { template, editor } = this.editor.state;

        const selectedObjects = template.model.fabricExported.objects.filter(
          (_, idx) => editor.selectedObjects.includes(idx),
        );

        const updateAll = (fn: fnFunction) =>
          this.editor?.onSetTemplate(
            updateSelectedItems({ selectedItems: editor.selectedObjects })({
              template,
            })(fn),
          );

        const genericInput = ([key, prefix]: string[], idx?: number) => {
          const currentValue = sharedProperty(
            (obj) => obj[key],
            "",
          )(selectedObjects);
          return (
            <InputText
              {...(typeof idx === "number" ? { key: idx } : {})}
              prefix={prefix}
              defaultValue={currentValue}
              onBlur={({ target: { value } }) => {
                value !== currentValue && updateAll(() => ({ [key]: value }));
              }}
            />
          );
        };

        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 80px)",
              padding: "6px",
              gridGap: "4px",
            }}
          >
            {[
              [["left", "x"], genericInput],
              [["top", "y"], genericInput],
              [["width", "w"], genericInput],
              [["height", "h"], genericInput],
              [["angle", "a"], genericInput],
            ].map(([args, handler]: any, idx) => handler(args, idx))}
          </div>
        );
      },
    });
  }
}
