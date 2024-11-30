import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-loan',
  standalone: true,
  imports: [NgbDatepickerModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loan-add.component.html',
  styleUrl: './loan-add.component.scss'
})
export class AddLoanComponent {
	loanForm: FormGroup;

	constructor(
	  public activeModal: NgbActiveModal,
	  private fb: FormBuilder
	) {
	  this.loanForm = this.fb.group({
		clientName: ['', Validators.required],
		amount: ['', [Validators.required, Validators.min(0)]],
		term: ['', Validators.required]
	  });
	}
  
	ngOnInit() {}
  
	saveLoan() {
	  if (this.loanForm.valid) {
		this.activeModal.close(this.loanForm.value);
	  }
	}
}
