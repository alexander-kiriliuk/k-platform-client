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

import {ChangeDetectionStrategy, Component, inject, OnInit} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfigItem} from "../config.types";
import {ConfigPropertyEditor} from "./config-property-editor.constants";
import {ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import createForm = ConfigPropertyEditor.createForm;

@Component({
  selector: "config-property-editor",
  standalone: true,
  templateUrl: "./config-property-editor.component.html",
  styleUrls: ["./config-property-editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    TranslocoPipe,
    InputTextareaModule,
    ButtonModule,
    RippleModule
  ],
})
export class ConfigPropertyEditorComponent implements OnInit {

  readonly form = createForm();
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  get data() {
    return this.config.data as ConfigItem;
  }

  get isSaveBtnEnabled() {
    return this.form.valid && this.form.dirty;
  }

  get isDeleteBtnEnabled() {
    return this.form.valid && !this.form.touched && !this.form.dirty;
  }

  ngOnInit(): void {
    this.form.patchValue(this.data);
  }

  deleteProperty() {
    this.ref.close({cmd: "delete", data: this.form.value});
  }

  saveProperty() {
    this.ref.close({cmd: "save", data: this.form.value});
  }

}
