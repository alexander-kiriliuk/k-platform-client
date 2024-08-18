## Explorer renderer

Renderer is a component that is responsible for displaying the entity field from the database in the listings of system objects (sections) and in their editing interfaces (objects). And there is also an action-renderer, which is a component that is responsible for displaying action buttons on an object in the interfaces of sections and objects.

There are several embedded section and object renderers for different types of entity field data from the database: 

- `StringSectionRendererComponent`, `StringObjectRendererComponent`
- `BooleanSectionRendererComponent`, `BooleanObjectRendererComponent`
- `DateSectionRendererComponent`, `DateObjectRendererComponent`
- `MediaSectionRendererComponent`, `MediaObjectRendererComponent`
- `ReferenceSectionRendererComponent`, `ReferenceObjectRendererComponent`
- `LocalizedStringObjectRendererComponent`
- `LocalizedMediaObjectRendererComponent`

These renderers are assigned to entity fields based on their data types when metadata is generated during database entities analysis. You can always change them by editing the entity metadata, or you can create your own renderer and assign it to an entity field if you need to create a special interface for editing a database entity field.

In the case of action-renderers, there are no embedded ones as such in the form of system objects, but they are in the form of embedded in the system object listing UI (sections) and in their editing interfaces (objects). They are represented as buttons `Create`, `Duplicate`, `Export`, `Delete`, `Save`. They can only be disabled if required (for example, if you want to implement your own special process for saving the form of a database entity, thus replacing the standard mechanism, you might to disable default save action).

Some custom renderers of objects, sections, and action renderers are provided with several embedded modules, which can be found in the corresponding documentation sections. Read about how to create a custom renderer [here](https://github.com/alexander-kiriliuk/k-platform-client/blob/master/guide/explorer/explorer-custom-renderer.md).

The object and section renderers implement the corresponding abstract classes (`AbstractExplorerSectionRenderer`, `AbstractExplorerObjectRenderer`), that implement the interface `ExplorerRenderer`. This interface contains fields:
- `target` - contains all information about the current database entity
- `column` - contains meta-information about the current column displayed by this renderer
- `params` - additional static parameters for the renderer, which may affect its behaviour or appearance in some way, are set in the metadata of the entity column as a JSON string
- `data` - data of the current entity 
- `entityForm` - reference to the form object (`FormGroup`) of the database entity edit. Allows validation of the form, access to the rest of the entity's form fields and data. Used only in entity renderers.

Action renderers implement the abstract class `AbstractExplorerActionRenderer` which implements the `ExplorerActionRenderer` interface. This interface contains similar fields to `ExplorerRenderer`, but unlike it there is an additional field `action` which contains meta-data for the current action and is set in the object entity.

### Example

As an example, consider the default renderer for a field of type `Date`.

An empty class with no logic is implemented for section:

    export class DateSectionRendererComponent extends AbstractExplorerSectionRenderer<string> {
    }

The HTML template of the component appears to be a normal output of the entity field value using the embedded DatePipe:

`{{data[column.property] | date:"medium"}}`

For object, a class containing additional logic for working with the calendar is implemented:

    export class DateObjectRendererComponent extends AbstractExplorerObjectRenderer<string, unknown, DateObjectRendererParams> implements OnInit {
    
      readonly id = NumberUtils.getRandomInt().toString();
      rendererParams: DateObjectRendererParams = {
        showCalendar: true,
        dateFormat: "medium",
        firstDayOfWeek: 1,
        showTime: false,
        showSeconds: false,
        readonlyInput: true,
        inline: true
      };
      
      get currentDate(){
        return new Date();
      }
      
      ngOnInit(): void {
        this.ctrl.setValue(this.ctrl.value ? new Date(this.ctrl.value) : this.currentDate);
        if (this.params) {
        Object.assign(this.rendererParams, this.params);
        }
      }

    }
The `rendererParams` field contains default parameters for displaying the calendar, they can be overridden by the parameters for the renderer from the entity, which are contained in the `params` field. As well as implemented additional logic for working with the calendar and the form of the object. HTML-template of the component is a wrapper for the calendar: 

    <label [for]="id">
      <span>
        {{ column.name | localize: column.property }}
      </span>
      <span [ngClass]="{'string-value': !rendererParams.showCalendar}">
        {{ ctrl.value | date: rendererParams.dateFormat }}
      </span>
    </label>
    @if (rendererParams.showCalendar) {
      <p-calendar
        [inputId]="id"
        [formControl]="ctrl"
        [placeholder]="(column.name | localize: column.property).toString()"
        [firstDayOfWeek]="rendererParams.firstDayOfWeek"
        [showTime]="rendererParams.showTime"
        [showSeconds]="rendererParams.showSeconds"
        [readonlyInput]="rendererParams.readonlyInput"
        [inline]="rendererParams.inline"/>
    }
