import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { DropdownInputItemModel } from 'src/app/core/models';

declare var $: any;


@Component({
  selector: 'dropdown-input',
  templateUrl: './dropdown-input.component.html',
  // styleUrls: ['./dropdown-input.component.css']
})
export class DropDownInputComponent implements OnInit {
    @Input('items') items: Array<DropdownInputItemModel>;
    @Input('selected') public selectedValue: number;
    @Output('change') onChange = new EventEmitter();
    @ViewChild('selectInput', {static: true}) selectElement;

    previousValue: number;
    currentValue = 10;
    actions: Array<(previousValue: number, currentValue: number) => void> = [];

    ngOnInit(): void {
        this.selectedValue = this.selectedValue || 0;
        this.currentValue = this.selectedValue;
    }
    ngAfterContentInit(){
        this.setSelected(this.selectedValue);
    }

    public addAction(action: (previousValue: number, currentValue: number) => void){
        this.actions.push(action);
    }
    public removeAction(action: any): void {
        let idx = this.actions.indexOf(action);
        if(idx !== -1){
          this.actions.splice(idx, 1);
        }    
      }

    public onValueChanged(e){
        let val = e.target.value;
        this.currentValue = val;

        this.actions.forEach(action => {
            action(this.previousValue, this.currentValue);
        });

        // this.onChange.emit();
        this.previousValue = val;
    }
    public setSelected(value: any) {
        setTimeout(() => {
            $(this.selectElement.nativeElement).dropdown('set selected', value);
        }, 200);
    }
}
