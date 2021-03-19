import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  submitted = false;
  className : any = ''
  msg : any = ''
  enableMessage: boolean = false
  @Output() redirect:EventEmitter<any> = new EventEmitter();
  loggedInText:any = 'Logout';


  constructor(    
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,) { 
      if(localStorage.getItem("user")!=null){
        this.router.navigate(['/']);
      }
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
      
    }

  ngOnInit() {
    
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  loginUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value)
    this.authService.login(this.form.value).subscribe(res => {
      if(res.errors){
        console.log(res.errors[0].msg)
        this.msg = res.errors[0].msg
        this.enableMessage = true
        this.className = 'alert-danger'
        setTimeout( ()=>{
          console.log('works')
          this.enableMessage = false
          console.log(`enableMessage :: ${this.enableMessage}`)
        }, 5000)
      }else{
        console.log(res)
        this.authService.saveToken(res.token)
        this.redirect.emit(this.loggedInText);//emits the data to the parent
        this.router.navigateByUrl("/");
      }
    },err => {
      console.log(err)
    })
  }

}
