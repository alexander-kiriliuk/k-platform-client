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

import {ChangeDetectionStrategy, Component} from "@angular/core";
import {NgClass} from "@angular/common";
import {AbstractExplorerSectionRenderer} from "../../abstract-explorer-section-renderer";

/**
 * This component extends AbstractExplorerSectionRenderer specifically
 * for boolean types and provides rendering based on boolean values.
 */
@Component({
  selector: "boolean-section-renderer",
  standalone: true,
  templateUrl: "./boolean-section-renderer.component.html",
  styleUrls: ["./boolean-section-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ],
})
export class BooleanSectionRendererComponent extends AbstractExplorerSectionRenderer {

  /**
   * Gets the CSS class name based on the boolean value of the property.
   * @returns {string} The CSS class name corresponding to the boolean value.
   */
  get cssClassName(): string {
    switch (this.data[this.column.property]) {
    case true:
      return "pi-check";
    case false:
      return "pi-times";
    }
    return "pi-ellipsis-h";
  }

}
