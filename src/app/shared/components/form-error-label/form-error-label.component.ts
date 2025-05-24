import { Component, input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/forms-util';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.component.html',
  styles: ``
})
export class FormErrorLabelComponent {

  control = input.required<AbstractControl>();

  get errorMessage(): string {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0 ? FormUtils.getTextError(errors)! : null!;
  }

}
