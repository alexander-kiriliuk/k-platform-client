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

  const THEME_KEY = "theme_key";
  const THEME_ID = "app-theme-lnk";

  export function getCurrentTheme(): SystemTheme {
    const currTheme = localStorage.getItem(THEME_KEY) as SystemTheme;
    if (currTheme) {
      return currTheme;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  export function setDefaultTheme() {
    const theme = getCurrentTheme();
    const savedTheme = localStorage.getItem(THEME_KEY) as SystemTheme;
    setTheme(savedTheme ? savedTheme : theme);
  }

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
