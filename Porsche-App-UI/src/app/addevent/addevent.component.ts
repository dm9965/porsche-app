import { Component, OnInit, AfterViewInit, NgModule } from '@angular/core';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { MatSnackBar} from "@angular/material/snack-bar";
import {ThemePalette} from "@angular/material/core";
import { environment } from '../environments/environment';
import { SessionStorageService } from 'ngx-webstorage';

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
    public event_location: string,
    public event_details: string
  ) {}
  [key: string]: string;

}

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.scss'],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ]
})


export class AddeventComponent {

  constructor(private _snackbar: MatSnackBar, private session: SessionStorageService) {  }

  model = new eventData("","","","","")

  submitted = false;
	myStartDate = "";
  myStartTime = "";
  myEndDate = "";
  myEndTime = "";
  public touchUi = true;

  start_date = moment();
  end_date = moment()

  errorMessage = false;

  isLoggedIn = '';

  onSubmit() {

    console.log('logged in=', this.isLoggedIn);
    if (this.isLoggedIn != 'Y') {
      this._snackbar.open('You must be logged as an Admin to access this functionality',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
      return;
    }

    this.start_date = moment(this.myStartDate);
    this.model.event_start_datetime = this.start_date.format("YYYY-MM-DD HH:mm:ss")

    this.end_date = moment(this.myEndDate);
    this.model.event_end_datetime = this.end_date.format("YYYY-MM-DD HH:mm:ss")

    let formValid = true;
    for (const key in this.model) {
      if (!this.model[key]) {
        this.submitted = false;
        formValid= false;
        console.log('Form input invalid. Please try again.')
        this.errorMessage = true;
        this._snackbar.open('Invalid form input. Please try again.',
          'Dismiss', {
            duration: 5000,
            panelClass: ['error_snackbar']
        })
        console.log(this.model)
        break;
      }
    }
    if (formValid) {
      this.submitted = true;
      this.createEvent(this.model.event_start_datetime, this.model.event_end_datetime, this.model.event_descr, this.model.event_location, this.model.event_details)
      this.resetForm()
      this._snackbar.open('Event successfully added!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
    }
  }

  resetForm = () => {
    this.model = new eventData("","","","", "");
    this.myStartDate = "";
    this.myStartTime = "";
    this.myEndDate = "";
    this.myEndTime = "";
    this.start_date = moment();
    this.end_date = moment();
  }

  NgOnInit() {
  }

  ngAfterViewInit() {

    this.isLoggedIn = this.session.retrieve('logged_in');
    console.log('logged in=', this.isLoggedIn);

    if (this.isLoggedIn == 'Y') {

    } else {
      this._snackbar.open('You must be logged in as an Admin to access this functionality',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
    }

  }

  createEvent = (event_start_datetime: string, event_end_datetime: string, event_descr: string, event_location: string, event_details: string) => {

    fetch(environment.apiURL + 'event/create', {
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
  color: ThemePalette = 'warn';
}


