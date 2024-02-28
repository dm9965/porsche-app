import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { GlobalConstants } from './globalconstants';
import { environment } from './environments/environment';
import { Eventinterface } from './eventinterface';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FetchlistdataService {

  @Output() newListEvent = new EventEmitter<Eventinterface[]>();

  constructor(private http: HttpClient, private datePipe: DatePipe) {  }

  myURL = 'events/future'

  events: Eventinterface[] = [];

  errorEvent =  {
    id: '',
    startdatetime: '',
    enddatetime: '',
    eventname: '',
    location: ' FetchlistdataService.fetchEventList ',
    details: '',
    attending: '',
    startday: '1',
    endday: '1',
    errorflag: 'ERROR'
  } as Eventinterface

  errorEventOutput: Eventinterface[] = [];

  sData: string = "";

  fetchEventList(listid:string): Observable<Eventinterface[]> {

    var myFullURL: string;

    switch (listid) {
      case 'u': {
        this.myURL = 'events/future';
        break;
      }
      case 'p': {
        this.myURL = 'events/past';
        break;
      }
      case 't': {
        this.myURL = 'events/totals';
        break;
      }
      default: {
        this.myURL = 'events/all';
      }
    }
     
    //if (environment.production) {
      myFullURL = environment.apiURL + this.myURL;
    //} else {
    //  myFullURL = environment.apiURL + this.myURL; 
    //}

    //console.log(myFullURL);

    fetch(myFullURL)
      .then((response) => {
        return response.json();
      }).then((data) => {
          // sorting being done in the SQL queries, not here
          //this.events = data.sort((a: any, b: any) => {
          //const dateA = new Date(a.startdatetime);
          //const dateB = new Date(b.startdatetime);n
          // @ts-ignore
          //return dateA - dateB;
          //});
          this.sData = JSON.stringify(data); 
        if (this.sData.search("sqlMessage") > 0) {
          console.log("in FetchList Data handler with SQL error")
          //process SQL errors here:
          const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
          if (currentDateAndTime != null) {
            this.errorEvent.startdatetime = currentDateAndTime;
            //this.errorEvent.enddatetime = currentDateAndTime;
          }
          this.errorEvent.id = "SQL";
          this.errorEvent.eventname = "Database ERROR: ";
          this.errorEvent.details = JSON.parse(this.sData);
          this.errorEventOutput[0] = this.errorEvent
          this.newListEvent.emit(this.errorEventOutput as Eventinterface[]); // subscribing to this makes parent wait for data
        
        } else {  

          console.log("in FetchList data handler, no error")
          this.events = JSON.parse(JSON.stringify(data)); 
          //console.log('json',data);
          console.log('events',this.events);
          //do this so we can differentiate between one day events and multiple day events
          for (let event of this.events) {
            const a = new Date(event.enddatetime);
            event.endday = a.getDay().toString();
            const b = new Date(event.startdatetime);
            event.startday = b.getDay().toString();
            //console.log('start',event.startday);
            //console.log('end',event.endday);
            event.errorflag = '';
          }
          
          if (this.events[0] === undefined) {
            // no data or error in loading data!!
            console.log("Error loading data");
          }

          this.newListEvent.emit(this.events as Eventinterface[]); // subscribing to this makes parent wait for data
          // just pass raw JSON to calling component
        }

        return of(this.events);
      
      }).catch((error) => {
        //process other errors here:
        console.log("in FetchList error handler")
        console.log(error)
        const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        if (currentDateAndTime != null) {
          this.errorEvent.startdatetime = currentDateAndTime;
          //this.errorEvent.enddatetime = currentDateAndTime;
        }
        this.sData = JSON.stringify(error); 
        if (this.sData.search("sqlMessage") > 0) {
          console.log("in FetchList SQL error handler")
          this.errorEvent.errorflag = "ERROR";
          this.errorEvent.id = "SQL";
          this.errorEvent.eventname = "Database ERROR: ";
          this.errorEvent.details = JSON.parse(this.sData);
          this.errorEventOutput[0] = this.errorEvent
        } else {
          this.errorEvent.errorflag = "ERROR";
          this.errorEvent.eventname = "HTTP ERROR: " + error.message;
          this.errorEvent.details = error;
        }
        this.errorEventOutput[0] = this.errorEvent
        this.newListEvent.emit(this.errorEventOutput as Eventinterface[]); 
    })

    return of([])

  }


  // get one single event for RSVP page
  fetchEvent(eventid:string): Observable<Eventinterface[]> {
    fetch(environment.apiURL + 'event/select?' + new URLSearchParams("id=" + eventid).toString()
    ).then((response) => {
      console.log("in response");
        //console.log(response.json());
        return response.json();
      }).then((data) => {
        console.log("in data");
        this.events = JSON.parse(JSON.stringify(data)); 
        console.log(data)
        this.sData = JSON.stringify(data); 
        if (this.sData.search("sqlMessage") > 0) {
          console.log("in FetchList Data handler with SQL error")
          //process SQL errors here:
          const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
          if (currentDateAndTime != null) {
            this.errorEvent.startdatetime = currentDateAndTime;
            //this.errorEvent.enddatetime = currentDateAndTime;
          }
          this.errorEvent.id = "SQL";
          this.errorEvent.eventname = "Database ERROR";
          this.errorEvent.details = JSON.parse(this.sData);
          this.errorEventOutput[0] = this.errorEvent
          this.newListEvent.emit(this.errorEventOutput as Eventinterface[]); // subscribing to this makes parent wait for data
        
        } else {  

        this.newListEvent.emit(this.events as Eventinterface[]); // subscribing to this makes parent wait for data
        // just pass raw JSON to calling component
        }
        return of(this.events);

      }).catch((error) => {
        console.log(error)
        const currentDateAndTime = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        if (currentDateAndTime != null) {
          this.errorEvent.startdatetime = currentDateAndTime;
          //this.errorEvent.enddatetime = currentDateAndTime;
        }
        this.errorEvent.eventname = "ERROR: " + error.message;
        this.errorEvent.details = error;
        this.errorEventOutput[0] = this.errorEvent
        this.newListEvent.emit(this.errorEventOutput as Eventinterface[]); // subscribing to this makes parent wait for data
    })

    return of([])

  }

}
