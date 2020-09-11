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
import {
  VerticalTab,
  VerticalTabItem,
} from "@ui5/react-user-interface/lib/VerticalTabs";

export default class EditorLeft extends EditorPlugin {
  tabs: VerticalTabItem[] = [];
  onRegisterPlugin() {
    return {
      info: {
        name: "EditorLeft Plugin",
      },
    };
  }
  onSetup() {
    this.editor?.events.on("SetEditorLeftTab", (tab: VerticalTabItem) => {
      this.tabs.push(tab);
    });
  }
  async onMount() {
    await this.editor?.events.emit("SetEditorComponent", [
      "left",
      () => {
        return (
          <div>
            <VerticalTab tabs={this.tabs} />
          </div>
        );
      },
    ]);
  }
}
