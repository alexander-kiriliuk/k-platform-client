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


import {registerLocaleData} from "@angular/common";
import {Language} from "@k-platform/client";

export namespace LangUtils {

  const AvailableLangs: Language[] = [];
  export const DefaultLang = "en";

  export function setAvailableLangs(langs: Language[]) {
    langs.forEach(v => AvailableLangs.push(v));
  }

  export function getAvailableLangCodes() {
    const res: string[] = [];
    AvailableLangs.forEach(v => res.push(v.id));
    return res;
  }

  export const getAvailableLangs = () => AvailableLangs;

  const LANG_KEY = "lang_key";

  export function getCurrentLang() {
    const lang = localStorage.getItem(LANG_KEY);
    if (lang) {
      return lang;
    }
    return navigator.language.split("-")[0];
  }

  export function setLang(lang: string) {
    localStorage.setItem(LANG_KEY, lang);
  }

  export function setNgTranslation(res: { default: unknown }) {
    registerLocaleData(res.default, navigator.language);
  }

}

