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

  export function detectWebpSupportFactory(ds: DeviceDetectorService) {
    const browser = ds.browser.toLowerCase();
    const browserVer = parseInt(ds.browser_version, 10);
    const os = ds.os.toLowerCase();
    return (browser === "chrome" && browserVer >= 23) ||
      (browser === "opera" && browserVer >= 12.1) ||
      (browser === "edge" && browserVer >= 18) ||
      (browser === "firefox" && browserVer >= 65) ||
      (browser === "safari" && browserVer >= 14) ||
      (browser === "ios" && os.includes("11"));
  }

}
