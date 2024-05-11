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

import {MenuItemCommandEvent} from "primeng/api";
import {Translation} from "@ngneat/transloco";
import {LocalizedString} from "../modules/locale/locale.types";
import {Media} from "../modules/media/media.types";

export type SystemTheme = "light" | "dark";

export interface MenuCommandHandler {
  onMenuCommand: (event: MenuItemCommandEvent, id?: string) => void;
}

export type PlainObject = { [k: string]: unknown };

export type Env = {
  production: boolean;
  frontEndUrl: string;
  apiUrl: string;
  mediaUrl: string;
  fileUrl: string;
  tmpUrl: string;
}

export type AppConfig = {
  translation: Translation;
  fullDateFormat: string;
}

export interface ToastData {
  title?: string;
  message?: string;
}

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

export interface UserRole {
  code: string;
  name: LocalizedString[];
  tsCreated: Date;
}

export interface PageableParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: SortOrder;
  filter?: string;
}

export interface PageableData<T = unknown> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export type SortOrder = "ASC" | "DESC";

export type ProcessStatus = "execute" | "ready" | "crashed";

export interface ProcessUnit {
  code: string;
  status: ProcessStatus;
  enabled: boolean;
  description: LocalizedString[];
  cronTab: string;
  logs: ProcessLog[];
  tsCreated: Date;
}

export interface ProcessLog {
  id: number;
  content: string;
  tsCreated: Date;
  tsUpdated: Date;
  process: ProcessUnit;
}

export type CaptchaResponse = {
  id?: string;
  type?: string;
  image?: string;
  enabled?: boolean;
}
