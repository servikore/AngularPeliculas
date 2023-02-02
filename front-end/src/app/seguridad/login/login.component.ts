import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { credencialesUsuario } from '../seguridad';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router,
    private seguridadService:SeguridadService) { }

  errores:string[] = [];

  ngOnInit(): void {
  }

  login(credenciales:credencialesUsuario){
    this.seguridadService.login(credenciales).subscribe({
      next:(respuesta) => {
        this.seguridadService.guardarToken(respuesta);
        this.router.navigate(['/']);
      },
      error: err => this.errores = parsearErroresAPI(err)
    });
  }

}
