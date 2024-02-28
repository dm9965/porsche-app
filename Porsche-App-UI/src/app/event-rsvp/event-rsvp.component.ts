import { Component, OnInit, ElementRef, Directive, AfterViewInit} from '@angular/core'
import { ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { GetlistdataService } from '../getlistdata.service';
import { FetchlistdataService } from '../fetchlistdata.service';

import { waitForAsync } from '@angular/core/testing';

import { FormControl, FormGroup, Validators } from '@angular/forms';


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
  startday: string;
  endday: string;
}


declare var jQuery: any;
declare var evt: Event;
declare var http: HttpClient;
const req = new XMLHttpRequest();
  
@Component({
  selector: 'app-event-rsvp',
  templateUrl: './event-rsvp.component.html',
  styleUrls: ['./event-rsvp.component.css']
})

export class EventRsvpComponent implements OnInit, AfterViewInit {

  lt: any;
  data = 'initial value';
  anchors = [];
  eventId = "";
  eventRadio = "1";
  eventCount = "";

  constructor(private http: HttpClient, private getlistdataService: GetlistdataService,
    private fetchlistdataService: FetchlistdataService,
    private elementRef:ElementRef){
      this.elementRef = elementRef; 
  }

  events: Events[] = [];
  
  ngOnInit(){ 
    // get raw JSON data and populate component template
    //this.getlistdataService.getEventList('p'); //gets data from the service
    this.fetchlistdataService.fetchEventList('p'); //gets data from the service
    //wait for result from service
    //this.getlistdataService.newListEvent
    this.fetchlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("from fetchlist service");
          console.log(this.events);
        } 
    )
    this.setListeners();
  }


  ngAfterViewInit() {
    console.log('events', this.events)
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.showPopup);
    })
  } 

  
  showPopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;
    
    let elementId: string = (event.target as Element).id;
    console.log (elementId);
    
    str = elementId;
    //do this if the id is of the form "e123"
    eventNum = str.substring(1);

    //jQuery("#popup-box").css('display', 'block');
    jQuery('#popup-box').modal('toggle');

    //populate form field with event description
    jQuery("#event-name").text(jQuery("#e"+eventNum).text());   
    
    //get row which is parent to <td> which is parent to <a>
    eTblRow = jQuery("#"+str).parent().parent();  
    console.log (eTblRow.text());
    //get first table cell in the row
    eTblRowData = eTblRow.find('td');
    //populate form field with date
    jQuery("#event-date").text(eTblRowData.html());

    //populate field with event unique identifier
    this.eventId = eventNum;
    this.eventCount = "1";
    this.eventRadio = "1";
  }

  submitRSVP() {

    console.log(this.eventId);
    console.log(this.eventRadio);
    console.log(this.eventCount);

    if (this.eventRadio == "1" ) {
      console.log("Add " + this.eventCount + " to event id=" + this.eventId)
      // submit to backend

    } else {  
      // Question: ignore this situation or consider it a cancellation????
      console.log("Cancel " + this.eventCount + " for event id=" + this.eventId)
      // submit to backend, maybe???
      
    }

  }

  public hidePopup() {
    jQuery('#popup-box').modal('hide');
    //jQuery("#popup-box").css('display', 'none');
  }


  setListeners() {
    console.log("setting listeners");
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.showPopup);
    })
  }


} 