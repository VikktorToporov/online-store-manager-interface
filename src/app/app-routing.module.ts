import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Home', component: LandingComponent },
  { path: 'Item/Details/:id', component: ItemDetailsComponent },
  { path: 'Cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
