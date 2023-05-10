package model;

import java.time.LocalDate;

public class Event {
  private String eventID;
  private String eventName;
  private String eventLocation;
  private String eventDetails;
  private LocalDate eventStartDate;
  private LocalDate eventEndDate;

  public Event (String eventID, String eventName,
                String eventLocation, String eventDetails,
                int eventStartMonth, int eventStartDay,
                int eventStartYear, int eventEndMonth,
                int eventEndDay, int eventEndYear)
  {
    this.eventID = eventID;
    this.eventName = eventName;
    this.eventLocation = eventLocation;
    this.eventDetails = eventDetails;
    this.eventStartDate = LocalDate.of(eventStartYear, eventStartMonth, eventStartDay);
    this.eventEndDate = LocalDate.of(eventEndYear, eventEndMonth, eventEndDay);
  }

  public String getEventID() {
    return eventID;
  }
  public String getEventName() {
    return eventName;
  }
  public String getEventLocation() {
    return eventLocation;
  }
  public String getEventDetails() {
    return eventDetails;
  }
  public LocalDate getEventStartDate() {
    return eventStartDate;
  }
  public LocalDate getEventEndDate() {
    return eventEndDate;
  }

}
