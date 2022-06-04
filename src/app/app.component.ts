import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userId: string;
  logged: boolean;

  ngOnInit() {
    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId');
      this.logged = true;
    }
  }
}
