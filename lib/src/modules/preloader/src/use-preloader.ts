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

import {Store} from "../../store/src/store";
import {PreloaderEvent} from "./preloader.event";
import {defer, Observable, tap} from "rxjs";

export function usePreloader<T>(store: Store, preloaderCn: string) {
  return (source: Observable<T>) => defer(() => {
    store.emit(PreloaderEvent.Show, preloaderCn);
    return source.pipe(
      tap({
        error: () => store.emit(PreloaderEvent.Hide, preloaderCn),
        next: () => store.emit(PreloaderEvent.Hide, preloaderCn)
      })
    );
  });
}
