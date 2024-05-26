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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  inject,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  ExplorerAction,
  ExplorerActionRenderer,
  ExplorerActionRendererLoader,
  TargetData
} from "../explorer.types";
import {AbstractExplorerActionRenderer} from "./default/abstract-explorer-action-renderer";
import {EXPLORER_ACTION_RENDERER} from "../explorer.constants";
import {FormGroup} from "@angular/forms";

@Component({
  selector: "explorer-action-renderer",
  standalone: true,
  template: "",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerActionRendererComponent extends AbstractExplorerActionRenderer implements OnInit, OnChanges {

  actions = input.required<ExplorerAction[]>();
  override target = input.required<TargetData>();
  override data = input.required<unknown | unknown[]>();
  override entityForm = input<FormGroup>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_ACTION_RENDERER);
  private refs: ComponentRef<ExplorerActionRenderer>[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes.target && !changes.target.firstChange &&
      (changes.target.previousValue.entity.target != changes.target.currentValue.entity.target)) {
      this.performActions();
    }
    if (changes.data.firstChange) {
      return;
    }
    this.patchComponentData();
  }

  ngOnInit(): void {
    this.performActions();
  }

  private performActions() {
    for (const ref of this.refs) {
      ref.destroy();
    }
    this.refs = [];
    for (const action of this.actions()) {
      const code = action.code;
      const renderer = this.renderers.find(v => v.code === code);
      if (!renderer) {
        console.warn(`Action renderer with code ${code} is not found`);
        continue;
      }
      this.drawComponent(renderer, action);
    }
  }

  private drawComponent(renderer: ExplorerActionRendererLoader, action: ExplorerAction) {
    renderer.load.then(component => {
      const ref = this.viewContainer.createComponent(component);
      const containerEl = this.viewContainer.element.nativeElement;
      containerEl.appendChild(ref.location.nativeElement);
      ref.instance.action = action;
      this.refs.push(ref);
      this.patchComponentData();
    });
  }

  private patchComponentData() {
    for (const ref of this.refs) {
      ref.instance.target = this.target;
      ref.instance.data = this.data;
      if (!ref.instance.entityForm) {
        ref.instance.entityForm = this.entityForm;
      } else {
        ref.instance.entityForm()?.patchValue(this.entityForm().getRawValue());
      }
      ref.injector.get(ChangeDetectorRef).detectChanges();
    }
  }

}
