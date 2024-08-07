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
 * Enumeration of toast events.
 */
export enum ToastEvent {
  All = "toast:message:*",
  Error = "toast:message:error",
  Warn = "toast:message:warn",
  Info = "toast:message:info",
  Success = "toast:message:success",
}

/**
 * Enumeration of current user events.
 */
export enum CurrentUserEvent {
  Set = "current:user:set",
  Update = "current:user:update",
}

/**
 * Enumeration of dashboard events.
 */
export enum DashboardEvent {
  PatchHeader = "dashboard:header:patch",
  ToggleSidebar = "dashboard:sidebar:toggle",
}
