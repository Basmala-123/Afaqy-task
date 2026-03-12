import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './dashboard/components/sidebar/sidebar';
import { Header } from './dashboard/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Sidebar,Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dashboard-charts');
}
