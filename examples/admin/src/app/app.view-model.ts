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

import {ChangeDetectorRef, inject, Injectable} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {TranslocoService} from "@ngneat/transloco";
import {MessageService} from "primeng/api";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError} from "rxjs/operators";
import {finalize, throwError} from "rxjs";
import {
  AuthEvent,
  AuthService,
  JwtDto,
  Store,
  StoreMessage,
  ProfileService,
  CurrentUserEvent,
  ToastData,
  ToastEvent,
  ToastKey,
  ToastType,
  User
} from "@k-platform/client";

@Injectable()
export class AppViewModel {

  private readonly doc: Document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ts = inject(TranslocoService);
  private readonly profileService = inject(ProfileService);
  private readonly messageService = inject(MessageService);
  private _ready: boolean;

  constructor() {
    this.doc.body.classList.remove("pending");
    this.store.on<JwtDto>(AuthEvent.Success)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.checkProfile());
    this.store.on<JwtDto>(AuthEvent.Logout)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.logout());
    this.store.on<ToastData>(ToastEvent.All).pipe(takeUntilDestroyed())
      .subscribe(v => this.handleGlobalMessage(v));
  }

  get ready() {
    return this._ready;
  }

  checkProfile() {
    this._ready = false;
    this.cdr.markForCheck();
    this.profileService.getUser().pipe(
      finalize(() => {
        this._ready = true;
        this.cdr.markForCheck();
      }),
      catchError((error) => {
        this.router.navigate(["/auth"]);
        return throwError(() => error);
      })
    ).subscribe(data => {
      this.store.emit<User>(CurrentUserEvent.Set, data);
      if (location.pathname === "/auth") {
        this.router.navigate(["/"]);
      }
    });
  }

  private logout() {
    this._ready = false;
    this.cdr.markForCheck();
    this.authService.logout().pipe(
      catchError((res) => {
        this.store.emit<ToastData>(ToastEvent.Error, {message: res.error.message});
        return throwError(() => res);
      }),
      finalize(() => {
        this._ready = true;
        this.cdr.markForCheck();
      })
    ).subscribe(() => {
      this.router.navigate(["/auth"]);
    });
  }

  private handleGlobalMessage(data: StoreMessage<ToastData>) {
    let severity = ToastType.Info;
    let summary: string = data.payload?.title;
    const detail: string = data.payload?.message;
    switch (data.key) {
    case ToastEvent.Error:
      severity = ToastType.Error;
      if (!summary) {
        summary = this.ts.translate("msg.error");
      }
      break;
    case ToastEvent.Success:
      severity = ToastType.Success;
      break;
    case ToastEvent.Warn:
      severity = ToastType.Warn;
      if (!summary) {
        summary = this.ts.translate("msg.warn");
      }
      break;
    case ToastEvent.Info:
      break;
    }
    this.messageService.add({key: ToastKey.Global, severity, summary, detail});
  }

}
