# K-Platform client

It is a fully customisable and easily extensible administrative panel for managing a platform-based system [@k-platform](https://github.com/alexander-kiriliuk/k-platform-core). To start working with the client, you can deploy the example admin application following the example in the [readme.md](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/README.md) file.

The following describes some modules, services and utilities on which the application is based. For information about other parts of the admin-panel, see the [codebase documentations website](https://alexander-kiriliuk.github.io/k-platform-client).

## Embedded modules

- ### [Explorer](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/lib/src/components/explorer)

  This module provides rendering of CRUD, pagination and search UI of all entities in the system, which is automatically created based on meta-data of objects in the database. Metadata is also generated automatically as a result of the [database analyzer](https://github.com/alexander-kiriliuk/k-platform-core/tree/master/lib/common/explorer). But you can change the appearance and behaviour of UI elements by customising system objects rendering parameters, or by creating your own renderers. 
    
  #### Common components:
  - Explorer section - is a universal component that provides the ability to page, search and filter records any entities of database. Each column is displayed using the section renderer bound to it.
  - Explorer object - is a universal component that provides the ability to perform CRUD operations on any entity. Each column is displayed with the help of the object renderer bound to it.
  - [Explorer renderer](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/guide/explorer/explorer-renderer.md) - special components that are bound to entity columns, responsible for the appearance and behaviour logic of editing elements and displaying entity fields. There is also a separate type of renderer `action-renderer`, which is responsible for the display and logic of entity action elements.

- ### [Object](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/lib/src/components/object)

  This module is responsible for displaying all database entities. It allows you to edit the metadata of all entity columns, manage renderers, create virtual columns, manage read and edit access by users roles, adjust the display order and customise the tabbed UI for editing an entity. You can [read more here](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/guide/object/object.md).

- ### Auth

- ### Config

- ### Profile

- ### XDB


## Embedded UI components

- ### FileInputComponent

- ### LocalizeMediaInputComponent

- ### MediaComponent

- ### MediaInputComponent

- ### RefInputComponent

- ### PreloaderComponent


## Common embedded services and utilities

- ### CurrentUser

- ### Store

- ### Device
