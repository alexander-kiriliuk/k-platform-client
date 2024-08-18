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
import {DatePipe} from "@angular/common";
import {AbstractExplorerSectionRenderer} from "../../abstract-explorer-section-renderer";

/**
 * This component extends AbstractExplorerSectionRenderer specifically
 * for date types and provides rendering for date-time data.
 */
@Component({
  selector: "date-section-renderer",
  standalone: true,
  templateUrl: "./date-section-renderer.component.html",
  styleUrls: ["./date-section-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe
  ],
})
export class DateSectionRendererComponent extends AbstractExplorerSectionRenderer<string> {

  override params: { format: string };

}
