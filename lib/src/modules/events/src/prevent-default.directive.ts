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

import {Directive, HostListener} from "@angular/core";

/**
 * Directive to prevent the default action of click events.
 */
@Directive({
  selector: "[prevent-default]",
  standalone: true
})
export class PreventDefaultDirective {

  /** Listens to click events and prevents their default action. */
  @HostListener("click", ["$event"])
  onClick(e: Event): void {
    e.preventDefault();
  }

}
