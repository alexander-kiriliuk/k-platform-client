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
  AfterViewInit,
  Directive,
  inject,
  input,
  InputSignal,
  TemplateRef,
  ViewContainerRef
} from "@angular/core";
import {Store} from "../../store";
import {PreloaderEvent} from "./preloader.event";
import {filter} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {TogglePreloader} from "./preloader.types";

/**
 * PreloaderDirective that controls the visibility of a preloader based on a store's state.
 * It listens for show and hide events to manage the display of the preloader.
 */
@Directive({
  selector: "[preloading]",
  standalone: true
})
export class PreloaderDirective implements AfterViewInit {

  /** Input signal that holds the state of the preloader (visible or hidden). */
  ctx: InputSignal<TogglePreloader> = input({state: true} as TogglePreloader, {alias: "preloading"});
  private readonly store = inject(Store);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  /**
   * Initializes the directive and sets up subscriptions to the store for
   * show and hide events related to the preloader.
   */
  constructor() {
    // Subscribe to the 'Hide' event to change the preloader state to false
    this.store.on<string>(PreloaderEvent.Hide)
      .pipe(
        filter(v => v.payload === this.ctx().channel),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.ctx().state = false; // Update the state to hide the preloader
        this.checkContainer(); // Check if the container needs to be updated
      });
    // Subscribe to the 'Show' event to change the preloader state to true
    this.store.on<string>(PreloaderEvent.Show)
      .pipe(
        filter(v => v.payload === this.ctx().channel),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.ctx().state = true; // Update the state to show the preloader
        this.checkContainer(); // Check if the container needs to be updated
      });
  }

  /**
   * This lifecycle hook checks the preloader's state and updates the view accordingly.
   */
  ngAfterViewInit(): void {
    this.checkContainer();
  }

  /**
   * Checks the state of the preloader and updates the view container accordingly.
   * If the preloader state is true, it creates an embedded view; otherwise, it clears the view.
   */
  private checkContainer() {
    if (this.ctx().state) {
      this.viewContainer.createEmbeddedView(this.templateRef, {});
    } else {
      this.viewContainer.clear();
    }
  }

}
