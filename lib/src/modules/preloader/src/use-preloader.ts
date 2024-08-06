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

/**
 * usePreloader is a utility function that wraps an observable with preloader control.
 * It emits show and hide events for the preloader when the observable starts and completes.
 * @param store - The store instance used to emit preloader events.
 * @param preloaderCn - The channel name associated with the preloader.
 * @returns A function that takes an observable and returns a new observable
 *          that emits preloader events when subscribed to.
 */
export function usePreloader<T>(store: Store, preloaderCn: string) {
  return (source: Observable<T>) => defer(() => {
    store.emit(PreloaderEvent.Show, preloaderCn); // Show the preloader
    return source.pipe(
      tap({
        error: () => store.emit(PreloaderEvent.Hide, preloaderCn), // Hide on error
        next: () => store.emit(PreloaderEvent.Hide, preloaderCn) // Hide after successful execution
      })
    );
  });
}
