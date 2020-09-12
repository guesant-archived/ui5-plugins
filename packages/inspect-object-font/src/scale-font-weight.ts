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

type FW = number | string;
type DW = {
  [key in FW]: string;
};

export const SCALE_FONT_WEIGHT: FW[] = [
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
];

export const DISPLAY_FONT_WEIGHT = (weight: FW) =>
  (({
    "100": "Thin",
    "200": "Extra Light ",
    "300": "Light",
    "400": "Normal",
    "500": "Medium",
    "600": "Semi Bold",
    "700": "Bold",
    "800": "Extra Bold",
    "900": "Black",
  } as DW)[String(weight)] || String(weight));
