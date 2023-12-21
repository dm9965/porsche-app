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
  selector: 'app-event-schedule',
  templateUrl: './event-schedule.component.html',
  styleUrls: ['./event-schedule.component.scss']
})
export class EventScheduleComponent {

  constructor(private getlistdataService: GetlistdataService) {}

  events: Events[] = [];

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
            //this.modalService.open("", { centered: true });
          }
        }
    )

  }

  public showPopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;

    let elementId: string = (event.target as Element).id;
    console.log (elementId);

    str = elementId;
    //do this if the id is of the form "e123"
    eventNum = str.substring(1);
    //populate field with event description
    jQuery("#event-name").text(jQuery("#e"+eventNum).text());
    //populate field with event detail
    jQuery("#event-detail").text(jQuery("#d"+eventNum).text());

    //get row which is parent to <td> which is parent to <a>
    eTblRow = jQuery("#"+str).parent().parent();
    console.log (eTblRow.text());
    //get first table cell in the row
    eTblRowData = eTblRow.find('td');
    //populate field with date
    jQuery("#event-date").text(eTblRowData.html());

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
