import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialExampleModule } from '../material.module';
import { ControlsComponent } from './components/controls/controls.component';
import { TopicComponent } from './components/topic/topic.component';

@NgModule({
  imports: [ 
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MaterialExampleModule,
    ReactiveFormsModule ],
  declarations: [ AppComponent, TopicComponent, ControlsComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
