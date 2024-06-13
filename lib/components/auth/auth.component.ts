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

import {ChangeDetectionStrategy, Component, inject, OnInit, ViewChild} from "@angular/core";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {CardModule} from "primeng/card";
import {ImageModule} from "primeng/image";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@ngneat/transloco";
import {RecaptchaComponent, RecaptchaModule} from "ng-recaptcha";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {skip} from "rxjs";
import {AuthViewModel} from "./auth.view-model";
import {PreloaderComponent} from "../../modules/preloader/preloader.component";
import {PreloaderDirective} from "../../modules/preloader/preloader.directive";
import {CaptchaService} from "../../global/service/captcha/captcha.service";

@Component({
  selector: "auth",
  standalone: true,
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AuthViewModel,
    CaptchaService
  ],
  imports: [
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule,
    CardModule,
    ImageModule,
    ReactiveFormsModule,
    TranslocoPipe,
    PreloaderComponent,
    PreloaderDirective,
    RecaptchaModule
  ]
})
export class AuthComponent implements OnInit {

  @ViewChild(RecaptchaComponent) readonly recaptcha: RecaptchaComponent;
  readonly vm = inject(AuthViewModel);

  constructor() {
    toObservable(this.vm.reCaptchaResolved)
      .pipe(takeUntilDestroyed(), skip(1))
      .subscribe(result => {
        if (!result) {
          this.recaptcha.reset();
        }
      });
  }

  get captchaConfig() {
    return this.vm.captchaConfig();
  }

  ngOnInit(): void {
    this.vm.getCaptcha();
  }

}

