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
import { InputSelect } from "@ui5/react-user-interface/lib/Form/InputSelect";
import {
  updateSelectedItems,
  fnFunction,
} from "@ui5/shared-lib/lib/template/update-selected-items";
import { sharedProperty } from "@ui5/shared-lib/lib/shared-property";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { SCALE_FONT_WEIGHT, DISPLAY_FONT_WEIGHT } from "./scale-font-weight";

interface DivProps extends React.HTMLAttributes<HTMLDivElement> {}

const Grid = ({ style, ...props }: DivProps) => (
  <div
    {...props}
    style={{
      display: "grid",
      width: "100%",
      padding: "6px",
      gridGap: "4px",
      gridTemplateColumns: "repeat(8, 1fr)",
      gridTemplateAreas: `
      "ff ff ff ff ff ff ff ff"
      "fw fw fw fw fw  .  .  ."
      `.trim(),
      ...style,
    }}
  />
);

const GridFontFamily = ({ style, ...props }: DivProps) => (
  <div {...props} style={{ gridArea: "ff", ...style }} />
);

const GridFontWeight = ({ style, ...props }: DivProps) => (
  <div {...props} style={{ gridArea: "fw", ...style }} />
);

export default class InspectObjectFont extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "Inspect Object Font",
      },
    };
  }
  onSetup() {}
  onMount() {
    this.editor?.events.emit("SetInspector", {
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
          <Grid
            children={
              <React.Fragment>
                <GridFontFamily>
                  <InputText
                    placeholder="Fonte"
                    defaultValue={sharedProperty(
                      ({ fontFamily }) => fontFamily,
                      "",
                    )(selectedObjects)}
                    onBlur={({ target: { value } }) => {
                      updateAll(() => ({
                        fontFamily: value,
                      }));
                    }}
                  />
                </GridFontFamily>
                <GridFontWeight
                  children={
                    <InputSelect
                      placeholder="Peso"
                      value={sharedProperty(
                        ({ fontWeight }) => fontWeight,
                        "",
                      )(selectedObjects)}
                      onChange={({ target: { value } }) => {
                        updateAll(() => ({ fontWeight: String(value) }));
                      }}
                      children={
                        <React.Fragment>
                          {SCALE_FONT_WEIGHT.map((i, idx) => (
                            <option key={idx} value={i}>
                              {DISPLAY_FONT_WEIGHT(i)}
                            </option>
                          ))}
                        </React.Fragment>
                      }
                    />
                  }
                />
              </React.Fragment>
            }
          />
        );
      },
    });
  }
}
