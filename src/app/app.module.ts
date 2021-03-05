import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SliderInputComponent } from './component/slider-input/slider-input.component';
import { DropDownInputComponent } from './component/dropdown-input/dropdown-input.component';
import { DialogEditBayComponent } from './component/dialog-edit-bay/dialog-edit-bay.component';
import { APP_BASE_HREF } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    SliderInputComponent,
    DropDownInputComponent,
    DialogEditBayComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule
  ],
  providers: [{provide: APP_BASE_HREF, useValue : '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
