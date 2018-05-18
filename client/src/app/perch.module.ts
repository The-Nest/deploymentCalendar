import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Perch } from './perch';
import { PerchCalendarCard } from '../components/perch-calendar-card/perch-calendar-card';


@NgModule({
  declarations: [
    Perch,
    PerchCalendarCard
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [Perch]
})

export class PerchModule { }
