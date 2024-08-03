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
import {BehaviorSubject} from "rxjs";
import {Roles, AppConfig, User, CurrentUserEvent} from "../../vars";
import {Store} from "../../../modules/store";

/**
 * Service for managing the current user state.
 */
@Injectable({providedIn: "root"})
export class CurrentUser {

  /** Subject holding the current user. */
  private readonly sub = new BehaviorSubject<User>(null);
  private readonly store = inject(Store);
  /** Observable of the current user. */
  readonly asObservable = this.sub.asObservable();
  /** Configuration for the application. */
  readonly config: AppConfig = {} as AppConfig;

  constructor() {
    this.store.on<User>(CurrentUserEvent.Set)
      .subscribe(v => this.setUser(v.payload));
    this.store.on<User>(CurrentUserEvent.Update)
      .subscribe(v => this.updateUser(v.payload));
  }

  /** Gets the current user data. */
  get data() {
    return this.sub.value;
  }

  /** Gets the full name of the current user. */
  get fullName() {
    const usr = this.sub.value;
    const result: string[] = [];
    if (usr.firstName) {
      result.push(usr.firstName);
    }
    if (usr.lastName) {
      result.push(usr.lastName);
    }
    return result.length > 1 ? result.join(" ") : usr.login;
  }

  /** Gets the initials of the current user. */
  get initials() {
    let res = "";
    const parts = this.fullName.split(" ");
    parts.forEach(str => res += str.charAt(0));
    return res.substring(0, 2);
  }

  /**
   * Checks if the current user has any of the specified roles.
   * @param roles - Array of role codes to check.
   * @returns True if the user has one of the roles, false otherwise.
   */
  hasSomeRole(...roles: string[]) {
    const usr = this.sub.value;
    if (!usr?.roles?.length) {
      return false;
    }
    if (usr.roles.find(v => v.code === Roles.ROOT)) {
      return true;
    }
    for (const role of roles) {
      if (usr.roles.find(v => v.code === role)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Sets the current user.
   * @param user - User data to set.
   */
  private setUser(user: User) {
    this.sub.next(user);
  }

  /**
   * Updates the current user with new data.
   * @param updatedUser - Partial user data to update.
   */
  private updateUser(updatedUser: Partial<User>) {
    const currentUser = this.sub.value;
    if (currentUser) {
      const newUser = {...currentUser, ...updatedUser};
      this.sub.next(newUser);
    }
  }

}
