import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { generoCreacionDTO, generoDTO } from '../genero';
import { GenerosService } from '../generos.service';

@Component({
  selector: 'app-editar-genero',
  templateUrl: './editar-genero.component.html',
  styleUrls: ['./editar-genero.component.css']
})
export class EditarGeneroComponent implements OnInit {

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private generoService:GenerosService
    ) { }

    genero:generoDTO;
    errores:string[] = [];

    ngOnInit(): void {
      this.activatedRoute.params.subscribe({
        next:params => {
          this.generoService.obtenerPorId(params.id).subscribe({
            next:generoDto => {
              this.genero = generoDto;
            },
            error:() =>
            {
              this.router.navigate(['/generos'])
            }
          });
        }
      })
  }

  guardarCambios(generoDTO:generoCreacionDTO){
    this.generoService.editar(this.genero.id,generoDTO).subscribe({
      next:()=>{
        this.router.navigate(['/generos']);
      },
      error: err => {
        this.errores = parsearErroresAPI(err);
      }
    });
  }
}
