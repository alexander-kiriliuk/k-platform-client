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
import {EXPLORER_SECTION_RENDERER} from "../../../explorer";
import {
  ColumnDataType,
  ExplorerColumn,
  ExplorerRendererLoader,
  TargetData
} from "../explorer.types";
import {AbstractExplorerRendererComponent} from "./abstract-explorer-renderer.component";

/**
 * This component is responsible for dynamically rendering sections
 * based on the provided column definition and data. It uses different
 * renderers depending on the column type or specified renderer code.
 */
@Component({
  selector: "explorer-section-renderer",
  template: "",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerSectionRendererComponent extends AbstractExplorerRendererComponent
  implements OnInit, OnChanges {

  /** The target data to be rendered in this section. */
  target = input.required<TargetData>();
  /** The column definition that dictates how the data should be rendered. */
  column = input.required<ExplorerColumn>();
  /** The data to be displayed in the section. */
  data = input.required<{ [k: string]: unknown }>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_SECTION_RENDERER);

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
    const code = this.column().sectionRenderer?.code; // Get the renderer code
    // Select renderer based on the column's renderer code or data type
    if (code) {
      renderer = this.getRendererByCode(code);
    } else {
      renderer = this.getRendererByDataType(this.column().type as ColumnDataType);
    }
    // Fallback to default renderer if not found
    if (!renderer) {
      console.warn(`Renderer with ${code ? `code ${code}` : `type ${this.column().type}`} is not found`);
      renderer = this.getRendererByCode("string-section-renderer");
    }
    // Merge parameters and draw the component
    const rendererParams = this.column()?.sectionRenderer?.params ?? {};
    const columnRendererParams = this.column()?.sectionRendererParams ?? {};
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
    let code = "string-section-renderer";
    switch (type) {
    case "boolean":
      code = "boolean-section-renderer";
      break;
    case "date":
      code = "date-section-renderer";
      break;
    case "reference":
      if (this.column().referencedEntityName === "MediaEntity") {
        code = "media-section-renderer";
      } else {
        code = "reference-section-renderer";
      }
      break;
    }
    return this.getRendererByCode(code);
  }

}
