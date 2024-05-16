import {Component, OnInit} from '@angular/core';
//import { createPopper } from '@popperjs/core';
import { SessionStorageService } from 'ngx-webstorage';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})


export class NavigationComponent {

  constructor(private session: SessionStorageService) { } 

  dropdownOpen = false;
  bLoggedIn = false;


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  closeDropdown() {
    this.dropdownOpen = false;
  }

  updateDropdownVisibility() {
    if (this.session.retrieve('logged_in') == 'Y') this.bLoggedIn = true; 
    //console.log(this.session.retrieve('isLoggedIn') )
    //console.log(this.bLoggedIn )
  }

}
