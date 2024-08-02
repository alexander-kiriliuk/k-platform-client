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
  TargetData,
  EXPLORER_ACTION_RENDERER
} from "../../../explorer";
import {AbstractExplorerActionRenderer} from "./default/abstract-explorer-action-renderer";
import {FormGroup} from "@angular/forms";


/**
 * Component that renders actions in the explorer.
 * This component is responsible for dynamically rendering actions
 * based on the provided action definitions. It utilizes renderers
 * to display various actions associated with the target data.
 */
@Component({
  selector: "explorer-action-renderer",
  standalone: true,
  template: "",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerActionRendererComponent extends AbstractExplorerActionRenderer implements OnInit, OnChanges {

  /** The list of actions to be rendered. */
  actions = input.required<ExplorerAction[]>();
  /** The target data associated with the actions. */
  override target = input.required<TargetData>();
  /** The data associated with the actions. */
  override data = input.required<unknown | unknown[]>();
  /** The form group for managing the entity data associated with actions. */
  override entityForm = input<FormGroup>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_ACTION_RENDERER);
  /** References to the dynamically created action components. */
  private refs: ComponentRef<ExplorerActionRenderer>[] = [];

  /**
   * This lifecycle method is invoked when any input properties
   * change. It performs actions if the target has changed and updates
   * the component with the new data.
   * @param changes - An object that contains the current and previous
   * state of input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.target && !changes.target.firstChange &&
      (changes.target.previousValue.entity.target != changes.target.currentValue.entity.target)) {
      this.performActions(); // Perform actions if the target has changed
    }
    if (changes.data.firstChange) {
      return; // Skip the first change to avoid unnecessary updates
    }
    this.patchComponentData(); // Update component data
  }

  /**
   * This lifecycle method is called once the component has been
   * initialized. It invokes the method to render actions based on
   * the provided action definitions.
   */
  ngOnInit(): void {
    this.performActions();
  }

  /**
   * This method iterates over the list of actions and creates
   * corresponding components using the available renderers. It
   * cleans up any previous references before rendering new components.
   */
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

  /**
   * This method loads the specified renderer and creates an instance
   * of the action component. It appends the component to the view
   * container and initializes it with the action data.
   * @param renderer - The renderer to be used for creating the action component.
   * @param action - The action to be rendered.
   */
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

  /**
   * This method iterates over all the dynamically created components
   * and updates their data and properties based on the current state
   * of the parent component.
   */
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
