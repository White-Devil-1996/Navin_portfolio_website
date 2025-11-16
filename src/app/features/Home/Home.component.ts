import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterModule, Router } from "@angular/router";

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css'],
  imports: [RouterLink, RouterModule]
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

    let origin = window.location.origin;
    if (origin.includes('https://navin-my-portfolio.web.app')) {
      console.log('Running on portfolio production server');
      this.router.navigate(['/dynamicComp']);
    } 
    else if (origin.includes('localhost')) {
      console.log('Running on production server');
      // this.router.navigate(['/dynamicComp']);
    } 
    else{
      console.log('Running on localhost');
    }

  }

}
