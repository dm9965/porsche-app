import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {  ActivatedRoute  } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { now } from 'moment';
import { NgFor } from '@angular/common';
import { environment } from '../environments/environment';
import { FetchlistdataService } from '../fetchlistdata.service';
import { Eventinterface } from '../eventinterface';
import { UpdatelistdataService } from '../updatelistdata.service';
import { Responseinterface } from '../responseinterface';


declare var jQuery: any;

@Component({
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {

  s: any;   //query parameter
  sUrl = '';
  sAction = '';

  constructor(private route: ActivatedRoute, private _snackbar: MatSnackBar,
    private fetchlistdataService: FetchlistdataService, private updatelistdataService: UpdatelistdataService) {  }

  selectedOption: string = "1";
  
  events: Eventinterface[] = [];

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
    errorflag: ''
  }

  d: any;
  responseError: any;
  responseErrorMsg: any;
  responseErrorMsgBody: any;

  responseOutput: Responseinterface[] = [];
  

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.s = this.route.snapshot.queryParamMap.get('s');
      //console.log(this.route.snapshot.queryParamMap)
      console.log(this.route.snapshot.queryParams)
      this.getEvents(this.s);
    });
  }


  getEvents(listid:string) {
    this.fetchlistdataService.fetchEventList(listid); //gets data from the service
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



  submitForm = () => {
    if (this.s == 'u') { 
      this.updatelistdataService.eventRSVP (
        this.selectedEvent.id, 
        this.selectedEvent.attending, 
        this.selectedOption
      )
      this.updatelistdataService.newResponseEvent
      .subscribe( 
        responseOutput => {
          this.responseOutput[0] = responseOutput;
          console.log("from updatelist service");
          console.log(this.responseOutput);
          if (this.responseOutput[0].responseError) {
           this._snackbar.open(this.responseOutput[0].responseErrorMsg + " : " + this.responseOutput[0].responseErrorMsgBody,
            'Dismiss', {
              duration: 15000,
              panelClass: ['error_snackbar']
            })
            } else {
              this._snackbar.open(this.responseOutput[0].responseErrorMsg,
                'Dismiss', {
                duration: 5000,
                panelClass: ['success_snackbar']
              })
            }
          }
      )
    }
    else
    {
      this._snackbar.open("Can't RSVP to past events",
        'Dismiss', {
          duration: 5000,
          panelClass: ['error_snackbar']
        })
    }
  }


  public showPopup(event: Event): void {
    let eventNum: any;
    let eTblRow: any;
    let eTblRowData: any;
    let str: string;

    let elementId: string = (event.target as Element).id;

    console.log (elementId);


    str = elementId;
    //do this if the id is of the form "e123"
    eventNum = str.substring(1);
    //populate field with event description
    jQuery("#event-name").text(jQuery("#e"+eventNum).text());
    //populate field with event detail
    jQuery("#event-detail").html(jQuery("#d"+eventNum).html());

    const eventIndex = parseInt(eventNum) - 1;

    this.selectedEvent.id = elementId.substring(1)
    console.log(this.selectedEvent.id)
    this.selectedEvent.attending = this.events[eventIndex]?.attending

    //get row which is parent to <td> which is parent to <a>
    eTblRow = jQuery("#"+str).parent().parent();
    console.log (eTblRow.text());
    //get first table cell in the row
    eTblRowData = eTblRow.find('td');
    //populate field with date
    jQuery("#event-date").text(eTblRowData.html());

    jQuery("#rsvp-event").text(jQuery("#e" + eventNum).text())
    jQuery("#rsvp-date").text(eTblRowData.html())
    jQuery('#currently-attending').text(jQuery('#g' + eventNum).text());

    this.selectedEvent.attending = "1"

    str = jQuery("#d"+eventNum).text();
    if (str.length > 2) {
      jQuery('#detail-popup').modal('toggle');
    }
  }


  public hidePopup() {
    jQuery('#detail-popup').modal('toggle');  
  }

}

