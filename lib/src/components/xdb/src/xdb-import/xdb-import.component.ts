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
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {TranslocoPipe} from "@ngneat/transloco";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {XdbService} from "../xdb.service";
import {FileUploadModule} from "primeng/fileupload";
import {XDBImportViewModel} from "./xdb-import.view-model";
import {PreloaderComponent, PreloaderDirective} from "../../../../modules/preloader";

@Component({
  selector: "xdb-import",
  standalone: true,
  templateUrl: "./xdb-import.component.html",
  styleUrls: ["./xdb-import.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    XDBImportViewModel,
    XdbService
  ],
  imports: [
    InputTextareaModule,
    ButtonModule,
    RippleModule,
    TranslocoPipe,
    ReactiveFormsModule,
    PreloaderComponent,
    PreloaderDirective,
    FileUploadModule
  ],
})
export class XdbImportComponent {

  readonly ctrl: FormControl<string> = new FormControl("", [Validators.required]);
  readonly vm = inject(XDBImportViewModel);

  get uploadUrl() {
    return "/xdb/import-file";
  }

}
