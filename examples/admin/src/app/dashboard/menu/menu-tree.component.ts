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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {NgClass, NgStyle, NgTemplateOutlet} from "@angular/common";
import {MenuTreeViewModel} from "./menu-tree.view-model";
import {LocalizePipe, StopPropagationDirective} from "@k-platform/client";


@Component({
  selector: "menu-tree",
  templateUrl: "./menu-tree.component.html",
  styleUrls: ["./menu-tree.component.scss"],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("toggleNode", [
      state("collapsed", style({height: "0", overflow: "hidden", opacity: 0})),
      state("expanded", style({height: "*", overflow: "hidden", opacity: 1})),
      transition("collapsed <=> expanded", animate("400ms ease-out")),
    ]),
  ],
  providers: [
    MenuTreeViewModel
  ],
  imports: [
    NgStyle,
    NgClass,
    NgTemplateOutlet,
    LocalizePipe,
    StopPropagationDirective
  ]
})
export class MenuTreeComponent {

  readonly vm = inject(MenuTreeViewModel);

}
