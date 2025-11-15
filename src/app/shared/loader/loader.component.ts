import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../../core/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [ CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  visible$!: Observable<boolean>;
  constructor(private loader: LoaderService) {
    this.visible$ = this.loader.visible$;
  }
}
