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
import {HttpClient} from "@angular/common/http";
import {StringUtils} from "../../global/util/string.utils";
import {User} from "../../global/types";
import fillParams = StringUtils.fillParams;

@Injectable({providedIn: "root"})
export class ProfileService {

  private readonly http = inject(HttpClient);

  getUser(id?: number) {
    return this.http.get<User>(fillParams("/profile/:id", id));
  }

  updateUser(user: User, id?: number) {
    return this.http.patch<User>(fillParams("/profile/:id", id), user);
  }

  removeUser(id: number) {
    return this.http.delete<User>(fillParams("/profile/:id", id));
  }

  createUser(user: User) {
    return this.http.post<User>("/profile", user);
  }

}
