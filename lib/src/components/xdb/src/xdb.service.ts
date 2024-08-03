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
import {Observable} from "rxjs";

/**
 * Service for handling XDB import and export operations.
 */
@Injectable()
export class XdbService {

  private readonly http = inject(HttpClient);

  /**
   * Imports data into the XDB.
   * @param {string} data - The XML data to be imported.
   * @returns {Observable<void>} An observable for the import operation.
   */
  importData(data: string): Observable<void> {
    const validXml = this.ensureValidXml(data);
    return this.http.post<void>("/xdb/import", validXml, {
      headers: new HttpHeaders().append("Content-Type", "application/xml")
    });
  }

  /**
   * Exports data from the XDB.
   * @param {XdbExportParams} params - The parameters for the export.
   * @returns {Observable<XdbExportDto>} An observable containing the exported data file information.
   */
  exportData(params: XdbExportParams): Observable<XdbExportDto> {
    return this.http.post<XdbExportDto>("/xdb/export", params);
  }

  /**
   * Ensures the provided data is valid XML.
   * @param {string} data - The data to be validated.
   * @returns {string} The valid XML data.
   */
  private ensureValidXml(data: string): string {
    const startTag = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><schema>";
    const endTag = "</schema>";
    if (!data.trim().startsWith("<?xml")) {
      data = startTag + data + endTag;
    }
    return data;
  }

}
