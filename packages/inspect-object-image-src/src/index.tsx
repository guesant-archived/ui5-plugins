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

export default class InspectObjectImageSRC extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Inspect Object Image SRC",
      },
    };
  }
  onSetup() {}
  async onMount() {
    await this.editor?.events.emit("SetInspector", {
      verifyCompatibility: ({ object: { type } }: any) =>
        ["image"].includes(type),
      component: () => {
        if (!this.editor) return <div />;
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
        const [canEditInputText, setCanEditInputText] = React.useState(false);
        const src = sharedProperty(({ src }) => src, "")(selectedObjects);
        return (
          <div
            style={{
              padding: "6px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <img
                style={{ objectFit: "cover", width: 18, height: 18 }}
                src={src}
              />
              <InputText
                type="text"
                readOnly={!canEditInputText}
                style={{ flex: "1 0" }}
                value={src}
                onChange={({ target: { value } }) => {
                  updateAll(() => ({ src: value }));
                }}
                onClick={(e) => {
                  if (e.altKey) {
                    setCanEditInputText(!canEditInputText);
                  }
                }}
                onBlurCapture={() => {
                  setCanEditInputText(false);
                }}
                onDoubleClick={({ target }) => {
                  (target as HTMLInputElement).select();
                }}
                onFocus={({ target }) => {
                  target.select();
                }}
              />
            </div>
            <InputText
              type="file"
              onChange={({ target }) => {
                const [file] = Array.from(target.files || []);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    updateAll(() => ({ src: reader.result as string }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        );
      },
    });
  }
}
