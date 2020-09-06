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
