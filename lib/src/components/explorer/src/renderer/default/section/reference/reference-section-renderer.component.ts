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
import {AbstractExplorerSectionRenderer} from "../../abstract-explorer-section-renderer";
import {CachedExplorerService} from "../../../../cached-explorer.service";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {TargetData} from "../../../../../../explorer";
import {LocalizedString} from "../../../../../../../modules/locale";

@Component({
  selector: "reference-section-renderer",
  standalone: true,
  templateUrl: "./reference-section-renderer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CachedExplorerService],
})
export class ReferenceSectionRendererComponent extends AbstractExplorerSectionRenderer implements OnInit {

  private readonly cachedExplorerService = inject(CachedExplorerService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localizePipe = inject(LocalizePipe);
  private refTarget: TargetData;

  get value() {
    if (!this.refTarget) {
      this.checkTarget();
      return "<object>";
    }
    if (this.column.multiple) {
      const property = this.data[this.column.property] as { [p: string]: unknown }[];
      if (!property) {
        return "<null>";
      }
      const out: string[] = [];
      for (const prop of property) {
        if (Array.isArray(prop[this.refTarget.namedColumn.property])) {
          out.push(this.localizePipe.transform(
            prop[this.refTarget.namedColumn.property] as unknown as LocalizedString[],
            prop[this.refTarget.primaryColumn.property] as string
          ) as string);
        } else {
          if (this.refTarget.entity.target === "LocalizedStringEntity") {
            out.push(this.localizePipe.transform(
              property as unknown as LocalizedString[],
              prop[this.refTarget.primaryColumn.property] as string
            ) as string);
            break;
          } else {
            out.push(
              (prop[this.refTarget.namedColumn.property] || prop[this.refTarget.primaryColumn.property]) as string
            );
          }
        }
      }
      return out.join(", ");
    } else {
      const property = this.data[this.column.property] as { [p: string]: unknown };
      if (!property) {
        return "<null>";
      }
      if (Array.isArray(property[this.refTarget.namedColumn.property])) {
        return this.localizePipe.transform(
          property[this.refTarget.namedColumn.property] as unknown as LocalizedString[],
          property[this.refTarget.primaryColumn.property] as string
        ) as string;
      }
      return property[this.refTarget.namedColumn.property] || property[this.refTarget.primaryColumn.property];
    }
  }

  ngOnInit(): void {
    this.checkTarget();
  }

  private checkTarget() {
    this.cachedExplorerService.getTarget(this.column.referencedEntityName, "section").subscribe(refTarget => {
      this.refTarget = refTarget;
      this.cdr.markForCheck();
    });
  }

}
