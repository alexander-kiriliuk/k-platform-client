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
import {LocalizePipe} from "../../../../../../../modules/locale";
import {AbstractExplorerObjectRenderer} from "../../abstract-explorer-object-renderer";
import {NumberUtils} from "../../../../../../../global/util";
import DuplicateItemToken = Explorer.DuplicateItemToken;

/**
 * This component allows for string input, which can be configured as a
 * textarea or regular input based on the provided parameters. It supports
 * read-only and disabled states.
 */
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

  /** Unique identifier for the component instance. */
  readonly id = NumberUtils.getRandomInt();
  /** Parameters for rendering the string object. */
  rendererParams: StringObjectRendererParams = {
    readonly: false,
    disabled: false,
    textarea: false,
    textareaAutoResize: true
  };
  private readonly ar = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  /**
   * Determines if the input field is read-only based on query parameters
   * and renderer parameters.
   * @returns True if the input is read-only.
   */
  get isReadonly() {
    return !this.ar.snapshot.queryParams[DuplicateItemToken] && this.rendererParams.readonly
      && this.data && this.data[this.column.property]?.toString()?.length;
  }

  /**
   * Checks if the input should be rendered as a textarea.
   * @returns True if the input should be a textarea, false otherwise.
   */
  get isTextArea() {
    return this.rendererParams.textarea || this.ctrl.value?.length > 50;
  }

  /**
   * Initializes the component by setting the initial value and configuring
   * the input based on the parameters.
   */
  ngOnInit(): void {
    // Set the control value to JSON string if it's an object
    if (this.ctrl.value && typeof this.ctrl.value === "object") {
      this.ctrl.setValue(JSON.stringify(this.ctrl.value), {emitEvent: false});
    }
    // Disable the control if it is a primary column of type "unknown"
    if (this.column.primary && this.column.type === "unknown") {
      this.ctrl.disable();
    }
    // Assign parameters to rendererParams if provided
    if (this.params) {
      Object.assign(this.rendererParams, this.params);
    }
    // Disable control if the disabled parameter is true
    if (this.rendererParams.disabled) {
      this.ctrl.disable();
    }
    // Mark for check to trigger change detection
    this.cdr.markForCheck();
  }

}
