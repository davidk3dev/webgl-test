import { Component, OnInit, Input, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { IBay } from 'src/app/core/models';
import { AppComponent } from 'src/app/app.component';

declare var $: any;

@Component({
  selector: 'dialog-edit-bay',
  templateUrl: './dialog-edit-bay.component.html',
  styleUrls: ['./dialog-edit-bay.component.scss']
})
export class DialogEditBayComponent implements OnInit, OnChanges {
    
    @Input('noOfBay') public noOfBay: number;
    @Input('baySize') public baySize: number;
    @Output('onSubmit') onSubmitEvent = new EventEmitter();
    @Output('onCancel') onCancelEvent = new EventEmitter();

    visible: boolean = false;

    public listBay: IBay[] = [];
    public listBayCached: IBay[] = [];
    public bayMaxValue = 5000;
    public bayMinValue = 3000;

    public actions: Array<(listBay: IBay[]) => void> = [];

    ngOnInit(): void {
        
    }
    ngAfterContentInit(){
        
    }
    ngOnChanges(changes: SimpleChanges): void {
        let bays: IBay[] = [];
        this.listBay = [];
        this.listBayCached = [];
        for(let i = 0; i < this.noOfBay; i++){
            bays.push({ index: i+1, value: this.baySize });
            this.listBay.push({ index: i+1, value: +this.baySize });
            this.listBayCached.push({ index: i+1, value: +this.baySize });
        }
        this.actions.forEach(action => {
            action(this.listBay);
        });
    }

    public addAction(action: (listBay: IBay[]) => void){
        this.actions.push(action);
    }
    public removeAction(action: any): void {
        let idx = this.actions.indexOf(action);
        if(idx !== -1){
            this.actions.splice(idx, 1);
        }
    }

    onCancel(){
        this.listBay = this.listBayCached.map(b => ({index: b.index, value: b.value}));

        this.onCancelEvent.emit();
        this.show(false);
    }
    onOK(){
        this.listBayCached = this.listBay.map(b => ({index: b.index, value: b.value}));

        this.onSubmitEvent.emit();
        this.actions.forEach(action => {
            action(this.listBay);
        });
        this.show(false);
    }
    public show(_visible: boolean){
        this.visible = _visible;
    }
}