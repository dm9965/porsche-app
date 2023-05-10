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
    public event_datetime: string,
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

  model = new eventData("","","","","","","","")
  
  submitted = false;

	start_time = { hour: 13, minute: 30, second: 0 };
	end_time = { hour: 13, minute: 30, second: 0 };
	myStartDate = "";
  myStartTime = "";
  myEndDate = "";
  myEndTime = "";
  public touchUi = true;

  date = moment();

  
  onSubmit() { 

    this.date = moment(this.myStartDate);
    this.model.event_datetime = this.date.format("YYYY-MM-DD HH:mm:ss") //database insert format for sorting, etc.
    this.model.event_start_date = this.date.format("MMM D")             //for presentation, ex: Jun 3
    this.model.event_start_time = this.date.format("LT")                //for presentation, ex: 8:00 PM

    this.date = moment(this.myEndDate);
    this.model.event_end_date = this.date.format("MMM D")
    this.model.event_end_time = this.date.format("LT")

    console.log(this.model.event_descr);

    console.log(this.myStartDate);
    console.log(this.model.event_datetime);
    console.log(this.model.event_start_date);
    console.log(this.model.event_start_time);

    console.log(this.myEndDate);
    console.log(this.model.event_end_date);
    console.log(this.model.event_end_time);
    console.log(this.model.event_location);

    console.log(this.model.event_details);
    
    this.submitted = true; 
  }


  NgOnInit() {
  
  }

  save_data(){

  
  }
}
