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

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewContainerRef
} from "@angular/core";
import {EXPLORER_OBJECT_RENDERER} from "../../../explorer";
import {
  ColumnDataType,
  ExplorerColumn,
  ExplorerRendererLoader,
  TargetData
} from "../explorer.types";
import {AbstractExplorerRendererComponent} from "./abstract-explorer-renderer.component";
import {FormGroup} from "@angular/forms";

/**
 * Similar to the ExplorerSectionRendererComponent, this component is
 * responsible for dynamically rendering objects based on the provided
 * column definition and data.
 */
@Component({
  selector: "explorer-object-renderer",
  template: "",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerObjectRendererComponent extends AbstractExplorerRendererComponent
  implements OnInit, OnChanges {

  /** The target data to be rendered for this object. */
  target = input.required<TargetData>();
  /** The column definition for the object. */
  column = input.required<ExplorerColumn>();
  /** The data to be displayed for the object. */
  data = input.required<{ [k: string]: unknown }>();
  /** The form group for managing the object's entity data. */
  override entityForm = input.required<FormGroup>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_OBJECT_RENDERER);

  /**
   * This lifecycle method is invoked when any input properties
   * change. If this is not the first change for data, it updates
   * the component with the new data.
   * @param changes - An object that contains the current and previous
   * state of input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.firstChange) {
      return;
    }
    this.patchComponentData();
  }

  /**
   * This lifecycle method is called once the component has been
   * initialized. It retrieves the renderer based on the column's
   * configuration and draws the component accordingly.
   */
  ngOnInit(): void {
    let renderer: ExplorerRendererLoader;
    const code = this.column().objectRenderer?.code; // Get the renderer code
    // Select renderer based on the column's renderer code or data type
    if (code) {
      renderer = this.getRendererByCode(code);
    } else {
      renderer = this.getRendererByDataType(this.column().type as ColumnDataType);
    }
    // Fallback to default renderer if not found
    if (!renderer) {
      console.warn(`Renderer with ${code ? `code ${code}` : `type ${this.column().type}`} is not found`);
      renderer = this.getRendererByCode("string-object-renderer");
    }
    // Merge parameters and draw the component
    const rendererParams = this.column()?.objectRenderer?.params ?? {};
    const columnRendererParams = this.column()?.objectRendererParams ?? {};
    this.mergeParamsAndDrawComponent(renderer, rendererParams, columnRendererParams);
  }

  /**
   * Retrieves the renderer corresponding to the specified code.
   * @param code - The code of the renderer to be retrieved.
   * @returns {ExplorerRendererLoader} The renderer associated with the provided code.
   */
  private getRendererByCode(code: string): ExplorerRendererLoader {
    return this.renderers.find(v => v.code === code);
  }

  /**
   * Retrieves the appropriate renderer based on the column's data type.
   * @param type - The data type of the column.
   * @returns {ExplorerRendererLoader} The renderer associated with the specified data type.
   */
  private getRendererByDataType(type: ColumnDataType): ExplorerRendererLoader {
    let code = "string-object-renderer";
    switch (type) {
    case "boolean":
      code = "boolean-object-renderer";
      break;
    case "date":
      code = "date-object-renderer";
      break;
    case "reference":
      switch (this.column().referencedEntityName) {
      case "MediaEntity":
        code = "media-object-renderer";
        break;
      case "LocalizedStringEntity":
        code = "localized-string-renderer";
        break;
      case "LocalizedMediaEntity":
        code = "localized-media-renderer";
        break;
      default:
        code = "reference-object-renderer";
        break;
      }
      break;
    }
    return this.getRendererByCode(code);
  }

}
