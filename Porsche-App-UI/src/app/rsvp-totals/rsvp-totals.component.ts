import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from '../environments/environment';
import { FetchlistdataService } from '../fetchlistdata.service';
import { Eventinterface } from '../eventinterface';
import { transformMenu } from '@angular/material/menu';


declare var jQuery: any;

@Component({
  selector: 'app-rsvp-totals',
  templateUrl: './rsvp-totals.component.html',
  styleUrls: ['./rsvp-totals.component.css']
})
export class RsvpTotalsComponent {

  constructor(private fetchlistdataService: FetchlistdataService) {}
  error: boolean = false;

  public events: Eventinterface[] = [];


  getRsvpLink(event: Event) {
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

    //get row which is parent to <td> which is parent to <a>
    eTblRow = jQuery("#"+str).parent().parent();
    console.log (eTblRow.text());
    //get first table cell in the row
    eTblRowData = eTblRow.find('td');
    //populate field with date
    jQuery("#event-date").text(eTblRowData.html());

    jQuery("#event-link").val("Click <a href='" + environment.uiURL + "#/rsvp?id=" + eventNum + "' style='font-weight:bold;color:red;text-decoration:underline;'>HERE</a> to RSVP");
    jQuery("#event-link-url").val(environment.uiURL + "#/rsvp?id=" + eventNum );

    jQuery('#link-popup').modal("toggle");
  }

  ngOnInit() {
    this.fetchlistdataService.fetchEventList('t'); //gets totals data from the service
    //wait for result from service
    this.fetchlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("from fetchlist service");
          console.log(this.events);
          if (events.length == 0) {
            //successful call but no data available
          } else {
            if (this.events[0].errorflag == "ERROR") {
              var errDet
              errDet = JSON.parse(JSON.stringify(this.events[0].details));
              if (this.events[0].id == "SQL") {
                this.events[0].eventname = "Database ERROR: " + errDet.sqlMessage
              }
              this.error = true;
            }
          }
        } 
      )
    if (this.error) {
      console.log('Error fetching data from database!')
      jQuery('#err-msg').text(this.events[0]);
      jQuery('#errorloading-popup-box').modal("toggle");
    }
  }
}
