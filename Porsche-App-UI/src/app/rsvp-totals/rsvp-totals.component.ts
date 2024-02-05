import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GetlistdataService } from '../getlistdata.service';
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
  selector: 'app-rsvp-totals',
  templateUrl: './rsvp-totals.component.html',
  styleUrls: ['./rsvp-totals.component.css']
})
export class RsvpTotalsComponent {

  constructor() {}
  error: boolean = false;

  public events: Events[] = [];

  getEvents = () => {
    fetch(environment.apiURL + 'events/totals')
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.error = false;
        // use descending sort
        this.events = data.sort((a: any, b: any) => {
        const dateA = new Date(a.startdatetime);
        const dateB = new Date(b.startdatetime);
        // @ts-ignore
        return dateB - dateA;
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
      this.error = true;
      console.log(error)
    })
  }

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
    this.getEvents()
    if (this.error) {
      jQuery('#err-msg').text(this.events[0]);
      jQuery('#errorloading-popup-box').modal("toggle");
    }
  }
}
