import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  public title: string;
  public subtitle: string;
  public email: string;
  constructor() { 
    this.title = "José Emmanuel Flores Flores";
    this.subtitle = "Ingeniero en Software";
    this.email = "emmanuelflores2608@gmail.com"
  }

  ngOnInit(): void {
  }

}
