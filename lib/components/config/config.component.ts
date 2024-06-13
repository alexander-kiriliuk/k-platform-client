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
import {TranslocoPipe} from "@ngneat/transloco";
import {ConfigService} from "./config.service";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {ConfigViewModel} from "./config.view-model";

@Component({
  selector: "config",
  standalone: true,
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ConfigViewModel,
    ConfigService
  ],
  imports: [
    ButtonModule,
    LocalizePipe,
    PreloaderComponent,
    PreloaderDirective,
    RippleModule,
    SharedModule,
    TableModule,
    TranslocoPipe,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule
  ]
})
export class ConfigComponent {

  readonly vm = inject(ConfigViewModel);

  get data() {
    return this.vm.pageableData();
  }

  get scrollHeight() {
    return "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

}
