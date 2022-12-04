import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { TEST_DATA } from './services/test-data.service';
import { ViewState, ViewStateService } from './services/view-state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /** a debug flag for various operations */
  readonly DEBUG = false;

  constructor(public viewstateservice: ViewStateService) {
    // if we are in debug mode use the test data from the test data service for the document
    viewstateservice.docString = this.DEBUG ? TEST_DATA : "";
  }

  /** an observer that watches for an element to come into the view */
  private observer:IntersectionObserver;
  /** the current active topic */
  private activeTopic: ElementRef;
  /** the button element that will scroll the user back to the active topic */
  private jumpToActiveTopicBtn: ElementRef;

  /** sets the active topic based on the view child and connects an observer to watch if it goes on/off screen */
  @ViewChild('activeTopic', { read: ElementRef }) set activeTopicViewChild(topic: ElementRef) {
    // set the topic
    this.activeTopic = topic;
    // remove any old active observers
    this.observer.disconnect();
    if(this.activeTopic) {
      // if isnt undefined add the native element to the observer
      this.observer.observe(this.activeTopic.nativeElement);
    }
  }

  /** set the jump to active button element based on the view child */
  @ViewChild('jumpToActiveBtn', { read: ElementRef }) set jumpToActiveTopicBtnViewChild(btn: ElementRef) {
    // set the button
    this.jumpToActiveTopicBtn = btn;
  }

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

  /** run code on init of component */
  ngOnInit(): void {
    // initialize options for an intersection observer
    // to track if the Scroll To Active Topic button should be shown
    let options = {
      root: null,
      rootmargin: '0px',
      threshold: 0.01
    };

    // create the observer
    this.observer = new IntersectionObserver((entries) => {
      if(this.activeTopic) {
        // if it is intersecting that means the active topic is visible and we dont need to show the button
        if (entries[0].isIntersecting) {
          this.jumpToActiveTopicBtn.nativeElement.classList.add("hideButton");
        } else {
          // show the button to scroll back to the active topic
          this.jumpToActiveTopicBtn.nativeElement.classList.remove("hideButton");
        }
      }
    }, options);
  }

  /** confirm the browser closing if there are existing topics */
  @HostListener('window:beforeunload', ['$event'])
  beforeLeaveFn = (event: any) => {
    if(typeof this.viewstateservice.docArray === "undefined" || this.viewstateservice.docArray.length==0) {
      return undefined;
    }
    let confirmationMessage = 'You may lose data if you leave. Are you sure?';

    (event || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
  }

  jumpToActiveTopic() {
    this.activeTopic.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
