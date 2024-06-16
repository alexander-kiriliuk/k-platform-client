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

import {Observable, Subject} from "rxjs";
import {filter, map} from "rxjs/operators";
import {StoreMessage} from "./store-message";
import {StoreMessageMd} from "./store-message-md";
import {Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class Store {

  private readonly eventBus: Subject<StoreMessage>;
  private readonly separator = ":";

  constructor() {
    this.eventBus = new Subject<StoreMessage>();
  }

  emit<T = unknown>(key: string, data?: T): void {
    if (!key.trim().length) {
      throw new Error("key parameter must be a string and must not be empty");
    }
    const metadata: StoreMessageMd = new StoreMessageMd(key, data);
    this.eventBus.next({key, payload: data, metadata});
  }

  on<T = unknown>(key: string): Observable<StoreMessage<T>> {
    return this.eventBus.asObservable().pipe(
      filter((event: StoreMessage) => this.keyMatch(event.key, key)),
      map((event: StoreMessage) => event)
    ) as Observable<StoreMessage<T>>;
  }

  private keyMatch(key: string, wildcard: string): boolean {
    const w = "*";
    const ww = "**";
    const partMatch = (wl: string, k: string): boolean => {
      return wl === w || wl === k;
    };
    const sep = this.separator;
    const kArr = key.split(sep);
    const wArr = wildcard.split(sep);
    const kLen = kArr.length;
    const wLen = wArr.length;
    const max = Math.max(kLen, wLen);
    for (let i = 0; i < max; i++) {
      const cK = kArr[i];
      const cW = wArr[i];
      if (cW === ww && typeof cK !== "undefined") {
        return true;
      }
      if (!partMatch(cW, cK)) {
        return false;
      }
    }
    return true;
  }

}
