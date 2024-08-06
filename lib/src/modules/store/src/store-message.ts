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

import {StoreMessageMd} from "./store-message-md";

/**
 * StoreMessage interface represents a message structure used in the store.
 * It includes a key, metadata, and an optional payload for the message.
 * @template Data - The type of the data payload associated with the message.
 */
export interface StoreMessage<Data = unknown> {
  key: string;
  metadata: StoreMessageMd;
  payload?: Data;
}
