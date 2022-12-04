import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { TEST_DATA } from './services/test-data.service';
import { ViewState, ViewStateService } from './services/view-state.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  readonly DEBUG = true;

  constructor(public viewstateservice: ViewStateService) {
    viewstateservice.docString = this.DEBUG ? TEST_DATA : "";
  }

  private observer:IntersectionObserver;
  private activeTopic: ElementRef;
  private jumpToActiveTopicBtn: ElementRef;

  @ViewChild('activeTopic', { read: ElementRef }) set activeTopicViewChild(topic: ElementRef) {
    this.activeTopic = topic;
    this.observer.disconnect();
    if(this.activeTopic) {
      this.observer.observe(this.activeTopic.nativeElement);
    }
  }

  @ViewChild('jumpToActiveBtn', { read: ElementRef }) set jumpToActiveTopicBtnViewChild(btn: ElementRef) {
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
