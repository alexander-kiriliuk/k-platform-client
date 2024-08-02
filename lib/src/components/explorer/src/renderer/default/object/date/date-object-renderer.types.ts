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
 * Parameters for configuring the DateObjectRenderer component.
 * @property {number} firstDayOfWeek - The first day of the week (0-6).
 * @property {boolean} showCalendar - Indicates if the calendar should be displayed.
 * @property {boolean} showTime - Indicates if the time input should be displayed.
 * @property {boolean} showSeconds - Indicates if the seconds input should be displayed.
 * @property {boolean} readonlyInput - Indicates if the input is read-only.
 * @property {boolean} inline - Indicates if the date picker should be inline.
 * @property {string} dateFormat - The format in which the date should be displayed.
 */
export class DateObjectRendererParams {
  firstDayOfWeek: number;
  showCalendar: boolean;
  showTime: boolean;
  showSeconds: boolean;
  readonlyInput: boolean;
  inline: boolean;
  dateFormat: string;
}
