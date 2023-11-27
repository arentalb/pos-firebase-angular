import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {SwUpdate} from "@angular/service-worker";
import {SyncService} from "./services/sync.service";
import {SellingSyncService} from "./services/selling-sync.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'pos';
  constructor(private swUpdate: SwUpdate
              ,private syncService :SyncService
  ,private sellSyncServise :SellingSyncService) {


  }



  ngOnInit() {
    if (this.swUpdate.isEnabled) {

      this.swUpdate.available.subscribe(() => {

        if(confirm("New version available. Load New Version?")) {

          window.location.reload();
        }
      });
    }
    // this.syncService.ngOnInit()
    setInterval(() => {
      this.syncService.startSync().then(() => {
        console.log('Sync completed');
      });
      this.sellSyncServise.startSync().then(() => {
        console.log('sell Sync completed');
      });
    }, 30000);
  }

}
