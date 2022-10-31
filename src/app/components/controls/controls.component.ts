import { Component, OnInit, Input } from '@angular/core';
import { LineObj, StartChars, ViewState, ViewStateService } from '../../services/view-state.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
})
export class ControlsComponent implements OnInit {
  constructor(public viewstateservice: ViewStateService) {}

  /** the heading to use in this component */
  @Input() name: string;

  ngOnInit() {
  }

  /** is the current {@link ViewState} equal to {@link ViewState.Code} */
  get isCodeViewState(): boolean {
    return this.viewstateservice.state === ViewState.Code;
  }

  /** set the current {@link ViewState} to {@link ViewState.Code} and convert the docArray to docString */
  codeView() {
    // join all the lines into one string
    this.viewstateservice.docString = this.viewstateservice.docArray.map(line => line.line).join('\n');
    // update the state
    this.viewstateservice.updateViewState(ViewState.Code);
  }

  /** set the current {@link ViewState} to {@link ViewState.Edit} and convert the docString to docArray */
  editView() {
    if(this.viewstateservice.docString.trim() != "") {
      // split the string for ever new line
      let lines = this.viewstateservice.docString.split("\n");
      // trim and replace wierd quotes
      lines = lines.map(line => line.trim().replace(/[“”]/g,'"').replace(/[‘’]/g,"'"));
      // try to remove blank or otherwise empty lines
      lines = lines.filter(line => {
        let isTopic = StartChars.includes(line.charAt(0));
        return line.length > 0 && !isTopic || (isTopic && line.length > 1);
      });
      // covert the strings to LineObj
      this.viewstateservice.docArray = lines.map(line => new LineObj(line));
      // join the lines back and replace the docString after filtering the string
      this.viewstateservice.docString = lines.join('\n');
    }
    // update the state
    this.viewstateservice.updateViewState(ViewState.Edit);
  }
}
