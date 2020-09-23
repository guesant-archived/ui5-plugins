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
import InspectObjectAlignment from "../..";
import { Grid, GridButton } from "../../components/grid";
import { alignHorizontalCenter } from "./align-horizontal-center";
import { alignHorizonalLeft } from "./align-horizontal-left";
import { alignHorizontalRight } from "./align-horizontal-right";
import { alignVerticalTop } from "./align-vertical-top";

export const align = (plugin: InspectObjectAlignment) => () => {
  if (!plugin.editor) return <div />;
  const modifiers: React.ButtonHTMLAttributes<HTMLButtonElement>[] = [
    alignHorizonalLeft(plugin),
    alignHorizontalCenter(plugin),
    alignHorizontalRight(plugin),
    alignVerticalTop(plugin),
  ];
  return (
    <Grid
      children={
        <React.Fragment>
          {modifiers.map((modf, idx) =>
            React.createElement(
              React.Fragment,
              { key: idx },
              React.createElement(GridButton, { ...modf }),
            ),
          )}
        </React.Fragment>
      }
    />
  );
};
