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

/**
 * StoreMessageMd represents a metadata structure for messages in the store.
 * It includes an identifier, a key, and associated data for the message.
 */
export class StoreMessageMd<T = unknown> {

  /** Unique identifier for the message. */
  private readonly id: string;
  /** Key associated with the message. */
  private readonly key: string;
  /** The data payload of the message. */
  private readonly data: T | unknown;

  /**
   * Creates an instance of StoreMessageMd.
   * @param key - The key associated with the message.
   * @param data - The optional data payload for the message.
   */
  constructor(key: string, data?: T) {
    this.id = this.uuid();
    this.key = key;
    this.data = data;
  }

  /**
   * Generates a UUID for the message.
   * @returns A string representing a unique identifier.
   */
  private uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c: string) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

}

