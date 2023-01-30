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
      let lines = this.viewstateservice.docString.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/   /g,"\t").split("\n");
      // trim and replace wierd quotes
      let trimmedLines = lines.map(line => { 
        return {
          original: line,
          trimmed: line.trim()
         };
      });
      // try to remove blank or otherwise empty lines
      trimmedLines = trimmedLines.filter(line => {
        let isTopic = StartChars.includes(line.trimmed.charAt(0));
        return line.trimmed.length > 0 && !isTopic || (isTopic && line.trimmed.length > 1);
      });
      // covert the strings to LineObj
      this.viewstateservice.docArray = trimmedLines.map(line => 
        new LineObj(line.trimmed, this.getTabCount(line.original))
      );
      // join the lines back and replace the docString after filtering the string
      this.viewstateservice.docString = trimmedLines.map(line => line.trimmed).join('\n');

      // update the state
      this.viewstateservice.updateViewState(ViewState.Edit);
    } else {
      // delete data but dont change state since there is no docString
      this.viewstateservice.docString = "";
      this.viewstateservice.docArray = [];
    }
  }

  getTabCount(text: string) {
    let count = 0;
    let index = 0;
    do {
      var char = text.charAt(index++);
      if(char === "\t") count++;
    } while (char === "\t" || char === " ")
    return count;
  }
}
