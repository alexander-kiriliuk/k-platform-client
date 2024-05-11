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


// globals

export * from "./src/global/interceptor/app.interceptor";

export * from "./src/global/internationalization/transloco-http-loader";

export * from "./src/global/service/app.service";
export * from "./src/global/service/app-initializer";
export * from "./src/global/service/captcha/captcha.service";
export * from "./src/global/service/current-user";
export * from "./src/global/service/process/process.service";

export * from "./src/global/util/lang.utils";
export * from "./src/global/util/number.utils";
export * from "./src/global/util/string.utils";
export * from "./src/global/util/theme.utils";

export * from "./src/global/validator/field-match.validator";
export * from "./src/global/validator/json-string.validator";
export * from "./src/global/validator/not-only-spaces.validator";
export * from "./src/global/validator/only-latin-letters-and-numbers.validator";

export * from "./src/global/constants";
export * from "./src/global/events";
export * from "./src/global/types";

// modules

export * from "./src/modules/device/device.constants";
export * from "./src/modules/device/device-info.impl";

export * from "./src/modules/events/prevent-default.directive";
export * from "./src/modules/events/stop-propagation.directive";

export * from "./src/modules/file/file.types";
export * from "./src/modules/file/file-size.pipe";
export * from "./src/modules/file/input/file-input.component";

export * from "./src/modules/locale/locale.types";
export * from "./src/modules/locale/locale.constants";
export * from "./src/modules/locale/localize.pipe";
export * from "./src/modules/locale/media-input/localize-media-input.component";
export * from "./src/modules/locale/string-input/localize-string-input.component";

export * from "./src/modules/media/input/media-input.component";
export * from "./src/modules/media/media.component";
export * from "./src/modules/media/media.constants";
export * from "./src/modules/media/media.types";
export * from "./src/modules/media/media.utils";
export * from "./src/modules/media/media.service";
export * from "./src/modules/media/media-url.pipe";

export * from "./src/modules/preloader/preloader.component";
export * from "./src/modules/preloader/preloader.directive";
export * from "./src/modules/preloader/preloader.event";
export * from "./src/modules/preloader/preloader.types";

export * from "./src/modules/process/process-log.pipe";

export * from "./src/modules/ref-input/ref-input.component";
export * from "./src/modules/ref-input/ref-input.types";
export * from "./src/modules/ref-input/ref-name.pipe";

export * from "./src/modules/store/store";
export * from "./src/modules/store/store-message-md";
export * from "./src/modules/store/store-message";

// components

export * from "./src/components/auth/auth.constants";
export * from "./src/components/auth/auth.component";
export * from "./src/components/auth/auth.types";
export * from "./src/components/auth/auth.service";
export * from "./src/components/auth/auth.event";

export * from "./src/components/config/config.component";
export * from "./src/components/config/config.constants";
export * from "./src/components/config/config.service";
export * from "./src/components/config/config.types";
/*export * from "./components/config/editor/config-property-editor.component";
export * from "./components/config/editor/config-property-editor.constants";*/

export * from "./src/components/explorer/cached-explorer.service";
export * from "./src/components/explorer/explorer.constants";
export * from "./src/components/explorer/explorer.service";
export * from "./src/components/explorer/explorer.types";
export * from "./src/components/explorer/explorer-action-renderer-providers";
export * from "./src/components/explorer/explorer-object-renderer-providers";
export * from "./src/components/explorer/explorer-secrion-renderer-providers";
export * from "./src/components/explorer/section/section.component";
export * from "./src/components/explorer/section/filter/section-filter-dialog.component";
export * from "./src/components/explorer/section/filter/section-filter-dialog.constants";
export * from "./src/components/explorer/section/filter/section-filter-dialog.types";
export * from "./src/components/explorer/section/filter/target/target-columns-dialog.component";
export * from "./src/components/explorer/renderer/abstract-explorer-renderer.component";
export * from "./src/components/explorer/renderer/explorer-action-renderer.component";
export * from "./src/components/explorer/renderer/explorer-object-renderer.component";
export * from "./src/components/explorer/renderer/explorer-section-renderer.component";
export * from "./src/components/explorer/object/explorer.event";
export * from "./src/components/explorer/object/explorer-object.component";
export * from "./src/components/explorer/object/explorer-object.constants";

export * from "./src/components/object/object.component";
export * from "./src/components/object/object.constants";
export * from "./src/components/object/object.types";

export * from "./src/components/profile/profile.component";
export * from "./src/components/profile/profile.constants";
export * from "./src/components/profile/profile.service";
export * from "./src/components/profile/profile.types";

export * from "./src/components/xdb/xdb.constants";
export * from "./src/components/xdb/xdb.service";
export * from "./src/components/xdb/xdb.types";
export * from "./src/components/xdb/xdb-import/xdb-import.component";
export * from "./src/components/xdb/xdb-export/xdb-export-dialog.component";
export * from "./src/components/xdb/xdb-export/xdb-export-dialog.constants";

/*export * from "./components/explorer/renderer/default/abstract-explorer-action-renderer";
export * from "./components/explorer/renderer/default/abstract-explorer-object-renderer";
export * from "./components/explorer/renderer/default/abstract-explorer-section-renderer";
export * from "./components/explorer/renderer/default/section/boolean/boolean-section-renderer.component";
export * from "./components/explorer/renderer/default/section/date/date-section-renderer.component";
export * from "./components/explorer/renderer/default/section/media/media-section-renderer.component";
export * from "./components/explorer/renderer/default/section/reference/reference-section-renderer.component";
export * from "./components/explorer/renderer/default/section/string/string-section-renderer.component";
export * from "./components/explorer/renderer/default/object/boolean/boolean-object-renderer.component";
export * from "./components/explorer/renderer/default/object/date/date-object-renderer.component";
export * from "./components/explorer/renderer/default/object/date/date-object-renderer.types";
export * from "./components/explorer/renderer/default/object/localized-media/localized-media-object-renderer.component";
export * from "./components/explorer/renderer/default/object/localized-media/localized-media-object-renderer.types";
export * from "./components/explorer/renderer/default/object/localized-string/localized-string-object-renderer.component";
export * from "./components/explorer/renderer/default/object/media/media-object-renderer.component";
export * from "./components/explorer/renderer/default/object/media/media-object-renderer.types";
export * from "./components/explorer/renderer/default/object/reference/reference-object-renderer.component";
export * from "./components/explorer/renderer/default/object/string/string-object-renderer.component";
export * from "./components/explorer/renderer/default/object/string/string-object-renderer.types";
export * from "./components/explorer/renderer/custom/action/file/delete/delete-file-action-renderer.service";
export * from "./components/explorer/renderer/custom/action/file/delete/delete-file-action-renderer.component";
export * from "./components/explorer/renderer/custom/action/file/create/create-file-action-renderer.component";
export * from "./components/explorer/renderer/custom/action/file/create/dialog/create-file-action-dialog.component";*/
