import { Component } from '@angular/core';

interface Events {
  id: string;
  startdatetime: string;
  enddatetime: string;
  eventname: string;
  location: string;
  details: string;
  attending: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  events: Events[] = []
  constructor() {}

  ngOnInit = () => {
    this.getEvents()
  }

  getEvents = () => {
    fetch('http://localhost:3001/events/all')
      .then((response) => {
        return response.json()
      }).then((data) => {
        this.events = data
    }).catch((error) => {
      console.log(error)
    })
  }
}


