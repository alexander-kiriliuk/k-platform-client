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
import {ExplorerService} from "./explorer.service";
import {BehaviorSubject, finalize, Observable, of, shareReplay, tap} from "rxjs";
import {TargetData} from "./explorer.types";
import {RefInput} from "../../../modules/ref-input";

@Injectable()
export class CachedExplorerService {

  private static readonly cache = new Map<string, RefInput.Cache>();
  private readonly explorerService = inject(ExplorerService);

  getTarget(target: string, type: "section" | "object"): Observable<TargetData> {
    const cacheKey = `target:${target}:${type}`;
    if (!CachedExplorerService.cache.has(cacheKey)) {
      const data$ = new BehaviorSubject<TargetData>(null);
      const request = this.explorerService.getTarget(target, type).pipe(
        tap(data => data$.next(data)),
        shareReplay(1),
        finalize(() => {
          const cached = CachedExplorerService.cache.get(cacheKey);
          if (cached) {
            cached.data$.complete();
          }
        })
      );
      CachedExplorerService.cache.set(cacheKey, {data$, request});
      return request;
    } else {
      const cached = CachedExplorerService.cache.get(cacheKey)!;
      if (cached.data$.closed) {
        return of(cached.data$.value);
      } else {
        return cached.request;
      }
    }
  }

}
