import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTable } from '@angular/material/table';
import Swal from 'sweetalert2';
import { usuarioDTO } from '../seguridad';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-indice-usuarios',
  templateUrl: './indice-usuarios.component.html',
  styleUrls: ['./indice-usuarios.component.css']
})
export class IndiceUsuariosComponent implements OnInit {


  constructor(private seguridadService:SeguridadService) { }

  @ViewChild('table') table:MatTable<any>;


  usuarios:usuarioDTO[];
  columnasAmostrar = ['email','acciones'];
  cantidadTotalRegistros;
  paginaActual:number = 1;
  cantidadRegistrosAMostrar:number = 10;

  ngOnInit(): void {
    this.cargarRegistros(this.paginaActual, this.cantidadRegistrosAMostrar);
  }

  cargarRegistros(pagina:number, cantidataElementosAMostrar:number){
    this.seguridadService.obtenerUsuarios(pagina,cantidataElementosAMostrar)
      .subscribe({
        next: (respuesta:HttpResponse<usuarioDTO[]>) =>  {
          this.usuarios = respuesta.body;
          this.cantidadTotalRegistros = respuesta.headers.get('cantidadTotalRegistros');
        },
        error: err => {
          console.log(err)
        }
    });
  }

  actualizarPaginacion(datos:PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadRegistrosAMostrar = datos.pageSize;
    this.cargarRegistros(this.paginaActual,this.cantidadRegistrosAMostrar);
  }

  hacerAdmin(id:string){
    this.seguridadService.hacerAdmin(id).subscribe({
      next:() => Swal.fire('Exitoso','La operacion se ha realizado','success'),
      error: (err)=> {
        console.error(err);
      }
    });
  }

  removerAdmin(id:string){
    this.seguridadService.removerAdmin(id).subscribe({
      next:()=> Swal.fire('Exitoso','La operacion se ha realizado','success'),
      error: (err)=> {
        console.error(err);
      }
    });
  }

}
