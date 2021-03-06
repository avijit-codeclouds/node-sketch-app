import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ShapeService } from './services/shape.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatButtonModule } from '@angular/material/button'
import { MatButtonModule,MatIconModule } from '@angular/material'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorsComponent } from './colors/colors.component'
import { ColorTwitterModule } from 'ngx-color/twitter';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component'; // <color-twitter></color-twitter>
import { NgFlashMessagesModule } from 'ng-flash-messages';
import { KonvastaticComponent } from './konvastatic/konvastatic.component';
import { CanvasnewComponent } from './canvasnew/canvasnew.component';
import { CanvasspecificComponent } from './canvasspecific/canvasspecific.component';
import { JwtInterceptor } from './guards/jwt.interceptor'

//fabric
import { EventHandlerService } from './services/event-handler.service';
import { FabricService } from './services/fabric.service';
import { ButtonsComponent } from './buttons/buttons.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule} from '@angular/material/snack-bar'
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    ColorsComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    KonvastaticComponent,
    CanvasnewComponent,
    CanvasspecificComponent,
    ButtonsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,MatIconModule,
    ReactiveFormsModule, FormsModule,
    ColorTwitterModule,
    NgFlashMessagesModule.forRoot(),
    HttpClientModule,
    MatDialogModule,
    MatSnackBarModule,MatFormFieldModule,MatInputModule,
    ModalModule.forRoot()
  ],
  providers: [
    ShapeService,EventHandlerService,FabricService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));
