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

import {
  ExplorerColumn,
  ExplorerRenderer,
  ExplorerRendererLoader,
  TargetData
} from "../explorer.types";
import {ChangeDetectorRef, ComponentRef, InputSignal, ViewContainerRef} from "@angular/core";
import {FormGroup} from "@angular/forms";

/**
 * Abstract class that provides common functionality for renderer components.
 * This abstract class defines the required properties and methods for
 * rendering components in the explorer. It handles the merging of
 * parameters and updating of data for child components.
 */
export abstract class AbstractExplorerRendererComponent {

  /** The target data to be rendered. */
  abstract target: InputSignal<TargetData>;
  /** The column definition for the data being rendered. */
  abstract column: InputSignal<ExplorerColumn>;
  /** The data to be displayed in the component. */
  abstract data: InputSignal<{ [k: string]: unknown }>;
  /** The form group for managing entity data. */
  entityForm: InputSignal<FormGroup>;
  protected abstract viewContainer: ViewContainerRef;
  protected abstract readonly renderers: ExplorerRendererLoader[];
  /** Reference to the created component for rendering. */
  private ref: ComponentRef<ExplorerRenderer>;

  /**
   * This method assigns renderer parameters and creates an instance of
   * the renderer component, updating the view container accordingly.
   * @param renderer - The renderer loader to use for creating the component.
   * @param rendererParams - The parameters specific to the renderer.
   * @param columnRendererParams - Additional parameters from the column definition.
   */
  protected mergeParamsAndDrawComponent(
    renderer: ExplorerRendererLoader, rendererParams: object, columnRendererParams: object) {
    Object.assign(rendererParams, columnRendererParams);
    renderer.load.then(component => {
      this.ref = this.viewContainer.createComponent(component);
      const containerEl = this.viewContainer.element.nativeElement;
      containerEl.appendChild(this.ref.location.nativeElement);
      this.ref.instance.params = rendererParams;
      this.patchComponentData();
    });
  }
  /**
   * This method sets the current target, data, and form for the child
   * component and triggers change detection to ensure the UI is updated.
   */
  protected patchComponentData() {
    this.ref.instance.column = this.column();
    this.ref.instance.target = this.target();
    this.ref.instance.data = this.data();
    this.ref.instance.entityForm = this.entityForm ? this.entityForm() : undefined;
    this.ref.injector.get(ChangeDetectorRef).detectChanges();
  }

}
