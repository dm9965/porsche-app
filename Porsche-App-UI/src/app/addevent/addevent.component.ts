import { Component, OnInit, AfterViewInit, NgZone, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MomentDateModule } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from '@angular/material/core';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";

import { MatSnackBar} from "@angular/material/snack-bar";
import {ThemePalette} from "@angular/material/core";
import { environment } from '../environments/environment';
import { SessionStorageService } from 'ngx-webstorage';
import { UpdatelistdataService } from '../updatelistdata.service';
import { Responseinterface } from '../responseinterface';

declare var jQuery: any;
declare var evt: Event;

export const MY_CUSTOM_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY, LT'
  },
  display: {
    dateInput: 'DD/MM/YYYY, h:mm A',
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
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true} },
    //{ provide: NGX_MAT_DATE_FORMATS, useValue: MY_CUSTOM_DATE_FORMATS },
    { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true} },
    { provide: MAT_DATE_FORMATS, useValue: MY_CUSTOM_DATE_FORMATS },
    //{ provide: NgxMatDateAdapter, useClass: customNgxDatetimeAdapter, deps: [MAT_DATE_LOCALE, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  ]
})




export class AddeventComponent {

  constructor(private _snackbar: MatSnackBar, private session: SessionStorageService, private updatelistdataService: UpdatelistdataService) {  }

  @ViewChild('start_picker') picker: any;

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

  responseOutput = { } as Responseinterface;

  public myFormGroup = new FormGroup({
    date1: new FormControl(null, [Validators.required]),
    date2: new FormControl(null, [Validators.required])
  })
  public dateControl = new FormControl(new Date());

  //used in html template
  color: ThemePalette = 'warn';


  NgOnInit() {
  }

  ngAfterViewInit() {

    this.isLoggedIn = this.session.retrieve('logged_in');
    //console.log('logged in=', this.isLoggedIn);

    if (this.isLoggedIn == 'Y') {
      //good to go
    } else {
      this._snackbar.open('You must be logged in as an Admin to access this functionality',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
    }

  }



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

    if (!moment(this.myStartDate).isValid() || !moment(this.myEndDate).isValid())
    {
      this._snackbar.open('Invalid date! Please correct dates.',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
      return;
    }

    this.start_date = moment(this.myStartDate);
    this.model.event_start_datetime = this.start_date.format("YYYY-MM-DD HH:mm:ss")
    // following for debug
    this.myStartDate = this.start_date.format("YYYY-MM-DD HH:mm:ss")
    console.log(this.myStartDate)

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
    }
  }


  createEvent = (event_start_datetime: string, event_end_datetime: string, event_descr: string, event_location: string, event_details: string) => {
    this.updatelistdataService.eventAddUpdateDelete (
      '', event_start_datetime, event_end_datetime, event_descr, event_location, event_details, 'ADD'
      )
    this.updatelistdataService.newResponseEvent
    .subscribe( 
      responseOutput => {
        this.responseOutput = responseOutput;
        console.log("from updatelist service");
        console.log(this.responseOutput);
        if (this.responseOutput.responseError) {
         this._snackbar.open(this.responseOutput.responseErrorMsg + " : " + this.responseOutput.responseErrorMsgBody,
          'Dismiss', {
            duration: 15000,
            panelClass: ['error_snackbar']
          })
          } else {
            //this.getEvents()
            this._snackbar.open(this.responseOutput.responseErrorMsg,
              'Dismiss', {
              duration: 10000,
              panelClass: ['success_snackbar']
            })
            this.resetForm()
            jQuery("#start-div").html(" ")
            jQuery("#end-div").html(" ")
          }
        }
    )
  }


  resetForm = () => {
    this.model = new eventData("","","","", "");
    this.myStartDate = "";
    this.myStartTime = "";
    this.myEndDate = "";
    this.myEndTime = "";
    this.start_date = moment();
    this.end_date = moment();
    jQuery("#start-div").html(" ")
    jQuery("#end-div").html(" ")
}

  

  public onStartDateChange(event: any): void {
    console.log('StartEvent', event.value);
    //this.myStartDate = moment(event.value).format("M/D/YYYY h:mm A").toString()
    //console.log("myDate", this.myStartDate)
    jQuery("#start-div").html(moment(event.value).format("MMM D, YYYY h:mm A").toString())
  }

  public onEndDateChange(event: any): void {
    console.log('EndEvent', event.value);
    jQuery("#end-div").html(moment(event.value).format("MMM D, YYYY h:mm A").toString())
  }


}
