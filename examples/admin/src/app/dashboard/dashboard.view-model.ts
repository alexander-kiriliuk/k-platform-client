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

import {ChangeDetectorRef, inject, Injectable, signal} from "@angular/core";
import {MenuItem, MenuItemCommandEvent} from "primeng/api";
import {Dashboard} from "./dashboard.constants";
import {MenuCommandHandler} from "./dashboard.types";
import {TranslocoService} from "@ngneat/transloco";
import {DialogService} from "primeng/dynamicdialog";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {
  AuthEvent,
  CurrentUser,
  CurrentUserEvent,
  DashboardEvent,
  Store,
  User
} from "@k-platform/client";


@Injectable()
export class DashboardViewModel implements MenuCommandHandler {

  private readonly ts = inject(TranslocoService);
  private readonly dialogService = inject(DialogService);
  private readonly currentUser = inject(CurrentUser);
  private readonly titleService = inject(Title);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly _title = signal<string>("");
  readonly menuModel: MenuItem[] = Dashboard.createMenuModel(this, this.ts);
  sidebarOverMode: boolean;

  constructor() {
    this.store.on<string>(DashboardEvent.PatchHeader).subscribe(v => {
      this._title.set(v.payload);
      this.titleService.setTitle(
        this.title?.length ? this.title.replace(/<\S[^><]*>/g, "") : this.ts.translate("dashboard.welcome")
      );
    });
    this.store.on<boolean>(DashboardEvent.ToggleSidebar)
      .subscribe((v) => this.sidebarOverMode = !!v.payload);
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      if (this.isHomepage) {
        this.store.emit<string>(DashboardEvent.PatchHeader, "");
      } else {
        this.cdr.markForCheck();
      }
    });
  }

  get title() {
    return this._title();
  }

  get isHomepage() {
    return this.router.url === "/";
  }

  toggleSideBarMode() {
    this.sidebarOverMode = !this.sidebarOverMode;
  }

  onMenuCommand(event: MenuItemCommandEvent, id: string): void {
    switch (id) {
    case "profile":
      import("@k-platform/client").then(c => {
        this.dialogService.open(c.ProfileComponent, {
          header: this.currentUser.fullName,
          resizable: true,
          draggable: true,
          modal: false,
          position: "topright"
        }).onClose.subscribe(data => {
          if (!data) {
            return;
          }
          this.store.emit<User>(CurrentUserEvent.Set, data);
        });
      });
      break;
    case "settings":
      import("./app-settings/app-settings.component").then(c => {
        this.dialogService.open(c.AppSettingsComponent, {
          header: this.ts.translate("dashboard.menu.settings"),
          resizable: true,
          draggable: true,
          modal: false,
          position: "topright"
        });
      });
      break;
    case "exit":
      this.store.emit(AuthEvent.Logout);
      break;
    }
  }


}
