import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { credencialesUsuario } from '../seguridad';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(private seguridadService:SeguridadService,
    private router:Router) { }

  errores:string[] = [];

  ngOnInit(): void {
  }

  registrar(credenciales:credencialesUsuario){
    this.seguridadService.registrar(credenciales).subscribe({
      next:(respuestaAutenticacion) => {
        this.seguridadService.guardarToken(respuestaAutenticacion);
        this.router.navigate(['/']);
      },
      error: err => this.errores = parsearErroresAPI(err)
    });
  }

}
