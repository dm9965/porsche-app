import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router"
import {HomePageComponent} from "../home/home-page.component";
import {LoginComponent} from "../login/login.component";
import {CalendarComponent} from "../calendar/calendar.component";
import {EventScheduleComponent} from "../event-schedule/event-schedule.component";
import {EventRsvpComponent} from "../event-rsvp/event-rsvp.component";
import {RsvpTotalsComponent} from "../rsvp-totals/rsvp-totals.component";
import {UpdatelistComponent} from "../updatelist/updatelist.component";
import {AddeventComponent} from "../addevent/addevent.component";
import {MerchandiseComponent} from "../shop/merchandise.component";
import {InventoryComponent} from "../inventory/inventory.component";
import {SignUpComponent} from "../login/sign-up/sign-up.component";
import {CartComponent} from "../shop/cart/cart.component";
import {CheckoutComponent} from "../shop/cart/checkout/checkout.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomePageComponent},
  {path: 'shop', component: MerchandiseComponent},
  {path: 'login', component: LoginComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'event-schedule', component: EventScheduleComponent},
  {path: 'event-rsvp', component: EventRsvpComponent},
  {path: 'rsvp-totals', component: RsvpTotalsComponent},
  {path: 'update-list', component: UpdatelistComponent},
  {path: 'addevent', component: AddeventComponent},
  {path: 'inventory', component: InventoryComponent},
  {path: 'cart', component: CartComponent},
  {path: 'login/signup', component: SignUpComponent},
  {path: 'checkout', component: CheckoutComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
