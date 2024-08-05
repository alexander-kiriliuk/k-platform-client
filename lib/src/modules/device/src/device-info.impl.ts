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
import {inject, Injectable} from "@angular/core";

import {Device} from "./device.types";

/**
 * Service to provide current user device information.
 */
@Injectable()
export class DeviceInfoImpl implements Device {

  /** Indicates whether the device is a desktop. */
  private readonly _isDesktop: boolean;
  /** Indicates whether the device is a tablet. */
  private readonly _isTablet: boolean;
  private readonly ds = inject(DeviceDetectorService);

  constructor() {
    this._isDesktop = this.ds.isDesktop();
    this._isTablet = this.ds.isTablet();
  }

  /**
   * Gets whether the device is a desktop.
   * @returns True if the device is a desktop, false otherwise.
   */
  get isDesktop() {
    return this._isDesktop;
  }

  /**
   * Gets whether the device is a tablet.
   * @returns True if the device is a tablet, false otherwise.
   */
  get isTablet() {
    return this._isTablet;
  }

}
