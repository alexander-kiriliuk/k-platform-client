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
import {Dashboard} from "./dashboard.constants";
import {AsyncPipe, NgClass} from "@angular/common";
import {ScrollPanelModule} from "primeng/scrollpanel";
import {MenuTreeComponent} from "./menu/menu-tree.component";
import {MenuModule} from "primeng/menu";
import {AvatarModule} from "primeng/avatar";
import {TranslocoPipe} from "@ngneat/transloco";
import {DashboardViewModel} from "./dashboard.view-model";
import {
  MediaComponent,
  CurrentUser,
  PreloaderComponent,
  PreloaderDirective
} from "@k-platform/client";

@Component({
  selector: "dashboard",
  standalone: true,
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DashboardViewModel
  ],
  imports: [
    NgClass,
    ScrollPanelModule,
    MenuTreeComponent,
    PreloaderComponent,
    MenuModule,
    AvatarModule,
    MediaComponent,
    AsyncPipe,
    TranslocoPipe,
    PreloaderDirective
  ],
})
export class DashboardComponent {

  readonly vm = inject(DashboardViewModel);
  readonly currentUser = inject(CurrentUser);

  get preloaderChannel() {
    return Dashboard.MenuPreloaderCn;
  }

}
