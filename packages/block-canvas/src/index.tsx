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

import { canvasByDom } from "@fantastic-images/core/dist/fabric/get-canvas/canvas-by-dom";
import { EditorPlugin } from "@ui5/shared-lib/lib/editor/EditorPlugin";
import { fabric } from "fabric";
import * as React from "react";

const randomID = () =>
  ["canvas", Math.random().toString().replace(".", "")].join("-");

export default class EditorCanvas extends EditorPlugin {
  canvasRef?: React.RefObject<HTMLDivElement>;
  onRegisterPlugin() {
    return {
      info: {
        name: "EditorCanvas Plugin",
      },
    };
  }
  onSetup() {}
  async setupCanvas() {
    if (this.editor && this.canvasRef?.current) {
      const { template } = this.editor.state;
      const { current: wrapper } = this.canvasRef;
      const canvas = canvasByDom({ fabric })({ document: window.document })({
        wrapper,
        id: randomID(),
      })(template);
      await new Promise((resolve) =>
        this.editor?.setState({ canvas }, resolve),
      );
      for (const plugin of this.editor.plugins) {
        plugin.setCanvas(canvas);
        await plugin.onSetupCanvas();
      }
      await this.editor.events.emit("EditorOnSetupCanvas", canvas);
    }
  }
  async onMount() {
    await this.editor?.events.emit("SetEditorComponent", [
      "canvas",
      () => {
        this.canvasRef = React.useRef<HTMLDivElement>(null);
        return (
          <div style={{ backgroundColor: "#e6e6e6" }}>
            <div ref={this.canvasRef} />
            <pre
              children={JSON.stringify(
                {
                  state: {
                    editor: this.editor?.state.editor,
                    template: "#template",
                  },
                },
                null,
                2,
              )}
            />
          </div>
        );
      },
    ]);
    await this.setupCanvas();
  }
}
