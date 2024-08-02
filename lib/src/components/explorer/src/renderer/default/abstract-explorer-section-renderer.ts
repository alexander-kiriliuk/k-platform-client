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


import {ExplorerColumn, ExplorerRenderer, TargetData} from "../../../../explorer";

/**
 * Abstract base class for rendering sections in the explorer.
 *
 * This class provides common properties for section renderers, such as
 * column definitions, rendering parameters, data to be displayed, and
 * the target data reference. It acts as a blueprint for specific
 * section renderer implementations.
 */
export abstract class AbstractExplorerSectionRenderer<T = unknown> implements ExplorerRenderer {
  /** The column definition used to configure the rendering of the section. */
  column: ExplorerColumn;
  /** Parameters that customize the behavior or appearance of the renderer. */
  params: unknown;
  /** The data to be displayed in the section */
  data: { [p: string]: T };
  /** The target data reference associated with this renderer. */
  target: TargetData;
}
