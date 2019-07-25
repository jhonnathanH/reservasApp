import { UserServiceProvider } from './../user-service/user-service';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

@Injectable()
export class FirebaseImageServiceProvider {
  

  constructor(public userService: UserServiceProvider,
    public events: Events) {

    //this.xuser$= this.userService.listUser;
    //this.xuser$.subscribe(data => console.log('z'+data.toString()) );
    console.log("##########  11");
    this.userService.getUsers().subscribe(res => {
      let aux = res;
      this.userService.storeUsers(aux);
      console.log(JSON.stringify(aux));
    })

  }

  uploadImagePic(imageURI, id: any, user: any) {
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('imageProfiles').child('pic_' + id);
    //alert(imageRef);
    return imageRef.putString(imageURI, 'base64', { contentType: 'image/png' })
      .then(() => {
        return imageRef.getDownloadURL().then(downloadURL => {
        //  alert('x ' + downloadURL);
          return downloadURL;
        });
      });
  }

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

  uploadImageProfile(imageURI, id: any, user: any) {
    this.auxfun();
    let storageRef = firebase.storage().ref();
    let imageRef = storageRef.child('imageProfiles').child('pic_' + id);
    //alert(imageRef);
    this.encodeImageUri(imageURI, function (image64) {
      imageRef.putString(image64, 'data_url')
        .then(() => {
          let a = {
            name: user.name,
            uid: user.uid,
            email: user.email,
            photoURL: "xxx1",
          };
          imageRef.getDownloadURL().then(downloadURL => {
            //  alert('x ' + downloadURL);
            a.photoURL = downloadURL;
            this.events.publish('menu:userpic', '');
            this.userService.storeUser(a);
          });
        });
    })

  }

  auxfun() {
    this.userService.getUsers().subscribe(res => {
      let aux = res;
      this.userService.storeUsers(aux);
      console.log(JSON.stringify(aux));
    });
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
