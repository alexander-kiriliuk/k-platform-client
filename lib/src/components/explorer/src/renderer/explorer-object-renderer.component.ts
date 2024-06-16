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

@Component({
  selector: "explorer-object-renderer",
  template: "",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerObjectRendererComponent extends AbstractExplorerRendererComponent
  implements OnInit, OnChanges {

  target = input.required<TargetData>();
  column = input.required<ExplorerColumn>();
  data = input.required<{ [k: string]: unknown }>();
  override entityForm = input.required<FormGroup>();
  protected viewContainer = inject(ViewContainerRef);
  protected readonly renderers = inject(EXPLORER_OBJECT_RENDERER);

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.firstChange) {
      return;
    }
    this.patchComponentData();
  }

  ngOnInit(): void {
    let renderer: ExplorerRendererLoader;
    const code = this.column().objectRenderer?.code;
    if (code) {
      renderer = this.getRendererByCode(code);
    } else {
      renderer = this.getRendererByDataType(this.column().type as ColumnDataType);
    }
    if (!renderer) {
      console.warn(`Renderer with ${code ? `code ${code}` : `type ${this.column().type}`} is not found`);
      renderer = this.getRendererByCode("string-object-renderer");
    }
    const rendererParams = this.column()?.objectRenderer?.params ?? {};
    const columnRendererParams = this.column()?.objectRendererParams ?? {};
    this.mergeParamsAndDrawComponent(renderer, rendererParams, columnRendererParams);
  }

  private getRendererByCode(code: string): ExplorerRendererLoader {
    return this.renderers.find(v => v.code === code);
  }

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
