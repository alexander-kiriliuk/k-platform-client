## View and edit system entities

The `/system/objects` section contains a list of all entities in the system and allows you to search for an entity.

UI of object-editor looks like this
![object-editor.png](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/guide/res/object-editor.png)

1. An entity alias, allows you to search by it, using for example these references: `/section/media`, `/object/media/:id`.
2. Entity field list. When adding a new field by clicking on `+`, a `virtual` field will be added.
3. Tabs for the UI of the entity. Allows you to create multiple tabs and further bind the created tabs to each field.
4. Edit column button, calls the column-editor.
5. Deleting a column, available only for virtual columns - created through the object editing UI.
6. Tab assignment button for a field in the object UI.
7. Virtual column - highlighted in a separate colour, has a delete button. Unlike a regular column - it does not exist directly in the database table and entity class. Such columns are usually informational or contain additional UIs for operations on entities. For example, in the `Media` section, this column has a custom renderer assigned to it - `Virtual column media renderer`, which contains the logic to preview an image.
8. The name of the entity, jump to the section with the data of this entity.
9. UI assignment of action renderers for the entity.
10. The icon of the entity.
11. Flags to adjust the default display/hide actions.
12. UI for setting read and write restrictions by user role.

UI of column-editor looks like this
![object-editor.png](https://raw.githubusercontent.com/alexander-kiriliuk/k-platform-client/master/guide/res/object-editor.png)

1. UI of setting renderers for the field in objects and sections. If the field is empty, default renderers are assigned to the field according to the entity field data type.
2. entity field data type.
3. Priority of the field in section and object, controls the order in which the field is displayed in the UI.
4. Flags regulating the availability of the field in the UI of objects and sections. Available - regulates the availability of the field in the response from the API. Visible - regulates the visibility of UI editing/display of this field, but it will be present in the response from API.
5. Static parameters for renderer in the form of JSON-string.
