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

import { REMOVE_OBJECT } from "@fantastic-images/lib/dist/model/mutations/remove-object";
import { ActionItem } from "@ui5/react-user-interface/lib/Actions";
import ListObjects from "../../..";
import { getKey } from "../../../get-key";

export const removeSelected = (plugin: ListObjects): ActionItem => [
  {
    value: getKey(Math.random()),
    children: "Remover objetos selecionados",
  },
  async () => {
    if (plugin.editor) {
      const { editor, template } = plugin.editor.state;
      const { selectedObjects } = editor;

      await plugin.editor.onSetTemplate(
        REMOVE_OBJECT({ idx: selectedObjects })(template),
      );
      await plugin.editor.onSetEditor({
        ...editor,
        selectedObjects: [],
      });
    }
  },
];
