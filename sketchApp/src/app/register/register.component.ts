import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgFlashMessageService } from 'ng-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  className : any = ''
  msg : any = ''
  enableMessage: boolean = false


  constructor(    
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public router: Router,
    private ngFlashMessageService: NgFlashMessageService) { 
      // Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')
      
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  registerUser() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    // console.log(this.form.value)
    this.authService.register(this.form.value).subscribe(res => {
      // console.log(res)
      if(res.errors){
        // console.log(res.errors[0].msg)
        this.msg = res.errors[0].msg
        this.enableMessage = true
        this.className = 'alert-danger'
        setTimeout( ()=>{
          // console.log('works')
          this.enableMessage = false
          // console.log(`enableMessage :: ${this.enableMessage}`)
        }, 5000)
      }else{
        this.msg = 'Successfully registered!'
        this.enableMessage = true
        this.className = 'alert-success'
        // this.form.controls['name'].setValue('');
        // this.form.reset()
        setTimeout( ()=>{
          // console.log('works')
          this.enableMessage = false
          // console.log(`enableMessage :: ${this.enableMessage}`)
          this.router.navigate(['/']);
        }, 5000)
        
      }
    },err => {
      console.log(`err :: ${err}`)
    })
  }

}
