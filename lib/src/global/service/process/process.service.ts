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
import {StringUtils} from "../../util";
import {delay, EMPTY, expand, switchMap, timer} from "rxjs";
import {ProcessLog, ProcessUnit} from "../../vars";
import {catchError} from "rxjs/operators";
import fillParams = StringUtils.fillParams;

/**
 * Service for handling process-related operations.
 */
@Injectable()
export class ProcessService {

  private readonly http = inject(HttpClient);

  /**
   * Starts a process.
   * @param code - The code of the process to start.
   * @returns An observable that completes when the process starts.
   */
  start(code: string) {
    return this.http.get<void>(fillParams("/process/start/:code", code));
  }

  /**
   * Stops a process.
   * @param code - The code of the process to stop.
   * @returns An observable that completes when the process stops.
   */
  stop(code: string) {
    return this.http.get<void>(fillParams("/process/stop/:code", code));
  }

  /**
   * Toggles a process on or off.
   * @param code - The code of the process to toggle.
   * @returns An observable that completes when the process toggles.
   */
  toggle(code: string) {
    return this.http.get<void>(fillParams("/process/toggle/:code", code));
  }

  /**
   * Retrieves statistics for a process.
   * @param code - The code of the process to retrieve statistics for.
   * @returns An observable that emits the process unit statistics.
   */
  stats(code: string) {
    return this.http.get<ProcessUnit>(fillParams("/process/stats/:code", code));
  }

  /**
   * Retrieves the log for a process.
   * @param id - The ID of the process log to retrieve.
   * @returns An observable that emits the process log.
   */
  log(id: number) {
    return this.http.get<ProcessLog>(fillParams("/process/log/:id", id));
  }

  /**
   * Polls for process logs.
   * @param id - The ID of the process log to poll.
   * @returns An observable that emits the process log periodically.
   */
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

  /**
   * Polls for process statistics.
   * @param code - The code of the process to poll.
   * @returns An observable that emits the process statistics periodically.
   */
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
