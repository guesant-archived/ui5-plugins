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
import styled from "styled-components";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { TemplateObject } from "@fantastic-images/types";
import { getSelectedObjects } from "./libs/get-selected-objects";
import { showIfCompatible } from "./libs/show-if-compatible";

export interface Inspector {
  verifyCompatibility: ({ object }: { object: TemplateObject }) => boolean;
  component: React.ElementType;
}

export type SelectedObjects = TemplateObject[];

const AutoBorderBottom = styled.div`
  > * {
    border-bottom: 1px solid #e5e5e5;
  }
`;

const tabDesign = Symbol("design");

export default class InpectObject extends EditorPlugin {
  inspectors: Inspector[] = [];
  onRegisterPlugin() {
    return {
      info: {
        name: "InspectObject",
      },
    };
  }
  onSetup() {
    this.editor?.events.on("SetInspector", (inspector: Inspector) => {
      this.inspectors.push(inspector);
    });
  }
  async onMount() {
    if (this.editor) {
      await this.editor.events.emit("SetEditorRightTab", [
        { controlledIndex: tabDesign },
        [
          { ui: { displayText: "Design" } },
          () => {
            if (!this.editor) return <div />;
            const { template, editor } = this.editor.state;
            const selectedObjects = getSelectedObjects({ template, editor });
            return (
              this.editor && (
                <div>
                  <AutoBorderBottom>
                    {this.inspectors.map((inspector, idx) => (
                      <React.Fragment key={idx}>
                        {showIfCompatible({ selectedObjects })(inspector)()}
                      </React.Fragment>
                    ))}
                  </AutoBorderBottom>
                </div>
              )
            );
          },
        ],
      ]);
    }
  }
}
