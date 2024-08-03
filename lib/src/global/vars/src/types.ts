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

import {Translation} from "@ngneat/transloco";
import {LocalizedString} from "../../../modules/locale";
import {Media} from "../../../modules/media";

/**
 * Type representing system themes.
 */
export type SystemTheme = "light" | "dark";

/**
 * Type representing a plain object.
 */
export type PlainObject = { [k: string]: unknown };

/**
 * Type representing the application environment configuration.
 */
export type Env = {
  production: boolean;
  frontEndUrl: string;
  apiUrl: string;
  mediaUrl: string;
  fileUrl: string;
  tmpUrl: string;
}

/**
 * Type representing the application configuration.
 */
export type AppConfig = {
  translation: Translation;
  fullDateFormat: string;
}

/**
 * Interface for toast data.
 */
export interface ToastData {
  title?: string;
  message?: string;
}

/**
 * Interface representing a category.
 * @template Params - Type of the category parameters.
 */
export interface Category<Params = unknown> {
  id: number;
  code: string;
  url: string;
  name: LocalizedString[];
  params: Params;
  icon: Media;
  parent: Category<Params>;
  children: Category<Params>[];
}

/**
 * Interface representing a user.
 */
export interface User {
  id: string;
  avatar: Media;
  password: string;
  login: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  active: boolean;
  roles: UserRole[];
  tsCreated?: Date;
}

/**
 * Interface representing a user role.
 */
export interface UserRole {
  code: string;
  name: LocalizedString[];
  tsCreated: Date;
}

/**
 * Interface for pageable parameters.
 */
export interface PageableParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: SortOrder;
  filter?: string;
}

/**
 * Interface for pageable data.
 * @template T - Type of the items in the pageable data.
 */
export interface PageableData<T = unknown> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Type representing sort order.
 */
export type SortOrder = "ASC" | "DESC";

/**
 * Type representing process status.
 */
export type ProcessStatus = "execute" | "ready" | "crashed";

/**
 * Interface representing a process unit.
 */
export interface ProcessUnit {
  code: string;
  status: ProcessStatus;
  enabled: boolean;
  description: LocalizedString[];
  cronTab: string;
  logs: ProcessLog[];
  tsCreated: Date;
}

/**
 * Interface representing a process log.
 */
export interface ProcessLog {
  id: number;
  content: string;
  tsCreated: Date;
  tsUpdated: Date;
  process: ProcessUnit;
}

/**
 * Type representing CAPTCHA response.
 */
export type CaptchaResponse = {
  id?: string;
  type?: string;
  image?: string;
  enabled?: boolean;
}
