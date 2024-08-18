/*
 * Copyright 2023 Alexander Kiriliuk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {EXPLORER_ACTION_RENDERER} from "./explorer.constants";
import {ExplorerActionRendererLoader, ExplorerActionRendererProvider} from "./explorer.types";

/**
 * Provides an array of action renderers for the explorer.
 * Each renderer is defined with a unique code and a dynamic import for the corresponding component.
 * @param loaders - loaders for custom renderers
 * @returns {ExplorerActionRendererProvider[]} An array of action renderer providers.
 */
export function provideExplorerActionRenderers(...loaders: ExplorerActionRendererLoader[])
  : ExplorerActionRendererProvider[] {
  let _loaders: ExplorerActionRendererLoader[] = [
    {
      code: "create-media-files-section-action",
      load: import("./renderer/custom/action/media/create/create-media-action-renderer.component")
        .then(m => m.CreateMediaActionRendererComponent)
    },
    {
      code: "recreate-media-files-object-action",
      load: import("./renderer/custom/action/media/recreate/re-create-media-action-renderer.component")
        .then(m => m.ReCreateMediaActionRendererComponent)
    },
    {
      code: "delete-media-files-object-action",
      load: import("./renderer/custom/action/media/delete/delete-media-action-renderer.component")
        .then(m => m.DeleteMediaActionRendererComponent)
    },
    {
      code: "update-media-file-object-action",
      load: import("./renderer/custom/action/media/update/update-media-file-action-renderer.component")
        .then(m => m.UpdateMediaFileActionRendererComponent)
    },
    {
      code: "create-file-section-action",
      load: import("./renderer/custom/action/file/create/create-file-action-renderer.component")
        .then(m => m.CreateFileActionRendererComponent)
    },
    {
      code: "delete-file-object-action",
      load: import("./renderer/custom/action/file/delete/delete-file-action-renderer.component")
        .then(m => m.DeleteFileActionRendererComponent)
    },
    {
      code: "start-process-object-action",
      load: import("./renderer/custom/action/process/start/start-process-action-renderer.component")
        .then(m => m.StartProcessActionRendererComponent)
    },
    {
      code: "stop-process-object-action",
      load: import("./renderer/custom/action/process/stop/stop-process-action-renderer.component")
        .then(m => m.StopProcessActionRendererComponent)
    },
    {
      code: "toggle-process-object-action",
      load: import("./renderer/custom/action/process/toggle/toggle-process-action-renderer.component")
        .then(m => m.ToggleProcessActionRendererComponent)
    }
  ];
  if (loaders) {
    _loaders = _loaders.concat(loaders);
  }
  const providers: ExplorerActionRendererProvider[] = [];
  _loaders.forEach(loader => {
    providers.push({
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: loader
    });
  });
  return providers;
}
