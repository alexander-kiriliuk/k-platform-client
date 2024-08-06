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

/**
 * Store is a service that implements an event bus pattern for managing
 * application state through message emission and subscription.
 */
@Injectable({providedIn: "root"})
export class Store {

  /** Subject that acts as the event bus for messages. */
  private readonly eventBus: Subject<StoreMessage>;
  /** Separator used in keys for matching purposes. */
  private readonly separator = ":";

  /**
   * Creates an instance of Store and initializes the event bus.
   */
  constructor() {
    this.eventBus = new Subject<StoreMessage>();
  }

  /**
   * Emits a message to the event bus with a specified key and optional data.
   * @param key - The key under which the message is emitted.
   * @param data - Optional data payload for the message.
   * @throws Error if the key is an empty string.
   */
  emit<T = unknown>(key: string, data?: T): void {
    if (!key.trim().length) {
      throw new Error("key parameter must be a string and must not be empty");
    }
    const metadata: StoreMessageMd = new StoreMessageMd(key, data);
    this.eventBus.next({key, payload: data, metadata});
  }

  /**
   * Subscribes to messages emitted under the specified key.
   * @param key - The key for which messages are to be subscribed.
   * @returns An observable of StoreMessage that emits messages with the matching key.
   */
  on<T = unknown>(key: string): Observable<StoreMessage<T>> {
    return this.eventBus.asObservable().pipe(
      filter((event: StoreMessage) => this.keyMatch(event.key, key)),
      map((event: StoreMessage) => event)
    ) as Observable<StoreMessage<T>>;
  }

  /**
   * Checks if a given key matches a wildcard pattern.
   * @param key - The key to be checked.
   * @param wildcard - The wildcard pattern to match against.
   * @returns A boolean indicating whether the key matches the wildcard.
   */
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
