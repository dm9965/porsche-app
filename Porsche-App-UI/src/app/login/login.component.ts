import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import { environment } from '../environments/environment';
//import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import {NgxWebstorageModule, SessionStorageService} from 'ngx-webstorage';

interface Users {
  email: string;
  password: string;
  user_name: string;
}


declare var jQuery: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  constructor (private route: ActivatedRoute, private _snackbar: MatSnackBar, private session: SessionStorageService) {}

  email = "";
  pwd = "";

  users: Users[] = [];

  thisUser : Users = {
    email: '',
    password: '',
    user_name: ''
  }

  getLogin  = () => {
    this.email = jQuery("#email").val();
    this.pwd = jQuery("#pwd").val();
    //console.log('email='+this.email)

    fetch(environment.apiURL + 'users/login', {
    method: 'POST',
    body: JSON.stringify({
        email: this.email,
        password: this.pwd
    }),
    headers: {
      "Content-type":"application/json; charset=UTF-8"
    }
    }).then((response) => {
      //console.log('response',response);
      return response.json()
    }).then((data) => {
      this.thisUser = data[0];
      //console.log('data',this.thisUser)
    }).then(() => {
      
      //console.log('thisUser',this.thisUser)
      if (this.thisUser === undefined) {
        this.session.clear('logged_in');
        this._snackbar.open('Login Failed!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['error_snackbar']
        })
      } else {
        this.session.store('logged_in', 'Y');
        this._snackbar.open('Login Successful!',
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
        // now set session variables


      }
 
  }).catch((error) => {
    console.log(error)
  })
}
}

