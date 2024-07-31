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

import {inject, Injectable, signal} from "@angular/core";
import {MENU_STORE_KEY} from "./menu-tree.constants";
import {Router} from "@angular/router";
import {finalize} from "rxjs";
import {Dashboard} from "../dashboard.constants";
import {AppService} from "../../global/service/app.service";
import {Category, DashboardEvent, PreloaderEvent, Store} from "@k-platform/client";


@Injectable()
export class MenuTreeViewModel {

  private readonly router = inject(Router);
  private readonly appService = inject(AppService);
  private readonly store = inject(Store);
  private readonly _openedNodes = signal<{ [k: number]: boolean }>({});
  private readonly _data = signal<Category<{ iconClass: string }>[]>([]);

  constructor() {
    this.appService.getMenu().pipe(
      finalize(() => {
        this.store.emit(PreloaderEvent.Hide, Dashboard.MenuPreloaderCn);
        const payload = localStorage.getItem(MENU_STORE_KEY);
        if (payload) {
          this._openedNodes.set(JSON.parse(payload));
        }
      })
    ).subscribe(v => {
      this._data.set(v.children);
    });
  }

  get openedNodes() {
    return this._openedNodes();
  }

  get data() {
    return this._data();
  }

  openBranch(item: Category) {
    if (item.url) {
      this.router.navigateByUrl(item.url);
      this.store.emit(DashboardEvent.ToggleSidebar);
      return;
    }
    if (!item.children?.length) {
      return;
    }
    this.openedNodes[item.id] = true;
    this.syncNodes();
  }

  closeBranch(item: Category) {
    if (!this.openedNodes[item.id]) {
      this.openBranch(item);
      return;
    }
    delete this.openedNodes[item.id];
    this.syncNodes();
  }

  private syncNodes() {
    const payload = JSON.stringify(this.openedNodes);
    localStorage.setItem(MENU_STORE_KEY, payload);
  }

}
