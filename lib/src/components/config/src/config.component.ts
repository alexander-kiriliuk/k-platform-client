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
import {LocalizePipe} from "../../../modules/locale";
import {PreloaderComponent, PreloaderDirective} from "../../../modules/preloader";
import {ConfigViewModel} from "./config.view-model";

/**
 * Component for managing configuration properties. It provides a table view for the configuration items,
 * allows searching, editing, and deleting properties. The component interacts with the ViewModel and service
 * to perform these operations and handle pagination.
 */
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

  /** ViewModel for interacting with data and service */
  readonly vm = inject(ConfigViewModel);

  /**
   * Gets the pageable data from the ViewModel.
   * @returns Pageable data
   */
  get data() {
    return this.vm.pageableData();
  }

  /**
   * Gets the calculated scroll height for the table.
   * @returns Scroll height string
   */
  get scrollHeight() {
    return "calc(100vh - var(--header-bar-h) - var(--paginator-h))";
  }

}
