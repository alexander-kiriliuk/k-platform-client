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

import {ExplorerAction, ExplorerActionRenderer, TargetData} from "../../../../explorer";
import {FormGroup} from "@angular/forms";
import {InputSignal} from "@angular/core";

/**
 * Abstract base class for rendering actions in the explorer.
 * This class provides common properties for action renderers,
 * including the target data, action data, and form management.
 */
export abstract class AbstractExplorerActionRenderer<Data = unknown> implements ExplorerActionRenderer<Data> {
  /** The target data associated with the actions. */
  target: InputSignal<TargetData>;
  /** The data for the actions to be rendered. */
  data: InputSignal<Data | Data[]>;
  /** The form group managing the entity data associated with the actions. */
  entityForm: InputSignal<FormGroup>;
  /** The action-data to be rendered. */
  action: ExplorerAction;
}

