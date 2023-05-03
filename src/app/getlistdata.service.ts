import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface Events {
  id: string;
  datetime: string;
  descr: string;
  detail: string;
  attending: string;
}

const myURL = "http://localhost:4200/assets/listdata.json";

@Injectable({
  providedIn: 'root'
})
export class GetlistdataService {
  @Output() newListEvent = new EventEmitter<Events[]>();

  constructor(private http: HttpClient) {  }

  events: Events[] = [];
 
  public getEventList(): Observable<Events[]> {

    this.http.get(myURL, { responseType: 'json' }).subscribe((response) => {
      console.log("in service");
      console.log(response);
      this.newListEvent.emit(response as Events[]); // subscribing to this makes parent wait for data
      // just pass raw JSON to calling component
      return of(response);  
    });
    return of([])
  
  }

}
