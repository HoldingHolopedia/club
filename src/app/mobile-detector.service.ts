import { Injectable, Component } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MobileDetectorService {

  constructor() { }

  check(w=600): boolean {
    return window.screen.width <= w;
  }

}
