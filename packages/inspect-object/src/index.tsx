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
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { TemplateObject } from "@fantastic-images/types";

export interface Inspector {
  verifyCompatibility: ({ object }: { object: TemplateObject }) => boolean;
  component: React.ElementType;
}

export default class InpectObject extends EditorPlugin {
  inspectors: Inspector[] = [];
  onRegisterPlugin() {
    return {
      info: {
        name: "InspectObject",
      },
    };
  }
  onSetup() {
    this.editor?.events.on("SetInspector", (inspector: Inspector) => {
      this.inspectors.push(inspector);
    });
  }
  onMount() {}
}
