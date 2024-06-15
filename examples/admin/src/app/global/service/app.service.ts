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
import {Category, Language} from "../../../../../../lib/src";

@Injectable({providedIn: "root"})
export class AppService {

  private readonly http = inject(HttpClient);

  getOptions() {
    return this.http.get<{ langs: Language[] }>("/app/options");
  }

  getMenu() {
    return this.http.get<Category<{ iconClass: string }>>("/app/menu");
  }

}
