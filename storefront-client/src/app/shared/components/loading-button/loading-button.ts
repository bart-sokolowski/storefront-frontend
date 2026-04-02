import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-loading-button',
  templateUrl: './loading-button.html'
})
export class LoadingButton {
  @Input() label = 'Submit';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'danger' = 'primary';

  @Output() clicked = new EventEmitter<void>();
}
