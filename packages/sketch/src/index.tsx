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

import { InputText } from "@ui5/react-user-interface/lib/Form/InputText";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import * as React from "react";

const tabSketch = Symbol("sketch");

export default class Sketch extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Sketch Plugin",
      },
    };
  }
  onSetup() {}
  async onMount() {
    if (this.editor) {
      await this.editor.events.emit("SetEditorRightTab", [
        { controlledIndex: tabSketch },
        [
          { ui: { displayText: "Sketch" } },
          () => {
            if (!this.editor) return <div />;
            const { template } = this.editor.state;
            const {
              template: {
                model: {
                  sketch: { width, height },
                },
              },
            } = this.editor.state;
            return (
              this.editor && (
                <div
                  style={{ padding: 6 }}
                  children={
                    <>
                      <div
                        style={{
                          display: "grid",
                          gap: 4,
                          gridTemplateColumns: "repeat(2, 80px)",
                        }}
                        children={
                          <>
                            <InputText
                              prefix="w"
                              value={width}
                              onChange={({ target: { value } }) => {
                                this.editor?.onSetTemplate({
                                  ...template,
                                  model: {
                                    ...template.model,
                                    sketch: {
                                      ...template.model.sketch,
                                      width: +value,
                                    },
                                  },
                                });
                              }}
                            />
                            <InputText
                              prefix="h"
                              value={height}
                              onChange={({ target: { value } }) => {
                                this.editor?.onSetTemplate({
                                  ...template,
                                  model: {
                                    ...template.model,
                                    sketch: {
                                      ...template.model.sketch,
                                      height: +value,
                                    },
                                  },
                                });
                              }}
                            />
                          </>
                        }
                      />
                    </>
                  }
                />
              )
            );
          },
        ],
      ]);
    }
  }
}
