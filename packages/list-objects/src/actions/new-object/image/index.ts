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

import { ADD_OBJECT } from "@fantastic-images/lib/dist/model/mutations/add-object";
import { imageFromURL } from "@fantastic-images/lib/dist/image-from-url";
import { ActionItem } from "@ui5/react-user-interface/lib/Actions";
import { fabric } from "fabric";
import { getKey } from "../../../get-key";
import ListObjects from "../../../index";

export const addImage = (plugin: ListObjects): ActionItem => [
  {
    value: getKey(Math.random()),
    children: "Image",
  },
  async () => {
    if (plugin.editor) {
      const { template } = plugin.editor.state;
      await imageFromURL({
        fabric,
      })(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDI1MCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMEgyNTBWMjUwSDBWMFoiIGZpbGw9IiNGRjAwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+",
        { left: 25, top: 25, width: 250, height: 250 },
      )
        .then((img) => img.toObject())
        .then((img) =>
          plugin.editor?.onSetTemplate(
            ADD_OBJECT({
              object: img,
            })(template),
          ),
        );
    }
  },
];
