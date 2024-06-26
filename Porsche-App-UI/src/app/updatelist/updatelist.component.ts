import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
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
import { FetchlistdataService } from '../fetchlistdata.service';
import { Eventinterface } from '../eventinterface';
import { UpdatelistdataService } from '../updatelistdata.service';
import { Responseinterface } from '../responseinterface';


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


  constructor(private _snackbar: MatSnackBar, private session: SessionStorageService,
    private fetchlistdataService: FetchlistdataService, private updatelistdataService: UpdatelistdataService) {
      this.checkMobile();
      this.isMobile = false;
    }

  isMobile: boolean;
  isLoggedIn = '';

  events: Eventinterface[] = [];
  eventId = "";
  eventName = "";
  eventLocation = "";
  myStartDate: string = "";
  myEndDate: string = "";
  eventDetails = "";

  selectedEvent: Eventinterface = {
    id: '',
    startdatetime: '',
    enddatetime: '',
    eventname: '',
    location: '',
    details: '',
    attending: '',
    startday: '',
    endday: '',
    errorflag: ""
    }

    responseError: any;
    responseErrorMsg: any;
    responseErrorMsgBody: any;

    responseOutput = { } as Responseinterface;
    
    @HostListener('window:resize', ['$event'])
    onResize(event:any) {
      this.checkMobile();
    }
  
    
    checkMobile() {
      this.isMobile = window.innerWidth <= 768; // Example threshold for mobile viewport - tablet
      this.isMobile = window.innerWidth <= 479; // Example threshold for mobile viewport - phone
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
    this.checkMobile();
  }


  getEvents() {
    //get all available events data from the service
    this.fetchlistdataService.fetchEventList('a'); 
    //wait for result from service
    this.fetchlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("from fetchlist service");
          console.log(this.events);
          if (events.length == 0) {
            //successful call but no data
          } else {
            if (this.events[0].errorflag == "ERROR") {
              var errDet
              errDet = JSON.parse(JSON.stringify(this.events[0].details));
              if (this.events[0].id == "SQL") {
                this.events[0].eventname += errDet.sqlMessage
               }
            }  
          }
        } 
      )
  }


  deleteEvent = (id: string) => {
    this.updatelistdataService.eventAddUpdateDelete (
      id, '', '', '', '', '', 'DELETE'
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
              this.getEvents()
              this._snackbar.open(this.responseOutput.responseErrorMsg,
                'Dismiss', {
                duration: 10000,
                panelClass: ['success_snackbar']
              })
            }
          }
      )   
  }

  updateEvent = (id: string, startdatetime: string, enddatetime: string, eventname: string, location: string, details: string, action: string) => {
    this.updatelistdataService.eventAddUpdateDelete (
      id, startdatetime, enddatetime, eventname, location, details, 'UPDATE'
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
            this.getEvents()
            this._snackbar.open(this.responseOutput.responseErrorMsg,
              'Dismiss', {
              duration: 10000,
              panelClass: ['success_snackbar']
            })
          }
        }
    )
  }


  public showUpdatePopup(event: Event): void {
    //console.log('Button clicked Update')
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;

    let elementId: string = (event.target as Element).id;
    //console.log ('elementId=' + elementId);

    str = elementId;
    //do this because in the HTML the id of the Update button is of the form "edit123"
    eventNum = parseInt(str.substring(4));
    //console.log('eventNum=' + eventNum)

    eTblRow = jQuery("#" + str).parent().parent();
    //console.log ('Row text=' + eTblRow.text());

    // @ts-ignore
    this.selectedEvent = this.events.find(event => event.id == eventNum)
    //console.log(this.selectedEvent)
    //console.log("Start Date: ", moment(this.selectedEvent.startdatetime).format( 'MM Do YYYY, hh:mm a'))
    //console.log("End Date: ", moment(this.selectedEvent.enddatetime).format( 'MM Do YYYY, hh:mm a'))

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
    eTblRow = jQuery("#"+str).parent().parent().parent();
    console.log (eTblRow.text());

    //get first table cell in the row: date
    eTblRowData = eTblRow.find('td:eq(0)') ;
    //get second table cell in the row: event title
    eTblRowData1 = eTblRow.find('td:eq(1)') ;


    //populate field with date
    jQuery("#event-date-delete").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(1)');
    console.log(eTblRowData);
    if (!this.isMobile) {
      //populate field with event title
      jQuery("#event-name-delete").val(this.decodeHtml(eTblRowData.html()));
      eTblRowData = eTblRow.find('td:eq(2)');
      //populate field with location
      jQuery("#event-location-delete").val(this.decodeHtml(eTblRowData.html()));
    } else {
      str = this.decodeHtml(eTblRowData.html())
      //console.log(str);
      const parts = str.split('<br>'); // Split the string by break
      //console.log(parts);
      jQuery("#event-name-delete").val(this.decodeHtml(parts[0]));
      jQuery("#event-location-delete").val(this.decodeHtml(parts[1]));
    }

    //populate field with event unique identifier
    this.eventId = eventNum;

    // show the pop-up
    jQuery('#delete-popup-box').modal('toggle');
  }

  submitUpdate() {
    console.log(this.selectedEvent)
    if (moment(this.myStartDate).isValid() && moment(this.myEndDate).isValid())
    {
      this.updateEvent(
        this.selectedEvent.id,
        moment(this.myStartDate).format("YYYY-MM-DD HH:mm:ss"),
        moment(this.myEndDate).format("YYYY-MM-DD HH:mm:ss"),
        this.eventName,
        this.eventLocation,
        this.eventDetails,
        'UPDATE'
      );
    }
    else
    {
      this._snackbar.open('Invalid date! Update not saved.',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
    }
  }

  decodeHtml(html:string):string {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}
