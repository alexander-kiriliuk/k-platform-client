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

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {StringObjectRendererParams} from "./string-object-renderer.types";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ActivatedRoute} from "@angular/router";
import {Explorer} from "../../../../explorer.constants";
import {LocalizePipe} from "../../../../../../modules/locale/localize.pipe";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {NumberUtils} from "../../../../../../global/util/number.utils";
import DuplicateItemToken = Explorer.DuplicateItemToken;

@Component({
  selector: "string-object-renderer",
  standalone: true,
  templateUrl: "./string-object-renderer.component.html",
  styleUrls: ["./string-object-renderer.component.scss"],
  imports: [
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    LocalizePipe,
    InputTextareaModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringObjectRendererComponent extends AbstractExplorerObjectRenderer<{ [k: string]: unknown }>
  implements OnInit {

  readonly id = NumberUtils.getRandomInt();
  rendererParams: StringObjectRendererParams = {
    readonly: false,
    disabled: false,
    textarea: false,
    textareaAutoResize: true
  };
  private readonly ar = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  get isReadonly() {
    return !this.ar.snapshot.queryParams[DuplicateItemToken] && this.rendererParams.readonly
      && this.data && this.data[this.column.property]?.toString()?.length;
  }

  get isTextArea() {
    return this.rendererParams.textarea || this.ctrl.value?.length > 50;
  }

  ngOnInit(): void {
    if (this.ctrl.value && typeof this.ctrl.value === "object") {
      this.ctrl.setValue(JSON.stringify(this.ctrl.value), {emitEvent: false});
    }
    if (this.column.primary && this.column.type === "unknown") {
      this.ctrl.disable();
    }
    if (this.params) {
      Object.assign(this.rendererParams, this.params);
    }
    if (this.rendererParams.disabled) {
      this.ctrl.disable();
    }
    this.cdr.markForCheck();
  }

}
