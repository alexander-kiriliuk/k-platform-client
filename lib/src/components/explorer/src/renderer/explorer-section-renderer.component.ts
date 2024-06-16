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

@Component({
  selector: "explorer-section-renderer",
  template: "",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerSectionRendererComponent extends AbstractExplorerRendererComponent
  implements OnInit, OnChanges {

  target = input.required<TargetData>();
  column = input.required<ExplorerColumn>();
  data = input.required<{ [k: string]: unknown }>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_SECTION_RENDERER);

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.firstChange) {
      return;
    }
    this.patchComponentData();
  }

  ngOnInit(): void {
    let renderer: ExplorerRendererLoader;
    const code = this.column().sectionRenderer?.code;
    if (code) {
      renderer = this.getRendererByCode(code);
    } else {
      renderer = this.getRendererByDataType(this.column().type as ColumnDataType);
    }
    if (!renderer) {
      console.warn(`Renderer with ${code ? `code ${code}` : `type ${this.column().type}`} is not found`);
      renderer = this.getRendererByCode("string-section-renderer");
    }
    const rendererParams = this.column()?.sectionRenderer?.params ?? {};
    const columnRendererParams = this.column()?.sectionRendererParams ?? {};
    this.mergeParamsAndDrawComponent(renderer, rendererParams, columnRendererParams);
  }

  private getRendererByCode(code: string): ExplorerRendererLoader {
    return this.renderers.find(v => v.code === code);
  }

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
