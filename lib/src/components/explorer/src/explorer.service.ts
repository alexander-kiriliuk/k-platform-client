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
import {HttpClient, HttpParams} from "@angular/common/http";
import {ExplorerTarget, TargetData} from "./explorer.types";
import {StringUtils} from "../../../global/util";
import {PageableData, PageableParams} from "../../../global/vars";
import fillParams = StringUtils.fillParams;

/**
 * ExplorerService is a service for interacting with the backend explorer API.
 */
@Injectable()
export class ExplorerService {

  private readonly http = inject(HttpClient);

  /**
   * Fetches target data based on the provided target identifier and type.
   * @param target - The target identifier.
   * @param type - Optional. The type of target, either "section" or "object".
   * @returns An observable emitting the target data.
   */
  getTarget(target: string, type?: "section" | "object") {
    const params = {type};
    if (!params.type) {
      delete params.type;
    }
    return this.http.get<TargetData>(fillParams("/explorer/target/:target", target), {params: {type}});
  }

  /**
   * Fetches a list of all explorer targets.
   * @returns An observable emitting the list of explorer targets.
   */
  getTargetList() {
    return this.http.get<ExplorerTarget[]>("/explorer/target-list");
  }

  /**
   * Fetches a pageable list of sections for a given target.
   * @param target - The target identifier.
   * @param params - The pageable parameters for the request.
   * @returns An observable emitting the pageable data.
   */
  getSectionList<T = unknown>(target: string, params: PageableParams) {
    return this.http.get<PageableData<T>>(fillParams("/explorer/pageable/:target", target), {
      params: params as unknown as HttpParams
    });
  }

  /**
   * Fetches a specific entity by target and ID.
   * @param target - The target identifier.
   * @param id - The entity ID.
   * @returns An observable emitting the entity data.
   */
  getEntity<T = unknown>(target: string, id: number) {
    return this.http.get<T>(fillParams("/explorer/entity/:target", target), {
      params: {
        id
      }
    });
  }

  /**
   * Removes a specific entity by target and ID.
   * @param target - The target identifier.
   * @param id - The entity ID.
   * @returns An observable emitting the result of the deletion.
   */
  removeEntity<T = unknown>(target: string, id: number) {
    return this.http.delete<T>(fillParams("/explorer/entity/:target", target), {params: {id}});
  }

  /**
   * Saves an entity for a given target, with optional ID for updates.
   * @param entity - The entity data to save.
   * @param target - The target identifier.
   * @param id - Optional. The entity ID for updates.
   * @returns An observable emitting the saved entity data.
   */
  saveEntity<T = unknown>(entity: T, target: string, id?: number) {
    const params: { id: number } = {} as { id: number };
    if (id) {
      params.id = id;
    }
    return this.http.post<T>(fillParams("/explorer/entity/:target", target), entity, {params});
  }

  /**
   * Saves target data.
   * @param data - The target data to save.
   * @returns An observable emitting the saved target data.
   */
  saveTarget(data: ExplorerTarget) {
    return this.http.post<ExplorerTarget>("/explorer/target", data);
  }

}
