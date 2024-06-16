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
  Injector,
  OnInit,
  runInInjectionContext
} from "@angular/core";
import {NewPasswordObjectRendererParams} from "./new-password-object-renderer.types";
import {ReactiveFormsModule, Validators} from "@angular/forms";
import {PasswordModule} from "primeng/password";
import {TranslocoPipe} from "@ngneat/transloco";
import {createNewPasswordObjectRendererForm} from "./new-password-object-renderer.constants";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {LocalizePipe} from "../../../../../../../modules/locale";
import {AbstractExplorerObjectRenderer} from "../../../default/abstract-explorer-object-renderer";

@Component({
  selector: "new-password-object-renderer",
  standalone: true,
  templateUrl: "./new-password-object-renderer.component.html",
  styleUrls: ["./new-password-object-renderer.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LocalizePipe,
    PasswordModule,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
})
export class NewPasswordObjectRendererComponent
  extends AbstractExplorerObjectRenderer<string, unknown, NewPasswordObjectRendererParams> implements OnInit {

  readonly form = createNewPasswordObjectRendererForm();
  rendererParams: NewPasswordObjectRendererParams = {
    minLength: 4
  };
  private readonly injector = inject(Injector);

  ngOnInit(): void {
    if (this.params) {
      Object.assign(this.rendererParams, this.params);
    }
    this.form.controls.newPassword.setValidators(Validators.minLength(this.rendererParams.minLength));
    this.form.controls.repeatPassword.setValidators(Validators.minLength(this.rendererParams.minLength));
    this.form.updateValueAndValidity();
    runInInjectionContext(this.injector, () => {
      this.form.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        if (!this.form.valid) {
          this.ctrl.setErrors({pwdError: true});
        } else {
          this.ctrl.setErrors(undefined);
          this.ctrl.setValue(this.form.controls.newPassword.value);
        }
      });
    });
  }

}
