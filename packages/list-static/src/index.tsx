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

import { ADD_STATIC_IMAGE } from "@fantastic-images/lib/dist/model/mutations/add-static-image";
import { REMOVE_STATIC_IMAGE } from "@fantastic-images/lib/dist/model/mutations/remove-static-image";
import { TemplateStaticImage } from "@fantastic-images/types/src/TemplateStaticImage";
import { LayerList } from "@ui5/react-user-interface/lib/LayerList";
import { LayerListHeader } from "@ui5/react-user-interface/lib/LayerListHeader";
import { LayerListItem } from "@ui5/react-user-interface/lib/LayerListItem";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import * as React from "react";
import { readAsBase64 } from "./read-as-base-64";
import { supportsFileReaderAPI } from "./supportsFileReaderAPI";

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
            if (!this.editor) return <div />;
            const { template } = this.editor.state;
            const {
              model: { staticImages },
            } = template;
            const removeStatic = async (idxArr: number[]) => {
              await this.editor?.onSetTemplate(
                REMOVE_STATIC_IMAGE({ idx: idxArr })(template),
              );
            };
            const loadImage = async (position: "front" | "back") => {
              if (!supportsFileReaderAPI) return;
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.addEventListener("change", async () => {
                this.editor?.onSetTemplate(
                  ADD_STATIC_IMAGE({
                    staticImages: (
                      await Promise.all(
                        Array.from(input.files || []).map(readAsBase64),
                      )
                    ).map((url: string) => ({ url, position })),
                  })(template),
                );
              });
              input.click();
            };
            return (
              <div>
                <ul>
                  {([
                    ["front", "Ao topo", "Adicionar imagem"],
                    ["back", "Ao fundo", "Adicionar imagem"],
                  ] as ["front" | "back", string, string][]).map(
                    ([position, description, addtext], idx) => (
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
                              <LayerListItem key={idx}>
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
                                  <button
                                    style={{ marginLeft: "auto" }}
                                    onClick={async () =>
                                      await removeStatic([idx])
                                    }
                                    children={"x"}
                                  />
                                </div>
                              </LayerListItem>
                            ))}
                          <LayerListItem className="no-border">
                            <button
                              tabIndex={0}
                              onClick={() => loadImage(position)}
                              disabled={!supportsFileReaderAPI}
                            >
                              {[
                                ...(supportsFileReaderAPI
                                  ? [addtext]
                                  : ["Please update your browser."]),
                              ].join(" ")}
                            </button>
                          </LayerListItem>
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
