import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { GlobalConstants } from './globalconstants';
import { environment } from './environments/environment';
import { Eventinterface } from './eventinterface';


@Injectable({
  providedIn: 'root'
})
export class GetlistdataService {

  @Output() newListEvent = new EventEmitter<Eventinterface[]>();

  constructor(private http: HttpClient) {  }

  //const myURL = "http://localhost:4200/assets/listdata.json";
  myURL = 'events/future' //"/assets/listdata.json";

  events: Eventinterface[] = [];
 
  public getEventList(listid:string): Observable<Eventinterface[]> {
    var myFullURL: string;

    switch (listid) {
      case 'f': {
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

    
    if (environment.production) {
      myFullURL = environment.apiURL + this.myURL 
    }
    else {
      myFullURL = environment.apiURL + this.myURL 
    }

    this.http.get(myFullURL, { responseType: 'json' })
    .pipe(
      catchError(
        //err => of([err.message])
        err => of(console.log('HTTP Error', err))
        )
    )
    .subscribe(
      response => 
        {
          console.log("in service");
          console.log(response);
          this.newListEvent.emit(response as Eventinterface[]); // subscribing to this makes parent wait for data
          // just pass raw JSON to calling component
          return of(response);
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );

    return of([])
  
  }

}
