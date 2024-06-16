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

export abstract class AbstractExplorerRendererComponent {

  abstract target: InputSignal<TargetData>;
  abstract column: InputSignal<ExplorerColumn>;
  abstract data: InputSignal<{ [k: string]: unknown }>;
  entityForm: InputSignal<FormGroup>;
  protected abstract viewContainer: ViewContainerRef;
  protected abstract readonly renderers: ExplorerRendererLoader[];
  private ref: ComponentRef<ExplorerRenderer>;

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

  protected patchComponentData() {
    this.ref.instance.column = this.column();
    this.ref.instance.target = this.target();
    this.ref.instance.data = this.data();
    this.ref.instance.entityForm = this.entityForm ? this.entityForm() : undefined;
    this.ref.injector.get(ChangeDetectorRef).detectChanges();
  }

}
