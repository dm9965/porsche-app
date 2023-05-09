import { Component, OnInit, ElementRef, Directive, AfterViewInit} from '@angular/core'
import { ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { GetlistComponent } from '../getlist/getlist.component';
import { GetlistdataService } from '../getlistdata.service';

import { waitForAsync } from '@angular/core/testing';
import { SafeValue, SafeHtml, SafeUrl, SafeStyle, SafeScript, SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Directive({selector: 'child'})
class ChildDirective {
}

interface Events {
  id: string;
  datetime: string;
  descr: string;
  detail: string;
  attending: string;
}

declare var jQuery: any;
declare var evt: Event;
declare var http: HttpClient;
const req = new XMLHttpRequest();
declare var child: GetlistComponent;
  
@Component({
  selector: 'app-event-rsvp',
  templateUrl: './event-rsvp.component.html',
  styleUrls: ['./event-rsvp.component.css']
})

export class EventRsvpComponent implements OnInit, AfterViewInit {

  listTableHtml : SafeHtml | undefined  //string | undefined;
  lt: any;
  data = 'initial value';
  anchors = [];
  eventId = "";
  eventRadio = "1";
  eventCount = "";

  constructor(private http: HttpClient, private getlist:GetlistComponent, private getlistdataService: GetlistdataService,
    private elementRef:ElementRef, private sanitizer: DomSanitizer){
      this.elementRef = elementRef; 
  }

  events: Events[] = [];
  
  @ViewChild(GetlistComponent) child!: GetlistComponent;
  @ViewChildren('dummyNot') myDiv!:QueryList<ElementRef>;

  ngAfterViewInit() {
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.showPopup);
    })
  } 

  ngOnInit(){ 
    this.getListData(); //gets data from the service, all the other stuff was experimental
    this.setListeners();
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
      
    }

  }

  public hidePopup() {
    jQuery('#popup-box').modal('hide');
    //jQuery("#popup-box").css('display', 'none');
  }

  public getEventListX() {

    req.addEventListener("load", this.transferComplete, false);
    req.addEventListener("error", this.transferFailed);
    req.addEventListener("abort", this.transferCanceled);

    req.open("GET", "http://localhost:4200/assets/list.html" , false );
    req.send();
  }

  transferCanceled(evt:Event) {
    console.log("The transfer has been canceled by the user.");
  }

  transferComplete(evt:Event) {
    console.log("The transfer is complete. ")
    this.listTableHtml = this.sanitizer.bypassSecurityTrustHtml(req.response);
    console.log(req.response);
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.showPopup);
    })
  }
  
  transferFailed(evt:Event) {
    console.log("An error occurred while transferring the file.");
    jQuery("#tbl").text("Error occurred");
  }
  
  getListData() {
    this.getlistdataService.getEventList();
    this.getlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("in getListData in event-list component");
          console.log(this.events);   
          this.setListeners();
        } 
    )
  }

  setListeners() {
    console.log("setting listeners");
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor: HTMLAnchorElement) => {
      anchor.addEventListener('click', this.showPopup);
    })
  }


} 