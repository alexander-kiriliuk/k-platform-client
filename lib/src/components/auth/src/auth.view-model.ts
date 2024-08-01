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

import {inject, Injectable, signal} from "@angular/core";
import {throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {ThemeUtils} from "../../../global/util";
import {CaptchaResponse, ToastData, ToastEvent} from "../../../global/vars";
import {Auth} from "./auth.constants";
import {Store} from "../../../modules/store";
import {AuthService} from "./auth.service";
import {LoginPayload} from "./auth.types";
import {AuthEvent} from "./auth.event";
import {CaptchaService} from "../../../global/service";
import {usePreloader} from "../../../modules/preloader/src/use-preloader";
import getCurrentTheme = ThemeUtils.getCurrentTheme;

/**
 * ViewModel for the authentication component. Handles Captcha interaction, login execution,
 * and form state management.
 */
@Injectable()
export class AuthViewModel {

  /** Signal indicating if ReCaptcha is resolved */
  readonly reCaptchaResolved = signal<boolean>(undefined);

  /** Signal containing Captcha configuration */
  readonly captchaConfig = signal<CaptchaResponse>(undefined);

  /** Login form object */
  readonly form = Auth.createLoginForm();

  private readonly store = inject(Store);
  private readonly authService = inject(AuthService);
  private readonly captchaService = inject(CaptchaService);

  get preloaderChannel() {
    return Auth.PreloaderCn;
  }

  get theme() {
    return getCurrentTheme();
  }

  /**
   * Checks if the current Captcha is Google ReCaptcha
   * */
  get isReCaptcha() {
    return this.captchaConfig().type === "google";
  }

  /**
   * Requests Captcha configuration and updates the form.
   * */
  getCaptcha() {
    this.captchaService.getCaptcha().pipe(
      usePreloader(this.store, this.preloaderChannel),
    ).subscribe(payload => {
      this.captchaConfig.set(payload);
      if (payload.enabled) {
        this.form.controls.captchaPayload.reset();
        this.form.controls.captchaId.setValue(payload.id);
      }
    });
  }

  /**
   * Performs user login using the form data. Handles errors and resets Captcha if necessary.
   * */
  doLogin() {
    this.authService.login(this.form.value as LoginPayload).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        if (this.isReCaptcha) {
          this.reCaptchaResolved.set(false);
          this.form.controls.captchaPayload.reset();
        } else {
          this.getCaptcha();
        }
        return throwError(res);
      })
    ).subscribe(v => {
      this.store.emit(AuthEvent.Success, v);
    });
  }

  /**
   * Handles Captcha resolved event.
   * @param payload String representing the Captcha resolution result.
   */
  onCaptchaResolved(payload: string) {
    this.form.controls.captchaPayload.setValue(payload);
    this.reCaptchaResolved.set(true);
  }

}
