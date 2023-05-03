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
  selector: 'app-updatelist',
  templateUrl: './updatelist.component.html',
  styleUrls: ['./updatelist.component.css']
})
export class UpdatelistComponent {

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
        }
    )
  }

  public showUpdatePopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;
    
    let elementId: string = (event.target as Element).id;
    console.log (elementId);
    
    str = elementId;
    //do this because the id is of the form "edit123"
    eventNum = str.substring(4);
    
    //get row which is parent to <td> which is parent to <button>
    eTblRow = jQuery("#"+str).parent().parent();  
    console.log (eTblRow.text());

    //get first table cell in the row
    eTblRowData = eTblRow.find('td:eq(0)');
    //populate field with date
    jQuery("#event-date").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(1)');
    //populate field with description
    jQuery("#event-name").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(2)');
    eTblRowData = eTblRowData.find("div").text();
    //console.log (eTblRowData);
    jQuery("#event-details").val(this.decodeHtml(eTblRowData));

    //populate field with event unique identifier
    jQuery("#uid").val(eventNum);


    // show the pop-up
    jQuery('#update-popup-box').modal('toggle');
  }


   public showDetailsPopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;
    
    let elementId: string = (event.target as Element).id;
    console.log (elementId);
    
    str = elementId;
    //do this because the id is of the form "d123"
    eventNum = str.substring(1);
    
    //get row which is parent to <td> which is parent to <button>
    eTblRow = jQuery("#"+str).parent().parent();  
    console.log (eTblRow.text());

    eTblRowData = eTblRow.find('td:eq(2)');
    eTblRowData = eTblRowData.find("div").text();
    console.log (eTblRowData);
    jQuery("#event-details-show").val(eTblRowData);

    // show the pop-up
    jQuery('#details-popup-box').modal('toggle');
  }


  public showDeletePopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var str: string;
    
    let elementId: string = (event.target as Element).id;
    console.log (elementId);
    
    str = elementId;
    //do this because the id is of the form "delete123"
    eventNum = str.substring(6);
    
    //get row which is parent to <td> which is parent to <button>
    eTblRow = jQuery("#"+str).parent().parent();  
    console.log (eTblRow.text());

    //get first table cell in the row
    eTblRowData = eTblRow.find('td:eq(0)');
    //populate field with date
    jQuery("#event-date-delete").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(1)');
    //populate field with description
    jQuery("#event-name-delete").val(this.decodeHtml(eTblRowData.html()));

    //populate field with event unique identifier
    jQuery("#uid-delete").val(eventNum);


    // show the pop-up
    jQuery('#delete-popup-box').modal('toggle');
  }



  decodeHtml(html:string):string {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

}
