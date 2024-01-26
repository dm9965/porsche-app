import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { GetlistdataService } from '../getlistdata.service';
import {FormsModule} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {  ActivatedRoute  } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { now } from 'moment';
import { NgFor } from '@angular/common';
import { environment } from '../environments/environment';

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
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {

  s: any;   //query parameter
  sUrl = '';

  constructor(private route: ActivatedRoute, private _snackbar: MatSnackBar) {
  }

  selectedOption: number = 1;

  events: Events[] = [];

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
  d: any;

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      this.s = this.route.snapshot.queryParamMap.get('s');
      this.getEvents();
    });
  }

  getEvents = () => {
    this.sUrl = environment.apiURL + 'events/future';
    console.log(this.s);
    if (this.s == 'p')
    {
      this.sUrl = environment.apiURL + 'events/past';
    }
    fetch(this.sUrl)
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.events = data.sort((a: any, b: any) => {
        const dateA = new Date(a.startdatetime);
        const dateB = new Date(b.startdatetime);
        // @ts-ignore
        return dateA - dateB;
      });
        //console.log('json',data);
        console.log('events',this.events);

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

  rsvpForEvent = () => {
    console.log(this.selectedEvent.id)
    console.log(this.selectedEvent.attending)

    fetch('http://localhost:3001/event/attend', {
      method: 'PUT',
      body: JSON.stringify({
          id: parseInt(this.selectedEvent.id),
          attending: parseInt(this.selectedEvent.attending)
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    }).then(() => {
      this.getEvents()
      this._snackbar.open('You have successfully RSVPed to this event!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
    }).catch((error) => {
      console.log(error)
    })
  }

  cancel = () => {
    fetch(environment.apiURL + 'event/cancel', {
      method: 'PUT',
      body: JSON.stringify({
        id: parseInt(this.selectedEvent.id),
        attending: parseInt(this.selectedEvent.attending)
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    }).then(() => {
      this.getEvents()
      this._snackbar.open('You have successfully cancelled your attendance to this event!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
    }).catch((error) => {
      console.log(error)
    })
  }

  submitForm = () => {
    if (this.selectedOption > 0) {
      this.rsvpForEvent()
    }
    else {
      this.cancel()
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
    jQuery("#event-detail").text(jQuery("#d"+eventNum).text());

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

    str = jQuery("#d"+eventNum).text();
    if (str.length > 2) {
      jQuery('#detail-popup').modal('toggle');
      //jQuery("#detail-popup").css('display', 'block');
    }
  }


  public hidePopup() {
    jQuery("#detail-popup").css('display', 'none');
  }
}

