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
import {StringUtils} from "../../../../../../../../global/util";
import fillParams = StringUtils.fillParams;
import {Observable} from "rxjs";

/**
 * This service provides methods for file deletion operations.
 */
@Injectable()
export class DeleteFileActionRendererService {

  private readonly http = inject(HttpClient);

  /**
   * Removes a file by its ID.
   * @param id - The ID of the file to remove.
   * @returns {Observable<File>} An observable representing the delete operation.
   */
  remove(id: string): Observable<File> {
    return this.http.delete<File>(fillParams("/file/:id", id));
  }

}
