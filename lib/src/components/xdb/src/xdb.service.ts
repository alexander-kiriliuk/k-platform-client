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
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {XdbExportDto, XdbExportParams} from "./xdb.types";

@Injectable()
export class XdbService {

  private readonly http = inject(HttpClient);

  importData(data: string) {
    const validXml = this.ensureValidXml(data);
    return this.http.post<void>("/xdb/import", validXml, {
      headers: new HttpHeaders().append("Content-Type", "application/xml")
    });
  }

  exportData(params: XdbExportParams) {
    return this.http.post<XdbExportDto>("/xdb/export", params);
  }

  private ensureValidXml(data: string): string {
    const startTag = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><schema>";
    const endTag = "</schema>";
    if (!data.trim().startsWith("<?xml")) {
      data = startTag + data + endTag;
    }
    return data;
  }

}
