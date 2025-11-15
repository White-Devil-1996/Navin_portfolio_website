import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet,RouterModule, Router } from "@angular/router";

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  imports: [RouterLink, RouterModule]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/dynamicComp']);
  }

}
