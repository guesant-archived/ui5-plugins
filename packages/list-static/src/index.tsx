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
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { LayerList } from "@ui5/react-user-interface/lib/LayerList";
import { LayerListItem } from "@ui5/react-user-interface/lib/LayerListItem";
import { LayerListHeader } from "@ui5/react-user-interface/lib/LayerListHeader";
import { TemplateStaticImage } from "@fantastic-images/types/src/TemplateStaticImage";

const tabStatic = Symbol("static");

export default class ListStatic extends EditorPlugin {
  onRegisterPlugin() {
    return {
      info: {
        name: "UI5 List Static",
      },
    };
  }
  onSetup() {}
  async onMount() {
    if (this.editor) {
      await this.editor.events.emit("SetEditorLeftTab", [
        { controlledIndex: tabStatic },
        [
          { ui: { displayText: "Estático" } },
          () => {
            if (!this.editor) return <React.Fragment />;
            const { template } = this.editor.state;
            const {
              model: { staticImages },
            } = template;

            return (
              <div>
                <ul>
                  {([
                    ["front", "Ao topo"],
                    ["back", "Ao fundo"],
                  ] as ["front" | "back", string][]).map(
                    ([position, description], idx) => (
                      <li key={idx}>
                        <LayerListHeader>{description}</LayerListHeader>
                        <LayerList>
                          {staticImages
                            .map(
                              (i, idx) =>
                                [i, idx] as [TemplateStaticImage, number],
                            )
                            .filter(([i]) => i.position === position)
                            .map(([{ url }, idx]) => (
                              <LayerListItem tabIndex={0} key={idx}>
                                <div
                                  style={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                  }}
                                >
                                  <img
                                    src={url}
                                    style={{
                                      width: 20,
                                      height: 20,
                                    }}
                                  />
                                  <p>Imagem Estática</p>
                                </div>
                              </LayerListItem>
                            ))}
                        </LayerList>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            );
          },
        ],
      ]);
    }
  }
}
