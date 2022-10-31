import { Component, HostListener } from '@angular/core';
import { ViewState, ViewStateService } from './services/view-state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    public viewstateservice: ViewStateService
  ) {}

  /** the heading of the app */
  name = 'Show Docs';

  /** the {@link ViewStates ViewState} */
  get viewState(): ViewState {
    return this.viewstateservice.state;
  }

  /** {@link ViewState ViewState} enum */
  get ViewStates(): typeof ViewState {
    return ViewState;
  }

  /** confirm the browser closing if there are existing topics */
  @HostListener('window:beforeunload', ['$event'])
  beforeLeaveFn = (event: any) => {
    if(this.viewstateservice.docArray.length==0) {
      return undefined;
    }
    let confirmationMessage = 'You may lose data if you leave. Are you sure?';

    (event || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  }
}
