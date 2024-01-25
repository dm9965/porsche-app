import { Component, OnInit, ElementRef, Directive, AfterViewInit} from '@angular/core'
import { ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
//import 'rxjs/add/operator/filter';
import {MatSnackBar} from "@angular/material/snack-bar";


import { GetlistComponent } from '../getlist/getlist.component';
import { GetlistdataService } from '../getlistdata.service';

import { waitForAsync } from '@angular/core/testing';
import { SafeValue, SafeHtml, SafeUrl, SafeStyle, SafeScript, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Directive({selector: 'child'})
class ChildDirective {
}

interface Events {
  id: string;
  startdatetime: string;
  enddatetime: string;
  eventname: string;
  location: string;
  details: string;
  attending: string;
}

declare var jQuery: any;
declare var evt: Event;
declare var http: HttpClient;
const req = new XMLHttpRequest();
declare var child: GetlistComponent;

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})

export class RsvpComponent implements OnInit, AfterViewInit {

  id: any;
  lt: any;
  data = 'initial value';
  //events = [];
  eventId = "";
  eventRadio = "1";
  eventCount = "";  
  
  constructor(private route: ActivatedRoute, private _snackbar: MatSnackBar) { }

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
  }

  ngOnInit(){ 
    console.log("in RSVP");
    this.id = this.route.snapshot.queryParamMap.get('id');
    console.log("Param: id = " + this.id);
    if (!this.id)
    {
      console.log("No query string or parameter is empty");
    } else {
      console.log("id has a value");
      if (!isNaN(this.id)) {
         console.log("id is a number");
         this.eventId = this.id;
         this.getSelectedEvent(); 
         console.log(this.events);
      } else {
         console.log("id is not a number");
      }

    }
  }  

  ngAfterViewInit() {
  }

  getSelectedEvent = () => {
    fetch('http://localhost:3001/event/select?' + new URLSearchParams("id=" + this.id).toString()
    ).then((response) => {
      console.log("in response");
        //console.log(response.json());
        return response.json();
      }).then((data) => {
        console.log("in data");
        this.events = data.sort((a: any, b: any) => {
          const dateA = new Date(a.startdatetime);
          const dateB = new Date(b.startdatetime);
          // @ts-ignore
          return dateA - dateB;
        });
        console.log(data)
        //if (this.events[0].id === undefined) {
          // error in loading data!!
          //console.log("Error loading data");
        //}
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
          id: parseInt(this.eventId),
          attending: parseInt(this.eventCount)
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    }).then(() => {
      //this.getEvents()
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
    fetch('http://localhost:3001/event/cancel', {
      method: 'PUT',
      body: JSON.stringify({
        id: parseInt(this.eventId),
        attending: parseInt(this.eventCount)
    }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      console.log(data)
    }).then(() => {
      //this.getEvents()
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
    console.log(this.eventRadio);
    if (this.eventRadio == "1") {
      this.rsvpForEvent()
    }
    else {
      this.cancel()
    }
  }

}
