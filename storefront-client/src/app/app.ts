import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationToast } from './shared/components/notification-toast/notification-toast';
import { NavBar } from './shared/components/nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationToast, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
