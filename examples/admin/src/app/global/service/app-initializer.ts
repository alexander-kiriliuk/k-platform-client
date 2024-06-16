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

import {inject} from "@angular/core";
import {AppService} from "./app.service";
import {map} from "rxjs/operators";
import {TranslocoService} from "@ngneat/transloco";
import {PrimeNGConfig} from "primeng/api";
import {LangUtils} from "../utils/lang.utils";
import getCurrentLang = LangUtils.getCurrentLang;
import {CurrentUser} from "@k-platform/client";

export function AppInitializer(config: PrimeNGConfig, currentUser: CurrentUser) {
  const appService = inject(AppService);
  const ts = inject(TranslocoService);
  const lang = getCurrentLang();
  ts.setActiveLang(lang);
  config.ripple = true;
  ts.load(lang).subscribe(v => {
    if (v?.primeng) {
      currentUser.config.fullDateFormat = v.primeng?.format?.date?.full;
      currentUser.config.translation = v.primeng?.translation;
      if (currentUser.config.translation) {
        config.setTranslation(v.primeng.translation);
      }
    }
  });
  return () => appService.getOptions().pipe(
    map(v => {
      LangUtils.setAvailableLangs(v.langs);
      ts.setAvailableLangs(LangUtils.getAvailableLangCodes());
    })
  );
}
