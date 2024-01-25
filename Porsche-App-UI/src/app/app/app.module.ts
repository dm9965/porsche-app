import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomePageComponent } from '../home/home-page.component';
import { LoginComponent } from '../login/login.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { SignUpComponent } from '../login/sign-up/sign-up.component';
import { EventScheduleComponent } from '../event-schedule/event-schedule.component';
import { EventRsvpComponent } from '../event-rsvp/event-rsvp.component';
import { RsvpComponent } from '../rsvp/rsvp.component';
import { RsvpTotalsComponent } from '../rsvp-totals/rsvp-totals.component';
import { AddeventComponent } from '../addevent/addevent.component';
import { GetlistComponent } from '../getlist/getlist.component';
import { UpdatelistComponent } from '../updatelist/updatelist.component';
import { MerchandiseComponent } from '../shop/merchandise.component';
import { LoaderrorComponent } from '../loaderror/loaderror.component';
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { CartComponent } from '../shop/cart/cart.component';
import { CheckoutComponent } from '../shop/cart/checkout/checkout.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MaterialModule } from './material/material.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    CalendarComponent,
    SignUpComponent,
    EventScheduleComponent,
    EventRsvpComponent,
    RsvpComponent,
    RsvpTotalsComponent,
    AddeventComponent,
    GetlistComponent,
    UpdatelistComponent,
    MerchandiseComponent,
    LoaderrorComponent,
    CartComponent,
    CheckoutComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    MatFormFieldModule,
    NgbModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    NgxMatTimepickerModule,
    MatInputModule,
    MatDatepickerModule,
    NgxMatMomentModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
