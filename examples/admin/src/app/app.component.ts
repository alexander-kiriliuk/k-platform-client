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
import {RouterOutlet} from "@angular/router";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ToastModule} from "primeng/toast";
import {AppViewModel} from "./app.view-model";
import {ToastKey} from "@k-platform/client";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProgressSpinnerModule,
    ToastModule,
    RouterOutlet
  ],
  providers: [AppViewModel]
})
export class AppComponent implements OnInit {

  readonly toastKey = ToastKey.Global;
  readonly vm = inject(AppViewModel);

  ngOnInit(): void {
    this.vm.checkProfile();
  }

}

