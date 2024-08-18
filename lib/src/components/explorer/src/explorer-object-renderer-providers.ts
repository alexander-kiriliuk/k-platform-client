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

import {ExplorerRendererLoader, ExplorerRendererProvider} from "./explorer.types";
import {EXPLORER_OBJECT_RENDERER} from "./explorer.constants";

/**
 * Provides an array of object renderers for the explorer.
 * Each renderer is defined with a unique code and a dynamic import for the corresponding component.
 * @param loaders - loaders for custom renderers
 * @returns {ExplorerRendererProvider[]} An array of object renderer providers.
 */
export function provideExplorerObjectRenderers(...loaders: ExplorerRendererLoader[]): ExplorerRendererProvider[] {
  let _loaders: ExplorerRendererLoader[] = [
    {
      code: "string-object-renderer",
      load: import("./renderer/default/object/string/string-object-renderer.component")
        .then(m => m.StringObjectRendererComponent)
    },
    {
      code: "boolean-object-renderer",
      load: import("./renderer/default/object/boolean/boolean-object-renderer.component")
        .then(m => m.BooleanObjectRendererComponent)
    },
    {
      code: "date-object-renderer",
      load: import("./renderer/default/object/date/date-object-renderer.component")
        .then(m => m.DateObjectRendererComponent)
    },
    {
      code: "reference-object-renderer",
      load: import("./renderer/default/object/reference/reference-object-renderer.component")
        .then(m => m.ReferenceObjectRendererComponent)
    },
    {
      code: "media-object-renderer",
      load: import("./renderer/default/object/media/media-object-renderer.component")
        .then(m => m.MediaObjectRendererComponent)
    },
    {
      code: "localized-string-renderer",
      load: import("./renderer/default/object/localized-string/localized-string-object-renderer.component")
        .then(m => m.LocalizedStringObjectRendererComponent)
    },
    {
      code: "localized-media-renderer",
      load: import("./renderer/default/object/localized-media/localized-media-object-renderer.component")
        .then(m => m.LocalizedMediaObjectRendererComponent)
    },
    {
      code: "images-stats-media-object-renderer",
      load: import("./renderer/custom/object/images-stats/images-stats-media-object-renderer.component")
        .then(m => m.ImagesStatsMediaObjectRendererComponent)
    },
    {
      code: "file-stat-object-renderer",
      load: import("./renderer/custom/object/file-stat/file-stat-media-object-renderer.component")
        .then(m => m.FileStatMediaObjectRendererComponent)
    },
    {
      code: "new-password-object-renderer",
      load: import("./renderer/custom/object/new-password/new-password-object-renderer.component")
        .then(m => m.NewPasswordObjectRendererComponent)
    },
    {
      code: "process-stats-object-renderer",
      load: import("./renderer/custom/object/process/stats/process-stats-object-renderer.component")
        .then(m => m.ProcessStatsObjectRendererComponent)
    },
    {
      code: "file-metadata-object-renderer",
      load: import("./renderer/custom/object/file-metadata/file-metadata-object-renderer.component")
        .then(m => m.FileMetadataObjectRendererComponent)
    }
  ];
  if (loaders) {
    _loaders = _loaders.concat(loaders);
  }
  const providers: ExplorerRendererProvider[] = [];
  _loaders.forEach(loader => {
    providers.push({
      provide: EXPLORER_OBJECT_RENDERER,
      multi: true,
      useValue: loader
    });
  });
  return providers;
}

