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

import {InjectionToken} from "@angular/core";

/**
 * Enumeration of toast keys.
 */
export enum ToastKey {
  Global = "global"
}

/**
 * Enumeration of toast types.
 */
export enum ToastType {
  Error  = "error",
  Warn  = "warn",
  Info  = "info",
  Success  = "success",
}

/**
 * Class representing default user roles codes.
 */
export class Roles {
  static readonly ROOT = "root";
  static readonly ADMIN = "admin";
  static readonly MANAGER = "manager";
}

/** Injection token for the API URL.*/
export const API_URL = new InjectionToken<string>("Path to backend server");
/** Injection token for the front-end URL.*/
export const FRONT_END_URL = new InjectionToken<string>("Path to front end server");
/** Injection token for the media storage URL.*/
export const MEDIA_URL = new InjectionToken<string>("Path to medias storage");
/** Injection token for the file storage URL.*/
export const FILE_URL = new InjectionToken<string>("Path to files storage");
/** Injection token for the temporary files storage URL.*/
export const TMP_URL = new InjectionToken<string>("Path to tmp-files storage");
/** Injection token for the WebP media format support flag.*/
export const WEBP_SUPPORT = new InjectionToken<boolean>("WEBP media format support flag");
