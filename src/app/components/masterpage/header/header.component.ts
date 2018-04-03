import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isOpen = false;

  constructor(private router: Router) {}

  public ngOnInit() {
    // On route change, close nav window
    this.router.events.subscribe(() => {
      this.isOpen = false;
    });
  }
}
