'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Application documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BooleanObjectRendererComponent.html" data-type="entity-link" >BooleanObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BooleanSectionRendererComponent.html" data-type="entity-link" >BooleanSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfigComponent.html" data-type="entity-link" >ConfigComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfigPropertyEditorComponent.html" data-type="entity-link" >ConfigPropertyEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateFileActionDialogComponent.html" data-type="entity-link" >CreateFileActionDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateFileActionRendererComponent.html" data-type="entity-link" >CreateFileActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateMediaActionDialogComponent.html" data-type="entity-link" >CreateMediaActionDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateMediaActionRendererComponent.html" data-type="entity-link" >CreateMediaActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateObjectRendererComponent.html" data-type="entity-link" >DateObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateSectionRendererComponent.html" data-type="entity-link" >DateSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteFileActionRendererComponent.html" data-type="entity-link" >DeleteFileActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteMediaActionRendererComponent.html" data-type="entity-link" >DeleteMediaActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExplorerActionRendererComponent.html" data-type="entity-link" >ExplorerActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExplorerObjectComponent.html" data-type="entity-link" >ExplorerObjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExplorerObjectRendererComponent.html" data-type="entity-link" >ExplorerObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExplorerSectionComponent.html" data-type="entity-link" >ExplorerSectionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExplorerSectionRendererComponent.html" data-type="entity-link" >ExplorerSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileInputComponent.html" data-type="entity-link" >FileInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileMetadataObjectRendererComponent.html" data-type="entity-link" >FileMetadataObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileStatMediaObjectRendererComponent.html" data-type="entity-link" >FileStatMediaObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ImagesStatsMediaObjectRendererComponent.html" data-type="entity-link" >ImagesStatsMediaObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizedMediaObjectRendererComponent.html" data-type="entity-link" >LocalizedMediaObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizedStringObjectRendererComponent.html" data-type="entity-link" >LocalizedStringObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizeMediaInputComponent.html" data-type="entity-link" >LocalizeMediaInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizeStringInputComponent.html" data-type="entity-link" >LocalizeStringInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MediaComponent.html" data-type="entity-link" >MediaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MediaInputComponent.html" data-type="entity-link" >MediaInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MediaObjectRendererComponent.html" data-type="entity-link" >MediaObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MediaSectionRendererComponent.html" data-type="entity-link" >MediaSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewPasswordObjectRendererComponent.html" data-type="entity-link" >NewPasswordObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ObjectComponent.html" data-type="entity-link" >ObjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ObjectDetailsColumnEditorComponent.html" data-type="entity-link" >ObjectDetailsColumnEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ObjectDetailsComponent.html" data-type="entity-link" >ObjectDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PreloaderComponent.html" data-type="entity-link" >PreloaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProcessStatsObjectRendererComponent.html" data-type="entity-link" >ProcessStatsObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReCreateMediaActionRendererComponent.html" data-type="entity-link" >ReCreateMediaActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReferenceObjectRendererComponent.html" data-type="entity-link" >ReferenceObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReferenceSectionRendererComponent.html" data-type="entity-link" >ReferenceSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RefInputComponent.html" data-type="entity-link" >RefInputComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SectionFilterDialogComponent.html" data-type="entity-link" >SectionFilterDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StartProcessActionRendererComponent.html" data-type="entity-link" >StartProcessActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StopProcessActionRendererComponent.html" data-type="entity-link" >StopProcessActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StringObjectRendererComponent.html" data-type="entity-link" >StringObjectRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StringSectionRendererComponent.html" data-type="entity-link" >StringSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TargetColumnsDialogComponent.html" data-type="entity-link" >TargetColumnsDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ToggleProcessActionRendererComponent.html" data-type="entity-link" >ToggleProcessActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UpdateMediaFileActionDialogComponent.html" data-type="entity-link" >UpdateMediaFileActionDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UpdateMediaFileActionRendererComponent.html" data-type="entity-link" >UpdateMediaFileActionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VirtualMediaSectionRendererComponent.html" data-type="entity-link" >VirtualMediaSectionRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XdbExportDialogComponent.html" data-type="entity-link" >XdbExportDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/XdbImportComponent.html" data-type="entity-link" >XdbImportComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/PreloaderDirective.html" data-type="entity-link" >PreloaderDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/PreventDefaultDirective.html" data-type="entity-link" >PreventDefaultDirective</a>
                                </li>
                                <li class="link">
                                    <a href="directives/StopPropagationDirective.html" data-type="entity-link" >StopPropagationDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractExplorerActionRenderer.html" data-type="entity-link" >AbstractExplorerActionRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractExplorerObjectRenderer.html" data-type="entity-link" >AbstractExplorerObjectRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractExplorerRendererComponent.html" data-type="entity-link" >AbstractExplorerRendererComponent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractExplorerSectionRenderer.html" data-type="entity-link" >AbstractExplorerSectionRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateObjectRendererParams.html" data-type="entity-link" >DateObjectRendererParams</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExplorerAction.html" data-type="entity-link" >ExplorerAction</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExplorerColumnRenderer.html" data-type="entity-link" >ExplorerColumnRenderer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Roles.html" data-type="entity-link" >Roles</a>
                            </li>
                            <li class="link">
                                <a href="classes/StoreMessageMd.html" data-type="entity-link" >StoreMessageMd</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthViewModel.html" data-type="entity-link" >AuthViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CachedExplorerService.html" data-type="entity-link" >CachedExplorerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CaptchaService.html" data-type="entity-link" >CaptchaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigService.html" data-type="entity-link" >ConfigService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigViewModel.html" data-type="entity-link" >ConfigViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CurrentUser.html" data-type="entity-link" >CurrentUser</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeleteFileActionRendererService.html" data-type="entity-link" >DeleteFileActionRendererService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeviceInfoImpl.html" data-type="entity-link" >DeviceInfoImpl</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExplorerObjectViewModel.html" data-type="entity-link" >ExplorerObjectViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExplorerSectionViewModel.html" data-type="entity-link" >ExplorerSectionViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExplorerService.html" data-type="entity-link" >ExplorerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaService.html" data-type="entity-link" >MediaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ObjectDetailsViewModel.html" data-type="entity-link" >ObjectDetailsViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProcessService.html" data-type="entity-link" >ProcessService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileViewModel.html" data-type="entity-link" >ProfileViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SectionFilterDialogViewModel.html" data-type="entity-link" >SectionFilterDialogViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Store.html" data-type="entity-link" >Store</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XdbExportDialogViewModel.html" data-type="entity-link" >XdbExportDialogViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XDBImportViewModel.html" data-type="entity-link" >XDBImportViewModel</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/XdbService.html" data-type="entity-link" >XdbService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AudioFileMetadata.html" data-type="entity-link" >AudioFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Category.html" data-type="entity-link" >Category</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfigItem.html" data-type="entity-link" >ConfigItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Device.html" data-type="entity-link" >Device</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExifFileMetadata.html" data-type="entity-link" >ExifFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerActionRenderer.html" data-type="entity-link" >ExplorerActionRenderer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerActionRendererProvider.html" data-type="entity-link" >ExplorerActionRendererProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerColumn.html" data-type="entity-link" >ExplorerColumn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerObjectDto.html" data-type="entity-link" >ExplorerObjectDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerRenderer.html" data-type="entity-link" >ExplorerRenderer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerRendererProvider.html" data-type="entity-link" >ExplorerRendererProvider</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerTab.html" data-type="entity-link" >ExplorerTab</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerTabSize.html" data-type="entity-link" >ExplorerTabSize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExplorerTarget.html" data-type="entity-link" >ExplorerTarget</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FieldFilterForm.html" data-type="entity-link" >FieldFilterForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/File.html" data-type="entity-link" >File</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileMetadata.html" data-type="entity-link" >FileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FileUploadEvent.html" data-type="entity-link" >FileUploadEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GpsFileMetadata.html" data-type="entity-link" >GpsFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IccFileMetadata.html" data-type="entity-link" >IccFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImageFileMetadata.html" data-type="entity-link" >ImageFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ImagesStatFileItem.html" data-type="entity-link" >ImagesStatFileItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtDto.html" data-type="entity-link" >JwtDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Language.html" data-type="entity-link" >Language</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedMedia.html" data-type="entity-link" >LocalizedMedia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedMediaObjectRendererTypes.html" data-type="entity-link" >LocalizedMediaObjectRendererTypes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LocalizedString.html" data-type="entity-link" >LocalizedString</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginPayload.html" data-type="entity-link" >LoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Media.html" data-type="entity-link" >Media</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaExt.html" data-type="entity-link" >MediaExt</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaFile.html" data-type="entity-link" >MediaFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaFormat.html" data-type="entity-link" >MediaFormat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaObjectRendererParams.html" data-type="entity-link" >MediaObjectRendererParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MediaType.html" data-type="entity-link" >MediaType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewPasswordObjectRendererParams.html" data-type="entity-link" >NewPasswordObjectRendererParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ObjectDialogConfig.html" data-type="entity-link" >ObjectDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageableData.html" data-type="entity-link" >PageableData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PageableParams.html" data-type="entity-link" >PageableParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProcessLog.html" data-type="entity-link" >ProcessLog</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProcessUnit.html" data-type="entity-link" >ProcessUnit</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionDialogConfig.html" data-type="entity-link" >SectionDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SectionFilterDialogConfig.html" data-type="entity-link" >SectionFilterDialogConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StoreMessage.html" data-type="entity-link" >StoreMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StringObjectRendererParams.html" data-type="entity-link" >StringObjectRendererParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TargetData.html" data-type="entity-link" >TargetData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TargetForm.html" data-type="entity-link" >TargetForm</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToastData.html" data-type="entity-link" >ToastData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TogglePreloader.html" data-type="entity-link" >TogglePreloader</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserRole.html" data-type="entity-link" >UserRole</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/VideoFileMetadata.html" data-type="entity-link" >VideoFileMetadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XdbExportDialogParams.html" data-type="entity-link" >XdbExportDialogParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/XdbExportParams.html" data-type="entity-link" >XdbExportParams</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/FileSizePipe.html" data-type="entity-link" >FileSizePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/LocalizePipe.html" data-type="entity-link" >LocalizePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/MediaUrlPipe.html" data-type="entity-link" >MediaUrlPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/ProcessLogPipe.html" data-type="entity-link" >ProcessLogPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/RefNamePipe.html" data-type="entity-link" >RefNamePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});