import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import { environment } from '../environments/environment';
//import { SessionStorage, SessionStorageService } from 'ngx-webstorage';
import {NgxWebstorageModule, SessionStorageService} from 'ngx-webstorage';
import { Responseinterface } from './../responseinterface';
import { Form, NgForm } from '@angular/forms';


interface Users {
  email: string;
  password: string;
  user_name: string;
}

declare var jQuery: any;

@Component({
  selector: 'app-addusers',
  standalone: false,
  templateUrl: './addusers.component.html',
  styleUrl: './addusers.component.css'
})
export class AddusersComponent {

  constructor (private route: ActivatedRoute, private _snackbar: MatSnackBar, private session: SessionStorageService) {}

  responseOutput = { } as Responseinterface;

  msg = "";

  email = "";
  pwd = "";
  username = "";

  users: Users[] = [];

  thisUser : Users = {
    email: '',
    password: '',
    user_name: ''
  }

  isLoggedIn = '';

  ngAfterViewInit() {

    this.isLoggedIn = this.session.retrieve('logged_in');
    //console.log('logged in=', this.isLoggedIn);

    if (this.isLoggedIn == 'Y') {
      //good to go
    } else {
      this._snackbar.open('You must be logged in as an Admin to access this functionality',
      'Dismiss', {
        duration: 5000,
        panelClass: ['error_snackbar']
      })
    }

  }

 
  createUser(userForm: NgForm) {

    if (userForm.valid) {
      console.log('Submitting Form!', userForm.value);
    } else {
      //this.markFormAsTouched(userForm);
      console.log('Form is invalid');
      this._snackbar.open('Form is invalid. Check your entries.',
        'Dismiss', {
          duration: 15000,
          panelClass: ['error_snackbar']
        })
      return
    }


    this.email = jQuery("#email").val();
    this.pwd = jQuery("#pwd").val();
    this.username = jQuery("#username").val();
    //console.log('email='+this.email)

    fetch(environment.apiURL + 'users/create', {
      method: 'POST',
      body: JSON.stringify({
          email: this.email,
          password: this.pwd,
          user_name: this.username,
      }),
      headers: {
        "Content-type":"application/json; charset=UTF-8"
      }
    }).then((response) => {
      this.responseOutput.responseStatus = response.status
      this.responseOutput.responseError = false 
      if (response.status == 500) { 
        this.responseOutput.responseError = true 
        this.responseOutput.responseErrorMsg = response.statusText
      }
      return response.json()
    }).then((data) => {
      console.log('update response', data)
      if (this.responseOutput.responseError) {
        this.responseOutput.responseErrorMsgBody = JSON.stringify(data);
        if (this.responseOutput.responseErrorMsgBody.search("sqlMessage") > 0) {
          this.responseOutput.responseErrorMsg += " DATABASE: "
        }
      }
    }).then(() => {
      if (this.responseOutput.responseError) {
        this.msg ='Add process failed! ' + this.responseOutput.responseErrorMsg + ': ' + this.responseOutput.responseErrorMsgBody
        this._snackbar.open(this.msg,
        'Dismiss', {
          duration: 15000,
          panelClass: ['error_snackbar']
        })
      } else {
          this.msg = 'You have successfully added this user!'
        this.responseOutput.responseErrorMsg = this.msg
        this._snackbar.open(this.msg,
        'Dismiss', {
          duration: 5000,
          panelClass: ['success_snackbar']
        })
      }  
  
    }).catch((error) => {
      console.log(error)
      console.log('in service  error handler')
      this.responseOutput.responseError = true 
      this.responseOutput.responseErrorMsg ='Add process failed! ' + error.message
    })
    }
  
  }

