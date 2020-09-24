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

import REMOVE_OBJECT from "@fantastic-images/lib/dist/model/mutations/remove-object";
import { Actions } from "@ui5/react-user-interface/lib/Actions";
import { LayerList } from "@ui5/react-user-interface/lib/LayerList";
import { LayerListItem } from "@ui5/react-user-interface/lib/LayerListItem";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { isSelected } from "@ui5/shared-lib/lib/editor/selection/is-selected";
import { smartSelection } from "@ui5/shared-lib/lib/editor/selection/smart-selection";
import * as React from "react";
import { actions } from "./actions";

const tabCamadas = Symbol("camadas");

export default class ListObjects extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 List Objects",
      },
    };
  }
  onSetup() {}
  async onMount() {
    if (this.editor) {
      await this.editor.events.emit("SetEditorLeftTab", [
        { controlledIndex: tabCamadas },
        [
          { ui: { displayText: "Camadas" } },
          () => {
            if (!this.editor) return <div />;
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
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      paddingLeft: "6px",
                      paddingRight: "6px",
                      marginBottom: "2px",
                    }}
                  >
                    <Actions actions={actions(this)} />
                  </div>
                  <LayerList
                    style={{ flex: 1 }}
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
                          <div
                            style={{
                              width: "100%",
                              gridGap: 6,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{obj.type}</span>
                            <button
                              style={{ marginLeft: "auto" }}
                              onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                await this.editor?.onSetTemplate(
                                  REMOVE_OBJECT({ idx: [idx] })(template),
                                );
                                await this.editor?.onSetEditor({
                                  ...editor,
                                  selectedObjects: editor.selectedObjects
                                    .filter((i) => ![idx].includes(i))
                                    .map((i) =>
                                      i > idx ? i - [idx].length : i,
                                    ),
                                });
                              }}
                              children={"x"}
                            />
                          </div>
                        </LayerListItem>
                      </React.Fragment>
                    ))}
                  </LayerList>
                </div>
              )
            );
          },
        ],
      ]);
    }
  }
}
