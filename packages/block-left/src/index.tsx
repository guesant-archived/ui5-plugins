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
import { EventEmitter } from "@ui5/shared-lib/lib/EventEmitter";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import {
  VerticalTab,
  VerticalTabItem,
} from "@ui5/react-user-interface/lib/VerticalTabs";

interface MetaInfo {
  controlledIndex: number | string | any;
}

export default class EditorLeft extends EditorPlugin {
  tabs: VerticalTabItem[] = [];
  events: EventEmitter = new EventEmitter();
  controlledIndex: Record<MetaInfo["controlledIndex"], number> = {};
  selectedIndex: number = 0;
  constructor() {
    super();
    this.events.on("SetSelectedIndex", (index: number) => {
      this.selectedIndex = index;
    });
  }
  onRegisterPlugin() {
    return {
      info: {
        name: "EditorLeft Plugin",
      },
    };
  }
  onSetup() {
    this.editor?.events.on(
      "SetEditorLeftTab",
      ([{ controlledIndex }, tab]: [MetaInfo, VerticalTabItem]) => {
        const tabIndex = this.tabs.push(tab) - 1;
        !["undefined"].includes(typeof controlledIndex) &&
          (this.controlledIndex[controlledIndex] = tabIndex);
      },
    );
    this.editor?.events.on(
      "SetEditorLeftActiveTab",
      (controlledIndex: MetaInfo["controlledIndex"]) => {
        typeof this.controlledIndex[controlledIndex] !== "undefined" &&
          this.events.syncEmit(
            "SetSelectedIndex",
            this.controlledIndex[controlledIndex],
          );
      },
    );
  }
  async onMount() {
    await this.editor?.events.emit("SetEditorComponent", [
      "left",
      () => {
        const [selectedIndex, setSelectedIndex] = React.useState(
          this.selectedIndex,
        );
        this.events.on("SetSelectedIndex", (index: number) => {
          setSelectedIndex(index);
        });
        return (
          <div>
            <VerticalTab
              tabsProps={{
                selectedIndex: selectedIndex,
                onSelect: (index) => {
                  this.events.syncEmit("SetSelectedIndex", index);
                },
              }}
              tabs={this.tabs}
            />
          </div>
        );
      },
    ]);
  }
}
