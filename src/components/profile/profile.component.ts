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
import {ButtonModule} from "primeng/button";
import {TranslocoPipe} from "@ngneat/transloco";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {InputSwitchModule} from "primeng/inputswitch";
import {CheckboxModule} from "primeng/checkbox";
import {ProfileViewModel} from "./profile.view-model";
import {LocalizePipe} from "../../modules/locale/localize.pipe";
import {MediaInputComponent} from "../../modules/media/input/media-input.component";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";

@Component({
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    ProfileViewModel,
    LocalizePipe
  ],
  imports: [
    ButtonModule,
    TranslocoPipe,
    InputTextModule,
    ReactiveFormsModule,
    PasswordModule,
    InputSwitchModule,
    CheckboxModule,
    LocalizePipe,
    MediaInputComponent,
    PreloaderComponent,
    PreloaderDirective,
  ]
})
export class ProfileComponent {

  readonly vm = inject(ProfileViewModel);
  private readonly localizePipe = inject(LocalizePipe);

  get roles() {
    const res: string[] = [];
    this.vm.form.controls.roles.value.forEach(role => {
      res.push(this.localizePipe.transform(role.name, role.code) as string);
    });
    return res;
  }

}
