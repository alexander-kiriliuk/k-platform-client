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

import {MenuItem} from "primeng/api";
import {TranslocoService} from "@ngneat/transloco";
import {MenuCommandHandler} from "./dashboard.types";

export namespace Dashboard {

  export const MenuPreloaderCn = "main-menu-cn";

  export function createMenuModel(commandHandler: MenuCommandHandler, ts: TranslocoService): MenuItem[] {
    return [
      {
        label: ts.translate("dashboard.menu.profile"),
        icon: "pi pi-cog",
        command: e => commandHandler.onMenuCommand(e, "profile")
      },
      {
        label: ts.translate("dashboard.menu.settings"),
        icon: "pi pi-wrench",
        command: e => commandHandler.onMenuCommand(e, "settings")
      },
      {
        label: ts.translate("dashboard.menu.exit"),
        icon: "pi pi-sign-out",
        command: e => commandHandler.onMenuCommand(e, "exit")
      }
    ];
  }

}
