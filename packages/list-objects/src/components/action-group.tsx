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
import { ActionItem } from "../types/ActionItem";
import { ActionGroup } from "../types/ActionGroup";

export const Actions = ({
  actions,
  defaultText = "Ação",
}: {
  actions: ActionGroup[];
  defaultText?: string;
}) => (
  <select
    style={{ maxHeight: "100%", height: "100%" }}
    onChange={(e) => {
      const [, fn] = actions
        .map(([, actionItems]) => actionItems)
        .flat(1)
        .find(([props]) => props.value === e.target.value) as ActionItem;
      fn && fn();
      e.preventDefault();
      e.target.value = "-1";
    }}
    defaultValue="-1"
  >
    <option disabled value="-1" children={defaultText} />
    {actions.map(([optProps, actionItems], optIdx) => (
      <optgroup key={`${optIdx}`} {...optProps}>
        {actionItems.map(([{ ...props }], actionIdx) => (
          <option key={`${optIdx}-${actionIdx}`} {...props} />
        ))}
      </optgroup>
    ))}
  </select>
);
