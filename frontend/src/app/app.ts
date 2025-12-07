import { Component, signal } from '@angular/core';
import { MemberSearchComponent } from './components/member-search/member-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MemberSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
