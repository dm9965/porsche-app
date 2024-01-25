import {Component, ElementRef, ViewChild} from '@angular/core';
//import { createPopper } from '@popperjs/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  //@ViewChild('dropdownMenu', { static: false }) dropdownMenu: ElementRef | undefined;
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  closeDropdown() {
    this.dropdownOpen = false;
  }

}
