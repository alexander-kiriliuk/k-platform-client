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

import {Env} from "@k-platform/client/global/vars";

export const environment: Env = {
  production: false,
  frontEndUrl: "http://localhost:3002",
  apiUrl: "http://localhost:3001/api/v1",
  mediaUrl: "http://localhost:3001/media",
  fileUrl: "http://localhost:3001/file",
  tmpUrl: "http://localhost:3001/tmp"
};
