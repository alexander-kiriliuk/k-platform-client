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
import {RecaptchaComponent, RecaptchaModule} from "ng-recaptcha-2";
import {takeUntilDestroyed, toObservable} from "@angular/core/rxjs-interop";
import {skip} from "rxjs";
import {AuthViewModel} from "./auth.view-model";
import {PreloaderComponent, PreloaderDirective} from "../../../modules/preloader";
import {CaptchaService} from "../../../global/service";

/**
 * Component for user authentication. It includes a form for entering username and password,
 * as well as a Captcha mechanism for protection against automated requests. The component
 * interacts with the ViewModel and services to perform authentication and handle Captcha.
 */
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

  /** ReCaptcha component reference */
  @ViewChild(RecaptchaComponent) readonly recaptcha: RecaptchaComponent;

  /** ViewModel for interacting with data and service */
  readonly vm = inject(AuthViewModel);

  /**
   * Subscribes to the Captcha resolve event and resets it if necessary.
   */
  constructor() {
    toObservable(this.vm.reCaptchaResolved)
      .pipe(takeUntilDestroyed(), skip(1))
      .subscribe(result => {
        if (!result) {
          this.recaptcha.reset();
        }
      });
  }

  /**
   * Gets the Captcha configuration from the ViewModel.
   * @returns Captcha configuration
   */
  get captchaConfig() {
    return this.vm.captchaConfig();
  }

  /**
   * Initializes the component.
   * Requests Captcha configuration via the ViewModel.
   */
  ngOnInit(): void {
    this.vm.getCaptcha();
  }

}

