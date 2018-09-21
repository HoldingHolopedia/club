import { Component, OnInit, ViewChild  } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { EventFirebaseService } from '../event-firebase.service';
import { MobileDetectorService } from '../mobile-detector.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserFirebaseService } from '../user-firebase.service';
import { Event } from '../entity/event/event.model';

export interface EventData {
  name: string;
  address: string;
  distance: number;
  genderRatio: string;
  targetGroup: boolean;
  available: number;
  actions: string;
}

export interface EventDataMobile {
  name: string;
  address: string;
  available: number;
  actions: string;
}



@Component({
  selector: 'my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  isMobile = false;

  dataSource = new MatTableDataSource<EventData>();
  displayedColumns = ['name', 'address', 'distance', 'category', 'genderRatio', 'targetGroup', 'available', 'actions'];
  dataSourceMobile = new MatTableDataSource<EventDataMobile>();
  displayedColumnsMobile = ['name', 'address', 'available', 'actions'];

  events = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private efbs: EventFirebaseService, private mds: MobileDetectorService, 
    private spinner: NgxSpinnerService, private ufbs: UserFirebaseService) {
      this.efbs.getEventsByHost(this.ufbs.getStorage().email).subscribe(res => {
        this.events = res;
        this.dataSource = new MatTableDataSource(this.events);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceMobile = new MatTableDataSource(this.events);
      this.dataSourceMobile.paginator = this.paginator;
      this.dataSourceMobile.sort = this.sort;
      this.spinner.hide();
      });
    }

  ngOnInit() {
    this.spinner.show();
    this.isMobile = this.mds.check();
  }

  onEditClick(element) {
    let e: Event = element;
    this.efbs.myEventSelection = e;
  }

  onDeleteClick(element) {
    console.log("Under development");
  }

}
