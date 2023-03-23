import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router"
import {HomePageComponent} from "./home/home-page.component";
import {LoginComponent} from "./login/login.component";
import {MerchandiseComponent} from "./shop/merchandise.component";
import {InventoryComponent} from "./inventory/inventory.component";
import {SignUpComponent} from "./login/sign-up/sign-up.component";
import {CartComponent} from "./shop/cart/cart.component";
import {CheckoutComponent} from "./shop/cart/checkout/checkout.component";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomePageComponent},
  {path: 'shop', component: MerchandiseComponent},
  {path: 'login', component: LoginComponent},
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
