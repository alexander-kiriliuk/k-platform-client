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

import {EXPLORER_SECTION_RENDERER} from "./explorer.constants";
import {ExplorerRendererLoader, ExplorerRendererProvider} from "./explorer.types";

/**
 * Provides an array of section renderers for the explorer.
 * Each renderer is defined with a unique code and a dynamic import for the corresponding component.
 * @param loaders - loaders for custom renderers, will be merged with default renderers
 * @returns {ExplorerRendererProvider[]} An array of section renderer providers.
 */
export function provideExplorerSectionRenderers(...loaders: ExplorerRendererLoader[]): ExplorerRendererProvider[] {
  let _loaders: ExplorerRendererLoader[] = [
    {
      code: "string-section-renderer",
      load: import("./renderer/default/section/string/string-section-renderer.component")
        .then(m => m.StringSectionRendererComponent)
    },
    {
      code: "boolean-section-renderer",
      load: import("./renderer/default/section/boolean/boolean-section-renderer.component")
        .then(m => m.BooleanSectionRendererComponent)
    },
    {
      code: "date-section-renderer",
      load: import("./renderer/default/section/date/date-section-renderer.component")
        .then(m => m.DateSectionRendererComponent)
    },
    {
      code: "reference-section-renderer",
      load: import("./renderer/default/section/reference/reference-section-renderer.component")
        .then(m => m.ReferenceSectionRendererComponent)
    },
    {
      code: "media-section-renderer",
      load: import("./renderer/default/section/media/media-section-renderer.component")
        .then(m => m.MediaSectionRendererComponent)
    },
    {
      code: "virtual-media-column-section-renderer",
      load: import("./renderer/custom/section/virtual-media/virtual-media-section-renderer.component")
        .then(m => m.VirtualMediaSectionRendererComponent)
    }
  ];
  if (loaders) {
    _loaders = _loaders.concat(loaders);
  }
  const providers: ExplorerRendererProvider[] = [];
  _loaders.forEach(loader => {
    providers.push({
      provide: EXPLORER_SECTION_RENDERER,
      multi: true,
      useValue: loader
    });
  });
  return providers;
}
