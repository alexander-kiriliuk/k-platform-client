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

import {inject, Injectable} from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {Observable, switchMap, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";
import {API_URL} from "@k-platform/client";

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  private readonly apiUrl = inject(API_URL);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({
      withCredentials: true,
      url: this.normalizeUrl(request.url)
    });
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.error.message === "ERR_TOKEN_A") {
          return this.exchangeToken().pipe(
            switchMap(() => {
              const newRequest = request.clone();
              return next.handle(newRequest);
            }),
            catchError((exchangeError) => {
              this.router.navigate(["/auth"]);
              return throwError(exchangeError);
            })
          );
        }
        return throwError(() => response);
      })
    );
  }

  private exchangeToken() {
    return this.http.post("/auth/exchange-token", {});
  }

  private normalizeUrl(url: string) {
    const segments = url.split("/");
    const lastSegment = segments[segments.length - 1];
    if (url.indexOf("//") !== -1 || lastSegment.indexOf(".") !== -1) {
      return encodeURI(url);
    }
    url = `${this.apiUrl}${url}`;
    return encodeURI(url);
  }

}
