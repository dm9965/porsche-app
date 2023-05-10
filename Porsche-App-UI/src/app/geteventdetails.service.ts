import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { GlobalConstants } from './globalconstants';
import { environment } from './environments/environment';

interface Events {
  id: string;
  startdatetime: string;
  enddatetime: string;
  descr: string;
  location: string;
  detail: string;
  attending: string;
}

//const myURL = "http://localhost:4200/assets/listdata.json";
const myURL = "/assets/eventdetails.json";

@Injectable({
  providedIn: 'root'
})

export class GeteventdetailsService {

  @Output() newListEvent = new EventEmitter<Events[]>();

  constructor(private http: HttpClient) {  }

  events: Events[] = [];
 

  public getEventListDetails(): Observable<Events[]> {
    var myFullURL: string;

    // use this if absolute addressing is needed
    if (environment.production) {
      myFullURL = GlobalConstants.apiProdURL + myURL 
    }
    else {
      myFullURL = GlobalConstants.apiDevURL + myURL 
    }
    // otherwise use this if relative addressing is OK
    myFullURL = "." + myURL 

    this.http.get(myURL, { responseType: 'json' })
    .pipe(
      catchError(
        err => of([err.message])
        )
    )
    .subscribe(
      response => 
        {
          console.log("in service");
          console.log(response);
          this.newListEvent.emit(response as Events[]); // subscribing to this makes parent wait for data
          // just pass raw JSON to calling component
          return of(response);
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
    return of([])
  
  }

  public getEventListDetailsVersion1(): Observable<Events[]> {
    //
    // this version superceded by version with error handling
    //
    var myFullURL: string;

    // use this if absolute addressing is needed
    if (environment.production) {
      myFullURL = GlobalConstants.apiProdURL + myURL 
    }
    else {
      myFullURL = GlobalConstants.apiDevURL + myURL 
    }
    // otherwise use this if relative addressing is OK
    myFullURL = "." + myURL 

      this.http.get(myURL, { responseType: 'json' }).subscribe((response) => 
      {
        console.log("in service");
        console.log(response);
        this.newListEvent.emit(response as Events[]); // subscribing to this makes parent wait for data
        // just pass raw JSON to calling component
        return of(response);
      });
    
    return of([])
    
  }
  
}
