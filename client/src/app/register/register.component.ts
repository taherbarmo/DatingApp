import { Component, EventEmitter, Input, Output ,OnInit} from '@angular/core';
import { AccountService } from '../_service/account.service';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  

  registerForm : FormGroup = new FormGroup({});
  maxDate : Date = new Date();
  validationErrors : string[] | undefined
  @Output () cancelregister = new EventEmitter;
  
  constructor(private accountService : AccountService,private toaster : ToastrService,private fb:FormBuilder,private router:Router) {
    
    
  }
  ngOnInit(): void {
    this.initiaizeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -18);
  }

  initiaizeForm(){
    this.registerForm= this.fb.group({
      gender: ['male'],
      username: ['',Validators.required],
      knownAs: ['',Validators.required],
      dateOfBirth: ['',Validators.required],
      city: ['',Validators.required],
      country: ['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required,this.matchvalues('password')]],
      
    });
    this.registerForm.valueChanges.subscribe({
      next: ()=> this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchvalues(matchTo:string):ValidatorFn{
    return (control: AbstractControl)=>{
      return control.value===control.parent?.get(matchTo)?.value ? null : {notMatching :true}
    }
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {... this.registerForm.value,dateOfBirth:dob};
    this.accountService.register(values).subscribe({
      next: () => {
        
       this.router.navigateByUrl('/members')
      },
      error: error=> {
        this.validationErrors=error;
      }
      
    })
    
   
  }

  cancel() {
    this.cancelregister.emit(false)
  }
  private getDateOnly(dob : string| undefined){
    if(!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset())).toISOString().slice(0,10);
  }

}
