import { Component, OnInit, ElementRef, Directive} from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import { environment } from '../environments/environment';
import { FetchlistdataService } from '../fetchlistdata.service';
import { Eventinterface } from '../eventinterface';
import { UpdatelistdataService } from '../updatelistdata.service';
import { Responseinterface } from '../responseinterface';


@Directive({selector: 'child'})
class ChildDirective {
}


declare var jQuery: any;
declare var evt: Event;

@Component({
  selector: 'app-rsvp',
  templateUrl: './rsvp.component.html',
  styleUrls: ['./rsvp.component.css']
})

export class RsvpComponent implements OnInit {

  id: any;
  lt: any;
  data = 'initial value';
  //events = [];
  eventId = "";
  eventRadio = "1";
  eventCount = "1";
  saving = false;
  
  constructor(private route: ActivatedRoute, private _snackbar: MatSnackBar, 
    private fetchlistdataService: FetchlistdataService, private updatelistdataService: UpdatelistdataService) { }

  selectedOption: string = "1";

  events: Eventinterface[] = [];

  responseOutput: Responseinterface[] = [];

  showSpinner() {
  }

  ngOnInit(){ 
    console.log("in RSVP");
    //this.spinner.show();
    this.showSpinner();
    this.id = this.route.snapshot.queryParamMap.get('id');
    console.log("Param: id = " + this.id);
    if (!this.id)
    {
      console.log("No query string or parameter is empty");
    } else {
      console.log("id has a value");
      if (!isNaN(this.id)) {
         console.log("id is a number");
         this.eventId = this.id;
         //this.getSelectedEvent(); 
         this.fetchlistdataService.fetchEvent(this.id);
         //wait for result from service
         this.fetchlistdataService.newListEvent
          .subscribe( 
            events => {
              this.events = events;
              console.log("from fetchevent service");
              console.log(this.events);
              if (events.length == 0) {
                //successful call but no data
                //this.spinner.hide();  
              } else {
                  if (this.events[0].errorflag == "ERROR") {
                  var errDet
                  errDet = JSON.parse(JSON.stringify(this.events[0].details));
                  if (this.events[0].id == "SQL") {
                    this.events[0].eventname += errDet.sqlMessage
                  }
                }
                //this.spinner.hide();  
              }  
            } 
          )
      } else {
         console.log("id is not a number");
      }

    }
  }  


  submitForm = () => {
    console.log(this.eventRadio);
    //this.rsvpForEvent();
    this.updatelistdataService.eventRSVP (
      this.eventId, 
      this.eventCount, 
      this.eventRadio
    )
    this.saving = true;
    this.updatelistdataService.newResponseEvent
    .subscribe( 
      responseOutput => {
        this.responseOutput[0] = responseOutput;
        console.log("from updatelist service");
        console.log(this.responseOutput);
        if (this.responseOutput[0].responseError) {
          this.saving = false;
          this._snackbar.open(this.responseOutput[0].responseErrorMsg + " : " + this.responseOutput[0].responseErrorMsgBody,
            'Dismiss', {
            duration: 15000,
            panelClass: ['error_snackbar']
          })
        } else {
            this.saving = false;
            this._snackbar.open(this.responseOutput[0].responseErrorMsg,
              'Dismiss', {
              duration: 5000,
              panelClass: ['success_snackbar']
            })
          }
        }
    )
  }

}
