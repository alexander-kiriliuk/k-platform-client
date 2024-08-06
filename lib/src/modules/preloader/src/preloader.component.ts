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
import {ProgressSpinnerModule} from "primeng/progressspinner";

/**
 * PreloaderComponent is a simple Angular component that displays a loading spinner.
 * This component can be used to indicate that a process is ongoing, enhancing user experience.
 */
@Component({
  selector: "preloader",
  templateUrl: "./preloader.component.html",
  styleUrls: ["./preloader.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ProgressSpinnerModule
  ]
})
export class PreloaderComponent {
}
