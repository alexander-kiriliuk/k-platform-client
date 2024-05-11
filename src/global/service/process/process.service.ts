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
import {StringUtils} from "../../util/string.utils";
import {delay, EMPTY, expand, switchMap, timer} from "rxjs";
import {ProcessLog, ProcessUnit} from "../../types";
import {catchError} from "rxjs/operators";
import fillParams = StringUtils.fillParams;

@Injectable()
export class ProcessService {

  private readonly http = inject(HttpClient);

  start(code: string) {
    return this.http.get<void>(fillParams("/process/start/:code", code));
  }

  stop(code: string) {
    return this.http.get<void>(fillParams("/process/stop/:code", code));
  }

  toggle(code: string) {
    return this.http.get<void>(fillParams("/process/toggle/:code", code));
  }

  stats(code: string) {
    return this.http.get<ProcessUnit>(fillParams("/process/stats/:code", code));
  }

  log(id: number) {
    return this.http.get<ProcessLog>(fillParams("/process/log/:id", id));
  }

  logsPolling(id: number) {
    return this.log(id).pipe(
      catchError(() => {
        return EMPTY;
      }),
      expand(() => {
        return timer(1000).pipe(
          delay(1000),
          switchMap(() => this.log(id))
        );
      })
    );
  }

  statsPolling(code: string) {
    return this.stats(code).pipe(
      catchError(() => {
        return EMPTY;
      }),
      expand(() => {
        return timer(1000).pipe(
          delay(1000),
          switchMap(() => this.stats(code))
        );
      })
    );
  }

}
