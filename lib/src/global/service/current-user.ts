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
import {AppConfig, User} from "../types";
import {CurrentUserEvent} from "../events";
import {Roles} from "../constants";
import {Store} from "../../modules/store/store";
import {LocalizePipe} from "../../modules/locale/localize.pipe";

@Injectable({providedIn: "root"})
export class CurrentUser {

  private readonly sub = new BehaviorSubject<User>(null);
  private readonly store = inject(Store);
  private readonly localizePipe = inject(LocalizePipe);
  readonly asObservable = this.sub.asObservable();
  readonly config: AppConfig = {} as AppConfig;

  constructor() {
    this.store.on<User>(CurrentUserEvent.Set)
      .subscribe(v => this.setUser(v.payload));
    this.store.on<User>(CurrentUserEvent.Update)
      .subscribe(v => this.updateUser(v.payload));
  }

  get data() {
    return this.sub.value;
  }

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

  get initials() {
    let res = "";
    const parts = this.fullName.split(" ");
    parts.forEach(str => res += str.charAt(0));
    return res.substring(0, 2);
  }

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

  private setUser(user: User) {
    this.sub.next(user);
  }

  private updateUser(updatedUser: Partial<User>) {
    const currentUser = this.sub.value;
    if (currentUser) {
      const newUser = {...currentUser, ...updatedUser};
      this.sub.next(newUser);
    }
  }

}
