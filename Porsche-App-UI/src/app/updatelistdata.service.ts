import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { GlobalConstants } from './globalconstants';
import { environment } from './environments/environment';
import { Eventinterface } from './eventinterface';
import { Responseinterface } from './responseinterface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UpdatelistdataService {

  @Output() newResponseEvent = new EventEmitter<Responseinterface>();

  constructor(private http: HttpClient, private datePipe: DatePipe) { }
  
  responseOutput = { } as Responseinterface;

  msg = "";


eventRSVP(id:string, attending:string, Option:string): Observable<Responseinterface> {

  var myFullURL
  if (Option == "1") {
    myFullURL = environment.apiURL + 'event/attend';
  } else {
    myFullURL = environment.apiURL + 'event/cancel';
  }

  fetch(myFullURL, {
    method: 'PUT',
    body: JSON.stringify({
        id: parseInt(id),
        attending: parseInt(attending)
    }),
    headers: {
      "Content-type":"application/json; charset=UTF-8"
    }
  }).then((response) => {
    this.responseOutput.responseStatus = response.status
    this.responseOutput.responseError = false 
    if (response.status == 500) { 
      this.responseOutput.responseError = true 
      this.responseOutput.responseErrorMsg = response.statusText
    }
    return response.json()
  }).then((data) => {
    console.log('update response', data)
    if (this.responseOutput.responseError) {
      this.responseOutput.responseErrorMsgBody = JSON.stringify(data);
      if (this.responseOutput.responseErrorMsgBody.search("sqlMessage") > 0) {
        this.responseOutput.responseErrorMsg += " DATABASE: "
      }
    }
  }).then(() => {
    if (this.responseOutput.responseError) {
      this.msg ='RSVP process failed! ' + this.responseOutput.responseErrorMsg + ': ' + this.responseOutput.responseErrorMsgBody
      this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
    } else {
      if (Option == "1") {
        this.msg = 'You have successfully RSVPed to this event!'
      } else {
        this.msg = 'You have successfully cancelled your attendance to this event!'
      }
      this.responseOutput.responseErrorMsg = this.msg
      this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
    }  
    return of(this.responseOutput);

  }).catch((error) => {
    console.log(error)
    console.log('in service RSVP error handler')
    this.responseOutput.responseError = true 
    this.responseOutput.responseErrorMsg ='RSVP process failed! ' + error.message
    this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
})

  return of(this.responseOutput);

}


eventAddUpdateDelete(id: string, startdatetime: string, enddatetime: string, eventname: string, location: string, details: string, action:string): Observable<Responseinterface> {

  var myFullURL
  var fetchBody
  var fetchMethod

  if (action == "ADD") {
    myFullURL = environment.apiURL + 'event/create';
    fetchMethod = 'POST';
    fetchBody = JSON.stringify({
      startdatetime: startdatetime,
      enddatetime: enddatetime,
      eventname: eventname,
      location: location,
      details: details,
    });
  } else if (action == "UPDATE") {
    myFullURL = environment.apiURL + 'event/update';
    fetchMethod = 'PUT';
    fetchBody = JSON.stringify({
      startdatetime: startdatetime,
      enddatetime: enddatetime,
      eventname: eventname,
      location: location,
      details: details,
      id: id,
    });
  } else if (action == 'DELETE') {
    myFullURL = environment.apiURL + 'event/delete';
    fetchMethod = 'DELETE';
    fetchBody = JSON.stringify({
      id: id,
    });
  } else {
    return of(this.responseOutput);
  }

  fetch(myFullURL, {
    method: fetchMethod,
    body: fetchBody,
    headers: {
      "Content-type":"application/json; charset=UTF-8"
    }
  }).then((response) => {
    this.responseOutput.responseStatus = response.status
    this.responseOutput.responseError = false 
    if (response.status == 500) { 
      this.responseOutput.responseError = true 
      this.responseOutput.responseErrorMsg = response.statusText
    }
    return response.json()
  }).then((data) => {
    console.log('update response', data)
    if (this.responseOutput.responseError) {
      this.responseOutput.responseErrorMsgBody = JSON.stringify(data);
      if (this.responseOutput.responseErrorMsgBody.search("sqlMessage") > 0) {
        this.responseOutput.responseErrorMsg += " DATABASE: "
      }
    }
  }).then(() => {
    if (this.responseOutput.responseError) {
      this.msg ='Add/Update/Delete process failed! ' + this.responseOutput.responseErrorMsg + ': ' + this.responseOutput.responseErrorMsgBody
      this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
    } else {
      if (action == "ADD") {
        this.msg = 'You have successfully added this event!'
      } else if (action == "UPDATE") {
        this.msg = 'You have successfully updated this event!'
      } else {
        this.msg = 'You have successfully deleted this event!'
      }
      this.responseOutput.responseErrorMsg = this.msg
      this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
    }  
    return of(this.responseOutput);

  }).catch((error) => {
    console.log(error)
    console.log('in service  error handler')
    this.responseOutput.responseError = true 
    this.responseOutput.responseErrorMsg ='Add/Update/Delete process failed! ' + error.message
    this.newResponseEvent.emit(this.responseOutput as Responseinterface); 
})

  return of(this.responseOutput);

}



}
