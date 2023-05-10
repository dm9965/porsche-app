import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GetlistdataService } from '../getlistdata.service';


interface Events {
  id: string;
  datetime: string;
  descr: string;
  detail: string;
  attending: string;
}

declare var jQuery: any;

@Component({
  selector: 'app-rsvp-totals',
  templateUrl: './rsvp-totals.component.html',
  styleUrls: ['./rsvp-totals.component.css']
})
export class RsvpTotalsComponent {

  constructor(private getlistdataService: GetlistdataService) {}
  
  public events: Events[] = [];

  ngOnInit() {
    this.getlistdataService.getEventList();
    this.getlistdataService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("in list component");
          console.log(this.events);
          if (this.events[0].id === undefined) {
            // error in loading data!!
            console.log("Error loading data");
            jQuery('#err-msg').text(this.events[0]);
            jQuery('#errorloading-popup-box').modal("toggle");
          }
        }
    )
  }

}
