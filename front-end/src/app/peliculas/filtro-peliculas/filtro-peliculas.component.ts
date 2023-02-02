import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { generoDTO } from 'src/app/generos/genero';
import { PeliculasService } from '../peliculas.service';
import { GenerosService } from 'src/app/generos/generos.service';
import { parsearErroresAPI } from 'src/app/utilidades/utilidades';
import { PeliculaDTO } from '../pelicula';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-filtro-peliculas',
  templateUrl: './filtro-peliculas.component.html',
  styleUrls: ['./filtro-peliculas.component.css']
})
export class FiltroPeliculasComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,
    private location:Location,
    private activatedRoute:ActivatedRoute,
    private peliculasService:PeliculasService,
    private generosService:GenerosService) { }

  errores:string[] = [];
  form:FormGroup;

  generos:generoDTO[] = [];

  peliculas:PeliculaDTO[];

  formularioOriginal = {
    titulo:'',
    generoId:0,
    proximosEstrenos:false,
    enCines:false
  };

  paginaActual = 1;
  cantidadElementosAMostrar = 10;
  cantidadElementos;


  ngOnInit(): void {

    this.generosService.obtenerTodos().subscribe({
      next:(generos) => {
        this.generos = generos;

        this.form = this.formBuilder.group(this.formularioOriginal);

        this.leerValoresURL();
        this.buscarPelicula(this.form.value);

        this.form.valueChanges.subscribe(valores => {
          this.buscarPelicula(valores);
          this.escribirParametrosBusquedaEnURL();
        });

      },
      error:(err) => this.errores = parsearErroresAPI(err)
    })

  }

  private leerValoresURL(){
    this.activatedRoute.queryParams.subscribe((params) => {
      var objeto:any = {};
      console.log(params);
      if(params.titulo){
        objeto.titulo = params.titulo;
      }

      if(params.generoId){
        objeto.generoId = Number(params.generoId);
      }

      if(params.proximosEstrenos){
        objeto.proximosEstrenos = params.proximosEstrenos;
      }

      if(params.enCines){
        objeto.enCines = params.enCines;
      }

      this.form.patchValue(objeto);
    });
  }

  private escribirParametrosBusquedaEnURL(){
    let queryStrings = [];
    let valoresFormulario = this.form.value;

    if(valoresFormulario.titulo){
      queryStrings.push(`titulo=${valoresFormulario.titulo}`);
    }

    if(valoresFormulario.generoId){
      queryStrings.push(`generoId=${valoresFormulario.generoId}`);
    }

    if(valoresFormulario.proximosEstrenos){
      queryStrings.push(`proximosEstrenos=${valoresFormulario.proximosEstrenos}`);
    }

    if(valoresFormulario.enCines){
      queryStrings.push(`enCines=${valoresFormulario.enCines}`);
    }

    this.location.replaceState('peliculas/buscar',queryStrings.join('&'));
  }

  buscarPelicula(valores:any){
    valores.pagina = this.paginaActual;
    valores.recordsPorPagina = this.cantidadElementosAMostrar;
    this.peliculasService.filtrar(valores).subscribe({
      next:(respuesta) => {
        this.peliculas = respuesta.body;
        this.escribirParametrosBusquedaEnURL();
        this.cantidadElementos = respuesta.headers.get('cantidadTotalRegistros');
      },
      error:(err)=> this.errores = parsearErroresAPI(err)
    })
  }

  limpiar():void{
    this.form.patchValue(this.formularioOriginal);
  }

  paginatorUpdate(datos:PageEvent){
    this.paginaActual = datos.pageIndex + 1;
    this.cantidadElementosAMostrar = datos.pageSize;
    this.buscarPelicula(this.form.value);
  }

}
