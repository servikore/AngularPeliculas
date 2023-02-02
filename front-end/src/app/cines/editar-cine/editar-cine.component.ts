import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { cineCreacionDTO, cineDTO } from '../cine';
import { CinesService } from '../cines.service';

@Component({
  selector: 'app-editar-cine',
  templateUrl: './editar-cine.component.html',
  styleUrls: ['./editar-cine.component.css']
})
export class EditarCineComponent implements OnInit {

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private cineService:CinesService
    ) { }

    cine:cineDTO;
    errores:string[] = [];

    ngOnInit(): void {
      this.activatedRoute.params.subscribe({
        next:params => {
          this.cineService.obtenerPorId(params.id).subscribe({
            next:cineDto => {
              this.cine = cineDto;
            },
            error:() =>
            {
              this.router.navigate(['/cines'])
            }
          });
        }
      })
  }

  guardarCambios(cineDTO:cineCreacionDTO){
    this.cineService.editar(this.cine.id,cineDTO).subscribe({
      next:()=>{
        this.router.navigate(['/cines']);
      },
      error: err => {
        this.errores = parsearErroresAPI(err);
      }
    });
  }

}
