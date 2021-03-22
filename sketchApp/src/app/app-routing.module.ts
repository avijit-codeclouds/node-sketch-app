import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanvasComponent } from './canvas/canvas.component';
import { LoginComponent } from './login/login.component'
import { RegisterComponent } from './register/register.component'
import { AuthGuard } from "./guards/auth.guard";
import { LogoutComponent } from './logout/logout.component'
import { KonvastaticComponent } from './konvastatic/konvastatic.component';
import { CanvasnewComponent } from './canvasnew/canvasnew.component';
import { CanvasspecificComponent } from './canvasspecific/canvasspecific.component';

const routes: Routes = [
  // { path:'',component: CanvasComponent },
  { path: "", component: CanvasComponent, canActivate: [AuthGuard] },
  { path: 'canvas/new', component: CanvasnewComponent, canActivate: [AuthGuard] },
  { path: 'canvas/:canvas_id',component: CanvasspecificComponent, canActivate: [AuthGuard] },
  // { path: 'whiteboard', component: WhiteboardPageComponent },
  { path: 'login', component : LoginComponent },
  { path: 'register', component : RegisterComponent },
  { path : 'logout', component : LogoutComponent },
  { path: '**', component: CanvasComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
