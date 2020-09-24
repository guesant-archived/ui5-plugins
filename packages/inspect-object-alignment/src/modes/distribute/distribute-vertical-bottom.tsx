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

import { updator } from "@ui5/shared-lib/lib/template/updator";
import InspectObjectAlignment from "../..";
import { alignAsGroupFromEvent } from "../../helpers/as-group-from-event";
import { generateVerticalBottom } from "../../helpers/generate-vertical-bottom";

export const distributeVerticalBottom = (
  plugin: InspectObjectAlignment,
): React.ButtonHTMLAttributes<HTMLButtonElement> => {
  if (!plugin.editor) return {};
  const {
    template: {
      model: {
        sketch: { height },
      },
    },
  } = plugin.editor.state;
  const update = updator(plugin);
  return {
    children: "vb",
    onClick: async (e) => {
      await update(
        generateVerticalBottom(height, alignAsGroupFromEvent(plugin)(e)),
      );
    },
  };
};
