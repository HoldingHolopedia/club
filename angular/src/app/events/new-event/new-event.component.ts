import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput, MatDialogRef, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeoCodingApiService } from 'src/app/geo-coding-api.service';
import { EventFirebaseService } from 'src/app/event-firebase.service';
import { WallService } from 'src/app/wall.service';
import { UserFirebaseService } from 'src/app/user-firebase.service';
import { AuthService } from 'src/app/auth.service';
import { Event } from 'src/app/entity/event/event.model';
import { EventAddress } from 'src/app/entity/helper/EventAddress';
import { CreateNewEventComponent } from 'src/app/create-new-event/create-new-event.component';

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.component.html',
  styleUrls: ['./new-event.component.css']
})
export class NewEventComponent implements OnInit {

  newEventFormGroup: FormGroup;
  apiZipValue = "By";

  constructor(
    private _formBuilder: FormBuilder,
    private geoAPI: GeoCodingApiService,
    private eventService: EventFirebaseService,
    private wallService: WallService,
    private userService: UserFirebaseService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateNewEventComponent>,
    public dialog: MatDialog,
    ) { }

  // @ViewChild('title') nameInput: MatInput;

  ngOnInit() {
    this.newEventFormGroup = this._formBuilder.group({
      eventName: ['hello', Validators.required],
      eventDescription: ['yellow', Validators.required],
      eventLocationStreet: ['smart road', Validators.required],
      eventLocationCity: [''],
      eventLocationZip: ['1253', Validators.required],
      eventCategory: ['', Validators.required]
    });
    //  this.nameInput.focus();
  }

  onSubmitEvent() {

    if (this.newEventFormGroup.valid) {
      

          let observer = this.userService.getUserByID(this.authService.afAuth.auth.currentUser.uid).subscribe( (userSnapshot:any) => {
            let e: Event = this.formDataToModel(userSnapshot);
            console.log({e})
            this.eventService.insertEvent(e).then( (thenableRef) => {
              let key = thenableRef.path.pieces_[1];
              console.log({key})
              this.wallService.insertWall( {fk_event: key, posts: {} } );
            });
            // this.userService.updateUser({numberOfEventsHosted: userSnapshot.numberOfEventsHosted + 1}, this.authService.afAuth.auth.currentUser.uid).then( () => {
            //   observer.unsubscribe();
            //   });
            });
    } else {
      
      // validate all form fields
    }

    // let observer = this.ufbs.getUserByID(this.authService.afAuth.auth.currentUser.uid).subscribe( (userSnapshot:any) => {
    //   let e: Event = this.formDataToModel(userSnapshot);
    //   this.efbs.insertEvent(e).then( (thenableRef) => {
    //     let key = thenableRef.path.pieces_[1];
    //     this.ws.insertWall( {fk_event: key, posts: {} } );
    //   });
    //   this.ufbs.updateUser({numberOfEventsHosted: userSnapshot.numberOfEventsHosted + 1}, this.authService.afAuth.auth.currentUser.uid).then( () => {
    //     observer.unsubscribe();
    //     });
    //   });
  }
  
  formDataToModel(userSnapshot): Event {

    const event = new Event({});

    event.name = this.newEventFormGroup.value.eventName;
    event.address = new EventAddress(this.newEventFormGroup.value.eventLocationStreet, 
                    this.apiZipValue, this.newEventFormGroup.value.eventLocationZip);
    event.category = this.newEventFormGroup.value.eventCategory;
    event.description = this.newEventFormGroup.value.eventDescription;

    event.dateStart = Date.now().toString();
    // event.deadlineDate = this.newEventFormGroup.value.eventDeadlineDate.toString();
    // event.deadlineTime = this.newEventFormGroup.value.eventDeadlineTime;
    // event.timeEnd = this.newEventFormGroup.value.eventEndTime;
    // event.timeStart = this.newEventFormGroup.value.eventStartTime;

    // event.paymentDate = this.newEventFormGroup.value.eventPaymentDate.toString();
    // event.paymentDue = this.newEventFormGroup.value.eventPaymentDue;
    // event.paymentOption = this.newEventFormGroup.value.eventPaymentOption;
    // event.price = this.newEventFormGroup.value.eventPrice;
    // event.mobilePayNumber = this.newEventFormGroup.value.eventMobilePayNumber;
    // event.accountNumber = this.newEventFormGroup.value.eventAccountNumber;

    // event.file = this.newEventFormGroup.value.eventFile;

    // event.genderRatio = this.newEventFormGroup.value.eventGender;
    // event.hostRating = userSnapshot.rating;
    // event.maxAge = this.newEventFormGroup.value.eventMaxAge;
    // event.minAge = this.newEventFormGroup.value.eventMinAge;
    // event.maxGuests = this.newEventFormGroup.value.eventMaxGuests;
    // event.minGuests = this.newEventFormGroup.value.eventMinGuests;
    // event.queue = this.newEventFormGroup.value.eventQueue;
    // event.targetGroup = this.newEventFormGroup.value.eventTargetGroup;

    event.participants = [{username: userSnapshot.username}];

    event.host = this.authService.afAuth.auth.currentUser.uid;

    if (event.hostRating === undefined) {
      event.hostRating = 0;
    }

    // if (false /*!this.isTransferingMoney*/) {
    //   event.paymentDue = "Kontant ved ankomst på dagen";
    // }
    this.onNoClick();
    return event;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  lookUpZip(event) {
    if ( (event.target.value as string).length > 3 ) {
      this.geoAPI.getZipFromCity(event.target.value).map(response => response.json()).subscribe(result => this.apiZipValue = result.navn);
    }
  }

  fillDetails(): void {
    const dialogRef = this.dialog.open(CreateNewEventComponent, {
      width: screen.width / 1.25 + "px",
      height: screen.height / 1.75 + "px",
      panelClass: "new-event-panel"
      // disableClose: true
    });
  }

}
