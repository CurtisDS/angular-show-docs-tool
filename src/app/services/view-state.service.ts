import { Injectable } from '@angular/core';

export enum ViewState {
  Edit = 1,
  Code = 2
}

/** an array of characters that denote either a main topic or a subtopic */
export const StartChars = ['-','–','—','−','⸺','—','∟'];

/** an array of characters that denote a subtopic */
export const SubTitleChars = ['∟'];

export class LineObj {

  /** the source line */
  private _line: string;

  /** the title text */
  public title: string;
  /** the character to denote a topic or subtopic */
  public topicChar: string;
  /** the depth of the subtoic, will be 0 if not a subtopic */
  public depth: number;

  constructor(line: string, depth: number) {
    // save the original line
    this._line = line;
    // if this is a topic remove the first character and set as title otherwise use entire line
    this.title = this.isTopic ? this._line.substring(1).trim() : this._line.trim();
    // if this is a topic set to the first character of the line
    this.topicChar = this.isTopic ? this.isSubtopic ? '∟' : '–' : '';
    // set the depth of the subtopic. If its not a subtopic the depth is always 0
    this.depth = this.isSubtopic ? depth : 0;
  }

  get isTopic() {
    return StartChars.includes(this._line.charAt(0));
  }

  get isSubtopic() {
    return SubTitleChars.includes(this._line.charAt(0));
  }

  /** recombine the elements of this topic into a full source line */
  get line() {
    let out = [];
    if(this.isTopic) {
      out.push(this.topicChar);
    }
    out.push(this.title);
    return '\t'.repeat(this.depth) + out.join(' ');
  }
}

@Injectable({
  providedIn: 'root',
 })
export class ViewStateService {

  /** the {@link ViewState} */
  private _viewstate: ViewState;

  /** the text representation of the doc */
  docString: string;
  /** the doc parsed into objects for each topic */
  docArray: LineObj[];

  /** the last copied topic index */
  activeIndex = 0;

  constructor() { 
    // initialize the default view state and sort state
    this._viewstate = ViewState.Edit;

    // if the browser supports local storage
    if (typeof(Storage) !== "undefined") {
       // check local storage to see if there was a previous view state and use that if it exists
      if (localStorage.lastShowDocViewState)
        this._viewstate = ViewState[ViewState[localStorage.lastShowDocViewState]];
    }
  }

  /** the current {@link ViewState} */
  get state(): ViewState {
    return this._viewstate;
  }

  /** update the current {@link ViewState} to a new state */
  updateViewState(state: ViewState) {
    // update the local copy of the view state
    this._viewstate = state;
    // if the browser supports local storage
    if (typeof(Storage) !== "undefined") {
      // save the view state in local storage so the next time the page loads the setting will be consistant
      localStorage.setItem("lastShowDocViewState", this._viewstate as any);
    }
  }
}