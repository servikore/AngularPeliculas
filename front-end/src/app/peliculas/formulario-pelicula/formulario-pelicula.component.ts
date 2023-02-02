import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { actorPeliculaDTO } from 'src/app/actores/crear-actor/actor';
import { MultipleSelectorModel } from 'src/app/utilidades/selector-multiple/MultipleSelectorModel';
import { PeliculaCreacionDTO, PeliculaDTO } from '../pelicula';

@Component({
  selector: 'app-formulario-pelicula',
  templateUrl: './formulario-pelicula.component.html',
  styleUrls: ['./formulario-pelicula.component.css']
})
export class FormularioPeliculaComponent implements OnInit {

  constructor(private formBuilder:FormBuilder) { }

  form:FormGroup;

  @Output() OnSubmit:EventEmitter<PeliculaCreacionDTO> = new EventEmitter<PeliculaCreacionDTO>();
  @Input() modelo:PeliculaDTO;

  @Input() generosNoSeleccionados:MultipleSelectorModel[];
  @Input() generosSeleccionados:MultipleSelectorModel[]=[];

  @Input() cinesNoSeleccionados:MultipleSelectorModel[];
  @Input() cinesSeleccionados:MultipleSelectorModel[]=[];

  @Input() actoresSeleccionados:actorPeliculaDTO[]=[];

  @Input() errores:string[] = [];

  imagenCambiada:boolean = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titulo:['',{
        validators:[Validators.required]
      }],
      resumen:'',
      enCines:false,
      trailer:'',
      fechaLanzamiento:'',
      poster:'',
      generosIds:'',
      cinesIds:'',
      actores:''
    });

    if(this.modelo){
      this.form.patchValue(this.modelo);
    }
  }

  guardarCambios(){
    const generosIds = this.generosSeleccionados.map(val => val.llave);
    this.form.get('generosIds').setValue(generosIds);

    const cinesIds = this.cinesSeleccionados.map(val => val.llave);
    this.form.get('cinesIds').setValue(cinesIds);

    const actores = this.actoresSeleccionados.map(val => {
      return {id:val.id, personaje:val.personaje}
    });

    this.form.get('actores').setValue(actores);

    if(!this.imagenCambiada){
      this.form.patchValue({'poster':null});
    }

    this.OnSubmit.emit(this.form.value);
  }

  archivoSeleccionado(archivo:File){
    this.imagenCambiada = true;
    this.form.get('poster').setValue(archivo);
  }

  changeMarkdown(resumen:string){
    this.form.get('resumen').setValue(resumen);
  }

}
