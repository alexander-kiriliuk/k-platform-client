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


import {Params, QueryParamsHandling} from "@angular/router";
import {InputSignal, Type, ValueProvider} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {LocalizedString} from "../../../modules/locale";
import {Media} from "../../../modules/media";
import {PageableParams, UserRole} from "../../../global/vars";

/**
 * Defines the possible data types for columns in the explorer.
 */
export type ColumnDataType = "string" | "number" | "boolean" | "date" | "reference" | "unknown";

/**
 * Defines the possible renderer identifiers used in the explorer.
 */
export type RendererId = "string-section-renderer" | "boolean-section-renderer" | "date-section-renderer" |
  "media-section-renderer" | "reference-section-renderer" | "string-object-renderer" | "boolean-object-renderer" |
  "date-object-renderer" | "reference-object-renderer" | "media-object-renderer" | "localized-string-renderer" |
  "localized-media-renderer" | string;

/**
 * Represents a target in the explorer.
 */
export interface ExplorerTarget {
  alias: string;
  target: string;
  tableName: string;
  name: LocalizedString[];
  description: LocalizedString[];
  icon: Media;
  columns: ExplorerColumn[];
  actions: ExplorerAction[];
  defaultActionCreate: boolean;
  defaultActionSave: boolean;
  defaultActionDelete: boolean;
  defaultActionDuplicate: boolean;
  canRead: UserRole[];
  canWrite: UserRole[];
  size?: number;
}

/**
 * Represents a column in the explorer.
 */
export interface ExplorerColumn {
  id: string;
  property: string;
  name: LocalizedString[];
  description: LocalizedString[];
  type: ColumnDataType | string;
  primary: boolean;
  unique: boolean;
  multiple: boolean;
  named: boolean;
  referencedTableName: string;
  referencedEntityName: string;
  sectionPriority: number;
  objectPriority: number;
  sectionEnabled: boolean;
  objectEnabled: boolean;
  sectionVisibility: boolean;
  objectVisibility: boolean;
  virtual: boolean;
  sectionRenderer: ExplorerColumnRenderer;
  objectRenderer: ExplorerColumnRenderer;
  sectionRendererParams: object;
  objectRendererParams: object;
  tab: ExplorerTab;
}

/**
 * Represents an action in the explorer.
 */
export class ExplorerAction {
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  type: ExplorerVariation;
  params: object;
}

/**
 * Represents the size of a tab in the explorer.
 */
export interface ExplorerTabSize {
  tablet: number;
  desktop: number;
}

/**
 * Represents a tab in the explorer.
 */
export interface ExplorerTab {
  id: string;
  name: LocalizedString[];
  priority: number;
  size: ExplorerTabSize;
  target: ExplorerTarget;
}

/**
 * Defines the possible variations in the explorer (as example for actions).
 */
export type ExplorerVariation = "section" | "object";


/**
 * Represents a renderer for a column in the explorer.
 */
export class ExplorerColumnRenderer {
  code: string;
  name: LocalizedString[];
  description: LocalizedString[];
  type: ExplorerVariation;
  params: object;
}

/**
 * Represents data related to a target in the explorer.
 */
export interface TargetData {
  primaryColumn: ExplorerColumn;
  namedColumn: ExplorerColumn;
  entity: ExplorerTarget;
}

/**
 * Represents the configuration for a section filter dialog.
 */
export interface SectionFilterDialogConfig {
  column: ExplorerColumn;
  paramsSnapshot: () => Params;
  navigate: (queryParams: Params, queryParamsHandling?: QueryParamsHandling) => void;
}

/**
 * Represents the configuration for a section dialog.
 */
export interface SectionDialogConfig {
  target: TargetData;
  multi?: boolean;
  initialPageableParams?: PageableParams;
}

/**
 * Represents the configuration for an object dialog.
 */
export interface ObjectDialogConfig {
  id: string;
  target: string;
}

/**
 * Represents a DTO for an explorer object.
 */
export interface ExplorerObjectDto<T = unknown> {
  target: string;
  entity?: T;
  id?: number;
}

/**
 * Represents a renderer in the explorer.
 */
export interface ExplorerRenderer<Data = unknown, Params = unknown> {
  target: TargetData;
  column: ExplorerColumn;
  params: Params;
  data: Data;
  entityForm?: FormGroup;
}

/**
 * Represents a loader for an explorer renderer.
 */
export type ExplorerRendererLoader = {
  code: RendererId;
  load: Promise<Type<ExplorerRenderer>>;
}

/**
 * Represents a provider for an explorer renderer.
 */
export interface ExplorerRendererProvider extends ValueProvider {
  useValue: ExplorerRendererLoader;
}

/**
 * Represents an action renderer in the explorer.
 */
export interface ExplorerActionRenderer {
  target: InputSignal<TargetData>;
  action: ExplorerAction;
  data?: InputSignal<unknown | unknown[]>;
  entityForm?: InputSignal<FormGroup>;
}

/**
 * Represents a loader for an explorer action renderer.
 */
export type ExplorerActionRendererLoader = {
  code: string;
  load: Promise<Type<ExplorerActionRenderer>>;
}

/**
 * Represents a provider for an explorer action renderer.
 */
export interface ExplorerActionRendererProvider extends ValueProvider {
  useValue: ExplorerActionRendererLoader;
}
