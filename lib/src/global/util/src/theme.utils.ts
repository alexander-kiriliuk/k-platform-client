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

import {SystemTheme} from "../../vars";

export namespace ThemeUtils {

  /** LS store key for theme variant. */
  const THEME_KEY = "theme_key";
  /** Link ID for theme variant. */
  const THEME_ID = "app-theme-lnk";

  /**
   * Gets the current theme from local storage or system preferences.
   * @returns The current theme.
   */
  export function getCurrentTheme(): SystemTheme {
    const currTheme = localStorage.getItem(THEME_KEY) as SystemTheme;
    if (currTheme) {
      return currTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  /**
   * Sets the default theme based on local storage or system preferences.
   */
  export function setDefaultTheme() {
    const theme = getCurrentTheme();
    const savedTheme = localStorage.getItem(THEME_KEY) as SystemTheme;
    setTheme(savedTheme ? savedTheme : theme);
  }

  /**
   * Sets the theme and updates the document link element.
   * @param theme - The theme to set.
   */
  export function setTheme(theme: SystemTheme) {
    const currentLink = document.getElementById(THEME_ID);
    if (currentLink) {
      currentLink.remove();
    }
    const link = document.createElement("link");
    link.id = THEME_ID;
    link.type = "text/css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    link.href = `assets/styles/theme-${theme}.css`;
    localStorage.setItem(THEME_KEY, theme);
  }

}
