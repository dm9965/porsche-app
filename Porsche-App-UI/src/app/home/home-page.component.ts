import { Component } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgForm} from "@angular/forms";
import {OnInit} from "@angular/core";


interface Image {
  id: string,
  imageurl: string
}
@Component({
  selector: 'app-home',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  imageURL: string = ""
  images: Image[] = []

  constructor(private _snackbar: MatSnackBar) {
  }

  ngOnInit() {
    this.getImages()
    console.log("Images: ", this.images)
  }
  getImages = () => {
    fetch('http://localhost:3001/images/all').then((response) => {
      return response.json()
    }).then((data) => {
      this.images = data.rows.map((image: Image) => ({ id: image.id, imageurl: image.imageurl }));
      console.log("Images: ", this.images)
    }).catch((error) => {
      console.log(error)
    })
  }

  addImage = () => {
    if (!this.imageURL) {
      this._snackbar.open('No image was inputted.',
        'Dismiss', {
          duration: 5000,
          panelClass: ['error_snackbar']
        });
    } else {
      fetch('http://localhost:3001/images/add', {
        method: "POST",
        body: JSON.stringify({
          imageURL: this.imageURL
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
      }).then(() => {
        this.getImages()
        this._snackbar.open('Image successfully added!',
          'Dismiss', {
            duration: 5000,
            panelClass: ['success_snackbar']
          });
        console.log ("Images: ", this.images)
      }).catch((error) => {
        console.log(error);
      });
    }
  }
}
