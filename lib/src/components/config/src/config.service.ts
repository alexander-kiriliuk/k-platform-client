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
import {ConfigItem} from "./config.types";
import {PageableData, PageableParams} from "../../../global/vars";

/**
 * Service for managing configuration properties.
 */
@Injectable()
export class ConfigService {

  private readonly http = inject(HttpClient);

  /**
   * Retrieves pageable configuration data.
   * @param params Optional pagination parameters
   * @returns Observable with pageable configuration data
   */
  pageableData(params?: PageableParams) {
    return this.http.get<PageableData<ConfigItem>>("/config", {params: params as unknown as HttpParams});
  }

  /**
   * Sets a configuration property.
   * @param body Configuration item data
   * @returns Observable with success status
   */
  setProperty(body: ConfigItem) {
    return this.http.post<boolean>("/config", body);
  }

  /**
   * Removes a configuration property by key.
   * @param key Property key
   * @returns Observable with success status
   */
  removeProperty(key: string) {
    return this.http.delete<boolean>("/config", {params: {key}});
  }

}
