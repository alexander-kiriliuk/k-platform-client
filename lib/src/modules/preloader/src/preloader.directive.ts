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

@Directive({
  selector: "[preloading]",
  standalone: true
})
export class PreloaderDirective implements AfterViewInit {

  ctx: InputSignal<TogglePreloader> = input({state: true} as TogglePreloader, {alias: "preloading"});
  private readonly store = inject(Store);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  constructor() {
    this.store.on<string>(PreloaderEvent.Hide)
      .pipe(
        filter(v => v.payload === this.ctx().channel),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.ctx().state = false;
        this.checkContainer();
      });
    this.store.on<string>(PreloaderEvent.Show)
      .pipe(
        filter(v => v.payload === this.ctx().channel),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.ctx().state = true;
        this.checkContainer();
      });
  }

  ngAfterViewInit(): void {
    this.checkContainer();
  }

  private checkContainer() {
    if (this.ctx().state) {
      this.viewContainer.createEmbeddedView(this.templateRef, {});
    } else {
      this.viewContainer.clear();
    }
  }

}
