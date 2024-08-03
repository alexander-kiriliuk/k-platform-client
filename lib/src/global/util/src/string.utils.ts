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

export namespace StringUtils {

  /**
   * Replaces URL parameters with provided values.
   * @param url - The URL containing parameters to replace.
   * @param params - The values to replace the parameters with.
   * @returns The URL with replaced parameters.
   */
  export function fillParams(url: string, ...params: unknown[]) {
    let counter = -1;
    url.replace(/((:)(.*?))(\/|$)/g, (substring, args) => {
      counter++;
      url = url.replace(args, params[counter] as string ?? "");
      return url;
    });
    return url.replace(/\/+$/, "");
  }

  /**
   * Parses a parameter string into an object.
   * @param filterString - The parameter string to parse.
   * @returns An object containing the parsed parameters.
   */
  export function parseParamsString(filterString: string): { [key: string]: string } {
    const filterObject: { [key: string]: string } = {};
    const filterParts = filterString.split("::");
    if (filterString.startsWith("::")) {
      filterParts.shift();
    }
    for (const part of filterParts) {
      const [key, value] = part.split(":");
      filterObject[key] = value;
    }
    return filterObject;
  }

  /**
   * Converts a parameter object into a string.
   * @param filterObject - The object containing parameters.
   * @returns A string representation of the parameters.
   */
  export function stringifyParamsObject(filterObject: { [key: string]: string }): string {
    const filterParts = [];
    for (const key in filterObject) {
      const encodedValue = filterObject[key];
      const filterPart = `${key}:${encodedValue}`;
      filterParts.push(filterPart);
    }
    return "::" + filterParts.join("::");
  }

  /**
   * Removes excessive spaces from a string.
   * @param str - The string to clean.
   * @returns The cleaned string.
   */
  export function clearSpaces(str: string) {
    return str?.replace(/[^\S\r\n]{2,}/g, " ");
  }

}

