import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'slider-input',
  templateUrl: './slider-input.component.html',
  styleUrls: ['./slider-input.component.css']
})
export class SliderInputComponent implements OnInit {
  @Input('min') minValue: number;
  @Input('max') maxValue: number;
  @Input('step') step: number;
  @Input('default') public defaultValue: number;
  @Input('disabled') public isDisabled: boolean;
  @Output('change') onChange = new EventEmitter();

  previousValue: number;
  currentValue: number;
  actions: Array<(previousValue: number, currentValue: number) => void> = [];

  constructor() { }

  ngOnInit() {
    this.currentValue = this.defaultValue;
  }

  public addAction(action: (previousValue: number, currentValue: number) => void) {
    this.actions.push(action);
  }
  public removeAction(action: any): void {
    const idx = this.actions.indexOf(action);
    if (idx !== -1) {
      this.actions.splice(idx, 1);
    }
  }

  public onValueChanged(e) {
    const val = e.target.value;

    if (val < this.minValue || val > this.maxValue) {
      return;
    }

    this.onChange.emit(this);

    // this.currentValue = val;
    this.actions.forEach(action => {
      action(this.previousValue, this.currentValue);
    });
    
    this.previousValue = val;
  }
  public textInputChanged(e) {
    this.onValueChanged(e);
  }

  public setValue(value: number) {
    this.currentValue = value;
    this.onValueChanged({target: {value}});
  }

}
