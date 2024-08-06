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
import fillParams = StringUtils.fillParams;
import {Media} from "./media.types";
import {Observable} from "rxjs";

/**
 * MediaService provides methods for managing media content,
 * including recreating and removing media by ID.
 */
@Injectable()
export class MediaService {

  private readonly http = inject(HttpClient);

  /**
   * Sends a request to recreate a media item by its ID.
   * @param id - The ID of the media to recreate.
   * @returns {Observable<Media>}
   */
  reCreate(id: string): Observable<Media> {
    return this.http.post<Media>(fillParams("/media/recreate/:id", id), undefined);
  }

  /**
   * Sends a request to remove a media item by its ID.
   * @param id - The ID of the media to remove.
   * @returns {Observable<Media>}
   */
  remove(id: string): Observable<Media> {
    return this.http.delete<Media>(fillParams("/media/:id", id));
  }

}
