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

import { Template } from "@fantastic-images/types/src/Template";
import { ActionItem } from "@ui5/react-user-interface/lib/Actions";
import { supportsFileReaderAPI } from "../../../supportsFileReaderAPI";
import { getKey } from "../../../get-key";
import EditorHeader from "../../..";

const readAsText = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string));
    reader.addEventListener("error", reject);
    reader.readAsText(file);
  });

const parseJSON = (text: string): Promise<any> =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(JSON.parse(text));
    } catch (error) {
      reject(error);
    }
  });

export const openTemplate = (plugin: EditorHeader): ActionItem => [
  {
    value: getKey(Math.random()),
    children: "Abrir Template",
    disabled: !supportsFileReaderAPI,
  },
  async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", async () => {
      const [file] = Array.from(input.files || []);
      if (file) {
        await parseJSON(await readAsText(file))
          .then(async (template: Template) =>
            confirm(
              "Deseja otimizar sua experiência no Editor adicionando as imagens estáticas ao cache?",
            )
              ? ({
                  ...template,
                  model: {
                    ...template.model,
                    staticImages: await Promise.all(
                      template.model.staticImages.map(async (staticImage) => ({
                        ...staticImage,
                        url: (await new Promise((resolve) => {
                          resolve(
                            confirm(
                              `Adicionar ${
                                staticImage.url.length > 42
                                  ? [
                                      staticImage.url.slice(0, 24),
                                      staticImage.url.slice(-15),
                                    ].join("...")
                                  : staticImage.url
                              } ao cache?`,
                            ),
                          );
                        }))
                          ? await fetch(staticImage.url)
                              .then((res) => res.blob())
                              .then((blob) => URL.createObjectURL(blob))
                              .catch(() => staticImage.url)
                          : staticImage.url,
                      })),
                    ),
                  },
                } as Template)
              : template,
          )
          .then(async (template: Template) => {
            plugin.editor?.state.template.model.staticImages.forEach(
              ({ url }) => {
                URL.revokeObjectURL(url);
              },
            );
            await plugin.editor?.onSetTemplate(template);
            await plugin.editor?.onSetEditor({
              ...plugin.editor.state.editor,
              selectedObjects: [],
              selectedStaticImages: [],
            });
          });
      }
    });
    input.click();
  },
];
