import { Component, OnInit, AfterViewInit, Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { GetlistdataService } from '../getlistdata.service';

declare var jQuery: any;
declare var http: HttpClient;
const req = new XMLHttpRequest();

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

@Component({
  selector: 'app-getlist',
  templateUrl: './getlist.component.html',
  styleUrls: ['./getlist.component.css']

})


@Injectable({ providedIn: 'root' })
export class GetlistComponent implements OnInit {

  @Output() newListEvent = new EventEmitter<Events[]>();
  @Output() newListString = new EventEmitter<string>();

  constructor(private getlistdataService: GetlistdataService) { }

  events: Events[] = [];
  tblText = ""
  
  getEventListHttp() {
    //const options = { responseType : 'text' , Observe : 'response' };

    req.addEventListener("load", this.transferComplete, false);
    req.addEventListener("error", this.transferFailed);
    req.addEventListener("abort", this.transferCanceled);

    req.open("GET", "http://localhost:4200/assets/list.html" , false );
    req.send();
  }

  transferCanceled=(evt:Event) => {
    console.log("The transfer has been canceled by the user.");
    this.newListString.emit("The transfer has been canceled by the user.");
  }

  transferComplete=(evt:Event) => {
    console.log("The Getlist transfer is complete. ") //+ req.responseText);
    console.log(req.response);
    jQuery("#getlist-tbl-div").html(req.response);
    this.tblText = req.response;
    //this.addNewListEvent(this.tblText);    //fire the event
    this.newListString.emit("Test data");
  }
  
  transferFailed=(evt:Event) => {
    console.log("An error occurred while transferring the file.");
    jQuery("#tbl").text("Error occurred while trying to read event list");
    this.tblText = "Error occurred while trying to read event list"
    this.newListString.emit("Error occurred while trying to read event list");
  }

  addNewListEvent(value: string) {
    this.newListString.emit(value);
  }

  getEventListQ() {
    var loadUrl: any;
    var listText: string;
    var thisYear: any;
    var thisYearStr: any;

    loadUrl ="http://localhost:4200/assets/list.html";
    
    thisYear = new Date().getFullYear();
    thisYearStr = "year=" + thisYear;

    // use POST for requesting current year list from database
    //jQuery.post(loadUrl, thisYear,

    // use GET for testing with simple data file
    jQuery.get(loadUrl, 
      function(listText:string) {
             //jQuery("#list-div").html(listText);
             //this.ngZone.run ( fireMyEvent(listText) );
         },
         "html");
  } 


  ngOnInit(){ 
    this.tblText = "initialize in Getlist"    
    //this.getEventListHttp();
    this.getListData();
  }

  ngAfterViewInit(){
    console.log("getlist afterviewinit");
    console.log(jQuery("table").innerHTML)
  }

  getTbl(): string{
    console.log(jQuery("table").innerHTML)
    return jQuery("table").text();
  }

  getListData(): Observable<Events[]> {
    // get raw JSON data and populate component template
    this.getlistdataService.getEventList('a');
    //wait for result from service
    this.getlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("in getlist component");
          console.log(this.events);
          return of(events);
        } 
    )
    return of([]);
  }

}
