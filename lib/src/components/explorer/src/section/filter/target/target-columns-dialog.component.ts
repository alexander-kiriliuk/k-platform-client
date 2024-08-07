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

import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {ExplorerColumn, TargetData} from "../../../explorer.types";
import {NgClass} from "@angular/common";
import {LocalizePipe} from "../../../../../../modules/locale";

/**
 * Component for displaying a dialog to select target columns.
 */
@Component({
  selector: "target-columns-dialog",
  standalone: true,
  templateUrl: "./target-columns-dialog.component.html",
  styleUrls: ["./target-columns-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizePipe,
    NgClass
  ]
})
export class TargetColumnsDialogComponent {

  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  /**
   * Retrieves the data passed to this dialog.
   * @returns The target data and selected column.
   */
  get data() {
    return this.config.data as { target: TargetData, selected: string };
  }

  /**
   * Sets the selected column and closes the dialog.
   * @param col The column to set.
   */
  setColumn(col: ExplorerColumn) {
    this.ref.close(col);
  }

}
