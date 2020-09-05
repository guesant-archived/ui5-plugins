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
import { LayerList } from "@ui5/react-user-interface/lib/LayerList";
import { LayerListItem } from "@ui5/react-user-interface/lib/LayerListItem";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { smartSelection } from "@ui5/shared-lib/lib/editor/selection/smart-selection";
import { isSelected } from "@ui5/shared-lib/lib/editor/selection/is-selected";

export default class ListObjects extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 List Objects",
      },
    };
  }
  onSetup() {}
  onMount() {
    if (this.editor) {
      this.editor.events.emit("SetEditorLeftTab", () => [
        { ui: { displayText: "Camadas" } },
        () => {
          if (!this.editor) return <React.Fragment />;
          const { editor, template } = this.editor.state;

          const updateSelection = (selectedObjects: number[]) => {
            this.editor?.onSetEditor({
              ...editor,
              selectedObjects,
            });
          };

          const _smartSelection = smartSelection(updateSelection)(
            editor.selectedObjects,
          );

          return (
            this.editor && (
              <div style={{ height: "100%" }}>
                <LayerList
                  style={{ height: "100%" }}
                  onClick={() => updateSelection([])}
                >
                  {template.model.fabricExported.objects.map((obj, idx) => (
                    <React.Fragment key={idx}>
                      <LayerListItem
                        className={
                          isSelected(editor.selectedObjects)(idx)
                            ? "active"
                            : ""
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          _smartSelection(idx)(e);
                        }}
                      >
                        {obj.type}
                      </LayerListItem>
                    </React.Fragment>
                  ))}
                </LayerList>
              </div>
            )
          );
        },
      ]);
    }
  }
}
