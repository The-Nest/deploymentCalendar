import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Perch } from './perch';
import { PerchCalendarCard } from '../components/perch-calendar-card/perch-calendar-card';
import { PerchHeader } from '../components/perch-header/perch-header';


@NgModule({
  declarations: [
    Perch,
    PerchCalendarCard,
    PerchHeader
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [Perch]
})

export class PerchModule { }
