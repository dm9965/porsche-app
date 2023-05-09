import { Component, OnInit, ViewEncapsulation, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { GeteventdetailsService } from '../geteventdetails.service';
import { NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as _moment from 'moment';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'MM/DD/YYYY, hh:mm A'
  },
  display: {
    dateInput: 'MM/DD/YYYY, LT',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

const moment = _moment;

interface Events {
  id: string;
  startdatetime: string;
  enddatetime: string;
  descr: string;
  location: string;
  detail: string;
  attending: string;
}

declare var jQuery: any;


@Component({
  selector: 'app-updatelist',
  templateUrl: './updatelist.component.html',
  styleUrls: ['./updatelist.component.css'],
  providers: [
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  encapsulation: ViewEncapsulation.None  
})
export class UpdatelistComponent {

  constructor(private geteventdetailsService: GeteventdetailsService, private modalService: NgbModal) {}
  
  events: Events[] = [];

  myStartDate = moment();
  myEndDate = moment();
  //@ViewChild('errorTemplate', { read: TemplateRef }) errorTemplate:TemplateRef<any>;
  //@ViewChild('errorTemplate') errorTemplate: ElementRef;

  ngOnInit() {
    
    var s:any;

    this.geteventdetailsService.getEventListDetails();
    this.geteventdetailsService.newListEvent
      .subscribe( 
        events => {
          this.events = events;
          console.log("in list component");
          console.log(this.events);
          if (this.events[0].id === undefined) {
            console.log("Error loading data");
            jQuery('#err-msg').text(this.events[0]);
            jQuery('#errorloading-popup-box').modal("toggle");
            //jQuery('#errorloading-popup-box-div').modal("show");
            //this.modalService.open("", { centered: true });
          }
        }
    )
  }

  public showUpdatePopup(event: Event): void {
    var eventNum: any;
    var eTblRow: any;
    var eTblRowData: any;
    var eTblRowText: string;
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
    eTblRowText = this.decodeHtml(eTblRowData.html());
    eTblRowText = eTblRowText.replace(" @", ",")
    //populate field with start date
    jQuery("#event_startdate").val();
    this.myStartDate = moment(this.decodeHtml(eTblRowText));
    //populate field with end date
    eTblRowData = eTblRow.find('td:eq(1)');
    eTblRowText = this.decodeHtml(eTblRowData.html());
    eTblRowText = eTblRowText.replace(" @", ",")
    jQuery("#event_enddate").val(eTblRowText);
    this.myEndDate = moment(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(2)');
    //populate field with description
    jQuery("#event-name").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(3)');
    //populate field with description
    jQuery("#event-location").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(4)');
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

    eTblRowData = eTblRow.find('td:eq(4)');
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
    var eTblRowData1: any;
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
    eTblRowData = eTblRow.find('td:eq(0)') ;
    eTblRowData1 = eTblRow.find('td:eq(1)') ;

    //populate field with date
    jQuery("#event-date-delete").val(this.decodeHtml(eTblRowData.html()) + " to " + this.decodeHtml(eTblRowData1.html()));

    eTblRowData = eTblRow.find('td:eq(2)');
    //populate field with description
    jQuery("#event-name-delete").val(this.decodeHtml(eTblRowData.html()));

    eTblRowData = eTblRow.find('td:eq(3)');
    //populate field with description
    jQuery("#event-location-delete").val(this.decodeHtml(eTblRowData.html()));

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
