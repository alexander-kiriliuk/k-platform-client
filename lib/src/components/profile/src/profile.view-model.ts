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

import {inject, Injectable} from "@angular/core";
import {catchError} from "rxjs/operators";
import {throwError} from "rxjs";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {CreateProfileForm, Profile} from "./profile.constants";
import {ProfileService} from "./profile.service";
import {Store} from "../../../modules/store";
import {CurrentUser} from "../../../global/service";
import {ToastData, ToastEvent, User} from "../../../global/vars";
import {usePreloader} from "../../../modules/preloader/src/use-preloader";

/**
 * ViewModel for the ProfileComponent. Manages the user profile form and interaction with ProfileService.
 */
@Injectable()
export class ProfileViewModel {

  /** The form group representing the user profile. */
  readonly form = CreateProfileForm();
  private readonly ref = inject(DynamicDialogRef);
  private readonly profileService = inject(ProfileService);
  private readonly store = inject(Store);
  private readonly currentUser = inject(CurrentUser);

  /**
   * Initializes the ViewModel and patches the form with current user data.
   */
  constructor() {
    this.form.patchValue(this.currentUser.data);
  }

  /**
   * Gets the preloader channel name.
   * @returns The preloader channel name.
   */
  get preloaderChannel() {
    return Profile.PreloaderCn;
  }

  /**
   * Saves the user profile by calling the ProfileService.
   * Displays a preloader and handles errors by showing a toast message.
   */
  save() {
    this.profileService.updateUser(this.form.value as User).pipe(
      usePreloader(this.store, this.preloaderChannel),
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(res);
      })
    ).subscribe(user => {
      this.ref.close(user);
    });
  }

}
