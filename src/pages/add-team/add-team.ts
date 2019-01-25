import { UserServiceProvider } from './../../providers/user-service/user-service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Team } from '../../models/team';
import { User } from '../../models/user';
import { TeamServiceProvider } from '../../providers/team-service/team-service';

/**
 * Generated class for the AddTeamPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-team',
  templateUrl: 'add-team.html',
})
export class AddTeamPage {
  private todo: FormGroup;
  user: User;
  userTeam: User[] = [];
  //selectOptions = ['Comida', 'Higiene', 'Ropa', 'Carro/Repuesto'];
  searchTerm: string = '';
  gaming: any;
  constructor(public navCtrl: NavController,
    public teamService: TeamServiceProvider,
    public navParams: NavParams,
    public userService: UserServiceProvider,
    private formBuilder: FormBuilder) {

    this.userService.getStoreUser()
      .then(
        (user: User) => {
          this.user = user;
          console.log("alaaa" + this.user);
        }
      ).catch(
        err => {
          console.log(err);
        });

    this.todo = this.formBuilder.group({
      teamName: ['', Validators.required],
     // categoria: [''],
     sizeTeam: ['']
    });
  }

  ionViewDidLoad() {
    // id: number;
    // name: string;
    // leadUser: User;
    // sizeTeam: number;
    // players: User[];
  }

  onAddItem() {
    console.log('ffffpp' + this.todo.value.categoria);
    this.userTeam.push(this.user);
    let newTeam: Team;
    newTeam = {
      id: this.teamService.lengthListTeams + 1,
      name: this.todo.value.teamName,
      leadUser: this.user,
      sizeTeam: this.todo.value.sizeTeam,
      players: this.userTeam
    }
    this.teamService.addTeam(newTeam)
       .then(() => {
         //
       });
    this.todo.reset();
    this.navCtrl.pop();
  }

  searchProduct(form: NgForm) {
    // Reset customers array back to all of the items
    //this.initializeCustomers();
    console.log("ndfffo pro");
    // if the search term is an empty string return all items
    if (!this.searchTerm) {
      // return this.customers;
    }

    // Filter recipes
    // this.customers = this.customers.filter((item) => {
    //   return item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    // });
    if (form.value.teamName == "algo") {
      console.log("soy pro");
    } else {
      console.log("no pro");
    }
  }
}


