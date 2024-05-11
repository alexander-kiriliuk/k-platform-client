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
import {ExplorerActionRendererProvider} from "./explorer.types";

export function provideExplorerActionRenderers(): ExplorerActionRendererProvider[] {
  return [
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "create-media-files-section-action",
        load: import("./renderer/custom/action/media/create/create-media-action-renderer.component")
          .then(m => m.CreateMediaActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "recreate-media-files-object-action",
        load: import("./renderer/custom/action/media/recreate/re-create-media-action-renderer.component")
          .then(m => m.ReCreateMediaActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "delete-media-files-object-action",
        load: import("./renderer/custom/action/media/delete/delete-media-action-renderer.component")
          .then(m => m.DeleteMediaActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "update-media-file-object-action",
        load: import("./renderer/custom/action/media/update/update-media-file-action-renderer.component")
          .then(m => m.UpdateMediaFileActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "create-file-section-action",
        load: import("./renderer/custom/action/file/create/create-file-action-renderer.component")
          .then(m => m.CreateFileActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "delete-file-object-action",
        load: import("./renderer/custom/action/file/delete/delete-file-action-renderer.component")
          .then(m => m.DeleteFileActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "start-process-object-action",
        load: import("./renderer/custom/action/process/start/start-process-action-renderer.component")
          .then(m => m.StartProcessActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "stop-process-object-action",
        load: import("./renderer/custom/action/process/stop/stop-process-action-renderer.component")
          .then(m => m.StopProcessActionRendererComponent)
      }
    },
    {
      provide: EXPLORER_ACTION_RENDERER,
      multi: true,
      useValue: {
        code: "toggle-process-object-action",
        load: import("./renderer/custom/action/process/toggle/toggle-process-action-renderer.component")
          .then(m => m.ToggleProcessActionRendererComponent)
      }
    },
  ];
}
