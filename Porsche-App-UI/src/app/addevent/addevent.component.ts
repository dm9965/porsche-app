import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'MM/DD/YYYY, hh:mm A'
  },
  display: {
    dateInput: 'MM/DD/YYYY, LT',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

const moment = _moment;



class eventData {
  constructor(
    public event_descr: string,
    public event_start_datetime: string,
    public event_end_datetime: string,
    public event_start_date: string,
    public event_end_date: string,
    public event_start_time: string,
    public event_end_time: string,
    public event_location: string,
    public event_details: string
  ) {}
}


@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css'],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})


export class AddeventComponent {

  constructor() {  }

  model = new eventData("","","","","","","","", "")

  submitted = false;
	myStartDate = "";
  myStartTime = "";
  myEndDate = "";
  myEndTime = "";
  public touchUi = true;

  start_date = moment();
  end_date = moment()


  onSubmit() {
    this.start_date = moment(this.myStartDate);
    this.model.event_start_datetime = this.start_date.format("YYYY-MM-DD HH:mm:ss") //database insert format for sorting, etc.
    this.model.event_start_date = this.start_date.format("MMM D")             //for presentation, ex: Jun 3
    this.model.event_start_time = this.start_date.format("LT")                //for presentation, ex: 8:00 PM

    this.end_date = moment(this.myEndDate);
    this.model.event_end_datetime = this.end_date.format("YYYY-MM-DD HH:mm:ss")
    this.model.event_end_date = this.end_date.format("MMM D")
    this.model.event_end_time = this.end_date.format("LT")

    console.log(this.model.event_descr);

    console.log(this.model.event_start_datetime);

    console.log(this.model.event_end_datetime);

    console.log(this.model.event_location);

    console.log(this.model.event_details);

    this.submitted = true;
    this.createEvent(this.model.event_start_datetime, this.model.event_end_datetime, this.model.event_descr, this.model.event_location, this.model.event_details)
  }


  NgOnInit() {

  }

  createEvent = (event_start_datetime: string, event_end_datetime: string, event_descr: string, event_location: string, event_details: string) => {


    fetch('http://localhost:3001/event/create', {
      method: 'POST',
      body: JSON.stringify({
        startdatetime: event_start_datetime,
        enddatetime: event_end_datetime,
        eventname: event_descr,
        location: event_location,
        details: event_details,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Optionally, you can handle success here
      })
      .catch((error) => {
        console.log(error);
        console.log(event_start_datetime)
        console.log(event_end_datetime)
        // Optionally, you can handle errors here
      });
  }
}
