import {ChangeDetectionStrategy, Component} from "@angular/core";
import {LangSwitcherComponent} from "../lang-switcher/lang-switcher.component";
import {ThemeSwitcherComponent} from "../theme-switcher/theme-switcher.component";
import {TranslocoPipe} from "@ngneat/transloco";

@Component({
  selector: "app-settings",
  standalone: true,
  templateUrl: "./app-settings.component.html",
  styleUrls: ["./app-settings.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LangSwitcherComponent,
    ThemeSwitcherComponent,
    TranslocoPipe
  ]
})
export class AppSettingsComponent {
}
