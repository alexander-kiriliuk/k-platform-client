# Documentation

It is a fully customisable and easily extensible administrative panel for managing a platform-based system [@k-platform](https://github.com/alexander-kiriliuk/k-platform-core). To start working with the client, you can deploy the example admin application following the example in the [readme.md](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/README.md) file.

The following describes some modules, services and utilities on which the application is based. For information about other parts of the admin-panel, see the [codebase documentations website](https://alexander-kiriliuk.github.io/k-platform-client).

## Embedded modules

- ### [Explorer](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/lib/src/components/explorer)

  This module provides rendering of CRUD, pagination and search UI of all entities in the system, which is automatically created based on meta-data of objects in the database. Metadata is also generated automatically as a result of the [database analyzer](https://github.com/alexander-kiriliuk/k-platform-core/tree/master/lib/common/explorer). But you can change the appearance and behaviour of UI elements by customising system objects rendering parameters, or by creating your own renderers. 
    
  #### Common components:
  - [Explorer section](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/guide/explorer/explorer-section.md)
  - [Explorer object](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/guide/explorer/explorer-object.md)
  - [Explorer renderer](https://github.com/alexander-kiriliuk/k-platform-client/tree/master/guide/explorer/explorer-renderer.md)


- ### Object

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


## Main embedded services and utilities

- ### CurrentUser

- ### Device

- ### Store

- ### CurrentUser

- ### CurrentUser
