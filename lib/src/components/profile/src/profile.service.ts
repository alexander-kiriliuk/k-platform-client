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
import {StringUtils} from "../../../global/util";
import {User} from "../../../global/vars";
import fillParams = StringUtils.fillParams;
import {Observable} from "rxjs";

/**
 * Service for managing user profiles.
 */
@Injectable({providedIn: "root"})
export class ProfileService {

  private readonly http = inject(HttpClient);

  /**
   * Retrieves user data by ID.
   * @param {number} [id] - The ID of the user.
   * @returns {Observable<User>} An observable containing the user data.
   */
  getUser(id?: number): Observable<User> {
    return this.http.get<User>(fillParams("/profile/:id", id));
  }

  /**
   * Updates user data.
   * @param {User} user - The user data to update.
   * @param {number} [id] - The ID of the user.
   * @returns {Observable<User>} An observable containing the updated user data.
   */
  updateUser(user: User, id?: number): Observable<User> {
    return this.http.patch<User>(fillParams("/profile/:id", id), user);
  }

  /**
   * Removes a user by ID.
   * @param {number} id - The ID of the user to remove.
   * @returns {Observable<User>} An observable for the delete operation.
   */
  removeUser(id: number): Observable<User> {
    return this.http.delete<User>(fillParams("/profile/:id", id));
  }

  /**
   * Creates a new user.
   * @param {User} user - The user data to create.
   * @returns {Observable<User>} An observable containing the created user data.
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>("/profile", user);
  }

}
