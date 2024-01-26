import { Component, OnInit, ViewEncapsulation, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GeteventdetailsService } from '../geteventdetails.service';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButtonModule} from "@angular/material/button";
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

interface Events {
  id: string;
  startdatetime: string;
  enddatetime: string;
  eventname: string;
  location: string;
  details: string;
  attending: string;
  startday: string;
  endday: string;
}

declare var jQuery: any;


@Component({
  selector: 'app-updatelist',
  templateUrl: './updatelist.component.html',
  styleUrls: ['./updatelist.component.scss'],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  encapsulation: ViewEncapsulation.None
})
export class UpdatelistComponent {

  constructor(private _snackbar: MatSnackBar, private session: SessionStorageService) {}

  isLoggedIn = '';

  events: Events[] = [];
  eventId = "";
  eventName = "";
  eventLocation = "";
  myStartDate: string = "";
  myEndDate: string = "";
  eventDetails = "";

  selectedEvent: Events = {
    id: '',
    startdatetime: '',
    enddatetime: '',
    eventname: '',
    location: '',
    details: '',
    attending: '',
    startday: '',
    endday: ''
  }

  ngOnInit() {
    this.isLoggedIn = this.session.retrieve('logged_in');
    if (this.isLoggedIn == 'Y') {
      this.getEvents()
    } else {
      this._snackbar.open('You must be logged in as an Admin to access this functionality',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
    }
  }

  getEvents = () => {
    fetch(environment.apiURL + 'events/all')
      .then((response) => {
        return response.json();
      }).then((data) => {
      this.events = data.sort((a: any, b: any) => {
        const dateA = new Date(a.startdatetime);
        const dateB = new Date(b.startdatetime);
        // @ts-ignore
        return dateA - dateB;
      });
      console.log(data)
      
        //do this so we can differentiate between one day events and multiple day events
        for (let event of this.events) {
          const a = new Date(event.enddatetime);
          event.endday = a.getDay().toString();
          const b = new Date(event.startdatetime);
          event.startday = b.getDay().toString();
          //console.log('start',event.startday);
          //console.log('end',event.endday);
        }

      if (this.events[0].id === undefined) {
        // error in loading data!!
        console.log("Error loading data");
      }
    }).catch((error) => {
      console.log(error)
    })
  }

  deleteEvent = (id: string) => {
    fetch(environment.apiURL + 'event/delete', {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    }).then(() => {
      this.getEvents()
      this._snackbar.open('Event successfully deleted!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
    }).catch((error) => {
      console.log(error)
    })
  }

  updateEvent = (id: string, startdatetime: string, enddatetime: string, eventname: string, location: string, details: string) => {
    console.log("Passed in data to update: ", id, startdatetime, enddatetime, eventname, location, details)
    fetch(environment.apiURL + 'event/update', {
      method: 'PUT',
      body: JSON.stringify({
        startdatetime: startdatetime,
        enddatetime: enddatetime,
        eventname: eventname,
        location: location,
        details: details,
        id: id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data)
    }).then(() => {
      this.getEvents()
      this._snackbar.open('Event successfully updated!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
    }).catch((error)=> {
      console.log('Error updating event: ', error)
    })
  }

  public showUpdatePopup(event: Event): void {
    console.log('Button clicked Update')
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;

    let elementId: string = (event.target as Element).id;
    console.log ('elementId=' + elementId);

    str = elementId;
    //do this because in the HTML the id of the Update button is of the form "edit123"
    eventNum = parseInt(str.substring(4));
    console.log('eventNum=' + eventNum)

    eTblRow = jQuery("#" + str).parent().parent();
    console.log ('Row text=' + eTblRow.text());

    // @ts-ignore
    this.selectedEvent = this.events.find(event => event.id == eventNum)
    console.log(this.selectedEvent)
    console.log("Start Date: ", moment(this.selectedEvent.startdatetime).format( 'MM Do YYYY, hh:mm a'))
    console.log("End Date: ", moment(this.selectedEvent.enddatetime).format( 'MM Do YYYY, hh:mm a'))

    this.myStartDate = moment(this.selectedEvent.startdatetime).format('MM/DD/YYYY, hh:mm A');
    this.myEndDate = moment(this.selectedEvent.enddatetime).format('MM/DD/YYYY, hh:mm A')
    this.eventLocation = this.selectedEvent.location
    this.eventName = this.selectedEvent.eventname
    this.eventDetails = this.selectedEvent.details;


    //populate field with event unique identifier
    this.eventId = eventNum;

    // show the pop-up
    jQuery('#update-popup-box').modal('toggle');
  }


  public showDeletePopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var eTblRowData1: any;
    var str: string;

    let elementId: string = (event.target as Element).id;
    console.log (elementId);

    str = elementId;
    //do this because the id is of the form "delete123"
    eventNum = str.substring(6);
    console.log(eventNum)

    this.selectedEvent.id = eventNum
    //get row which is parent to <td> which is parent to <button>
    eTblRow = jQuery("#"+str).parent().parent();
    console.log (eTblRow.text());

    //get first table cell in the row
    eTblRowData = eTblRow.find('td:eq(0)') ;
    eTblRowData1 = eTblRow.find('td:eq(1)') ;


    //populate field with date
    jQuery("#event-date-delete").val(this.decodeHtml(eTblRowData.html()) + " to " + this.decodeHtml(eTblRowData1.html()));

    eTblRowData = eTblRow.find('td:eq(2)');
    //populate field with description
    jQuery("#event-name-delete").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(3)');
    //populate field with description
    jQuery("#event-location-delete").val(this.decodeHtml(eTblRowData.html()));

    //populate field with event unique identifier
    this.eventId = eventNum;

    // show the pop-up
    jQuery('#delete-popup-box').modal('toggle');
  }

  submitUpdate() {
    console.log(this.selectedEvent)
    this.updateEvent(
      this.selectedEvent.id,
      this.myStartDate,
      this.myEndDate,
      this.eventName,
      this.eventLocation,
      this.eventDetails
    );
  }

  decodeHtml(html:string):string {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}
