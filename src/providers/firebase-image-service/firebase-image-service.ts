import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class FirebaseImageServiceProvider {

  downLoadImage(id: number, count: number) {
    console.log('id.image' + id + ' count ' + count);
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('image' + id);
    let image = [];
    for (var i = 1; i <= count; i++) {
      imageRef.child('imageName' + i).getDownloadURL()
        .then((url) => {
          console.log('url= ' + url);
          image.push(url);
        });

    }
    return image
  }

  uploadImage(imageURI, id: number, count: number) {
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image' + id).child('imageName' + count);
      this.encodeImageUri(imageURI, function (image64) {
        imageRef.putString(image64, 'data_url')
          .then(snapshot => {
            resolve(snapshot.downloadURL)
          }, err => {
            reject(err);
          })
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux: any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  }

}
