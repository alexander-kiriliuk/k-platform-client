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

import {DeviceDetectorService} from "ngx-device-detector";

export namespace MediaUtils {

  /**
   * Detects support for the WebP image format.
   * @param ds - Device detector service.
   * @returns True if the browser supports WebP, false otherwise.
   */
  export function detectWebpSupportFactory(ds: DeviceDetectorService) {
    const name = ds.browser.toLowerCase();
    const ver = parseInt(ds.browser_version, null);
    if (name === "chrome" && ver > 31) {
      return true;
    }
    if (name === "opera" && ver > 18) {
      return true;
    }
    if (name === "ms-edge-chromium" && ver > 17) {
      return true;
    }
    if (name === "safari" && ver > 15) {
      return true;
    }
    return name === "firefox" && ver > 64;
  }

}
