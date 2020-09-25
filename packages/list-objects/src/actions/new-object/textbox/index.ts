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
import { ActionItem } from "@ui5/react-user-interface/lib/Actions";
import { fabric } from "fabric";
import { getKey } from "../../../get-key";
import ListObjects from "../../../index";

export const addTextBox = (plugin: ListObjects): ActionItem => [
  {
    value: getKey(Math.random()),
    children: "TextBox",
  },
  async () => {
    if (plugin.editor) {
      const { template } = plugin.editor.state;
      await plugin.editor.onSetTemplate(
        ADD_OBJECT({
          object: new fabric.Textbox("TextBox", {
            left: 10,
            top: 10,
          }).toObject(),
        })(template),
      );
    }
  },
];
