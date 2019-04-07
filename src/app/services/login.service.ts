import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginState:boolean = false;

  constructor() { }
}
