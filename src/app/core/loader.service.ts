import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _visible$ = new BehaviorSubject<boolean>(true);
  readonly visible$ = this._visible$.asObservable();

  show() { this._visible$.next(true); }
  hide()  { this._visible$.next(false); }
  toggle(v?: boolean) { if (v === undefined) this._visible$.next(!this._visible$.value); else this._visible$.next(v); }
}
