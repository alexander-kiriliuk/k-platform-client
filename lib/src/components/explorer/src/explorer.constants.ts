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

import {InjectionToken} from "@angular/core";
import {ExplorerActionRendererLoader, ExplorerRendererLoader} from "./explorer.types";

export namespace Explorer {

  export const SectionPreloaderCn = "section-cn";
  export const ObjectPreloaderCn = "object-cn";

  /**
   * Available data types for columns.
   */
  export const Types = ["string", "number", "boolean", "date", "reference", "unknown"];

  /**
   * Tokens for creating items.
   */
  export const NewItemToken = "create-new-item";

  /**
   * Tokens for duplicating items.
   */
  export const DuplicateItemToken = "duplicate";

}

/**
 * Injection token for explorer section renderers.
 */
export const EXPLORER_SECTION_RENDERER = new InjectionToken<ExplorerRendererLoader[]>(
  "Explorer section renderer collection"
);

/**
 * Injection token for explorer object renderers.
 */
export const EXPLORER_OBJECT_RENDERER = new InjectionToken<ExplorerRendererLoader[]>(
  "Explorer object renderer collection"
);

/**
 * Injection token for explorer action renderers.
 */
export const EXPLORER_ACTION_RENDERER = new InjectionToken<ExplorerActionRendererLoader[]>(
  "Explorer action renderer collection"
);
