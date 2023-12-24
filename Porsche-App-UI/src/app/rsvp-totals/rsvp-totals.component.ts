import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GetlistdataService } from '../getlistdata.service';


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
    fetch('http://localhost:3001/events/all')
      .then((response) => {
        return response.json();
      }).then((data) => {
        this.error = false;
      this.events = data.sort((a: any, b: any) => {
        const dateA = new Date(a.startdatetime);
        const dateB = new Date(b.startdatetime);
        // @ts-ignore
        return dateA - dateB;
      });
      console.log(data)
      if (this.events[0].id === undefined) {
        // error in loading data!!
        console.log("Error loading data");
      }
    }).catch((error) => {
      this.error = true;
      console.log(error)
    })
  }


  ngOnInit() {
    this.getEvents()
    if (this.error) {
      jQuery('#err-msg').text(this.events[0]);
      jQuery('#errorloading-popup-box').modal("toggle");
    }
  }
}
