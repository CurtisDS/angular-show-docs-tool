import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from '../material.module';
import { ControlsComponent } from './components/controls/controls.component';
import { TopicComponent } from './components/topic/topic.component';
import { ConvertCaseDirective } from './directives/convert-case.directive';

/** a debug flag for various operations */
export const DEBUG = false;

@NgModule({
  imports: [ 
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialModule,
    ReactiveFormsModule ],
  declarations: [ AppComponent, TopicComponent, ControlsComponent, ConvertCaseDirective ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
