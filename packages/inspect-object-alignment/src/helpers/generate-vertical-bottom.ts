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

import { getBoundingRect } from "@ui5/shared-lib/lib/template/get-bounding-rect";
import { getGroupBox } from "@ui5/shared-lib/lib/template/get-group-box";
import { fnFunction } from "@ui5/shared-lib/lib/template/update-selected-items";
import { AsGroup } from "./as-group-from-event";
import { generateVerticalTop } from "./generate-vertical-top";

export const generateVerticalBottom = (
  bottom: number,
  asGroup: AsGroup = false,
): fnFunction => (fnArgs) =>
  generateVerticalTop(
    bottom -
      (getBoundingRect(fnArgs.object).boxHeight +
        (asGroup
          ? getGroupBox(fnArgs.objects).bottom -
            getBoundingRect(fnArgs.object).boxBottom
          : 0)),
  )(fnArgs);
