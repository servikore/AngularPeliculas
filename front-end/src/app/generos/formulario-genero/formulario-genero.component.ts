import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { primeraLetraMayuscula } from 'src/app/utilidades/validadores/primeraLetraMayuscula';
import { generoCreacionDTO } from '../genero';

@Component({
  selector: 'app-formulario-genero',
  templateUrl: './formulario-genero.component.html',
  styleUrls: ['./formulario-genero.component.css']
})
export class FormularioGeneroComponent implements OnInit {

  constructor(private router:Router, private formBuilder:FormBuilder) { }
  form:FormGroup;

  @Input() modelo:generoCreacionDTO;
  @Input() errores:string[] = [];
  @Output() onSubmit:EventEmitter<generoCreacionDTO> = new EventEmitter<generoCreacionDTO>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nombre:['',{
        validators:[Validators.required, Validators.minLength(3),primeraLetraMayuscula()]
      }]
    });

    if(this.modelo){
      this.form.patchValue(this.modelo);
    }
  }

  guardarCambios():void{
    this.onSubmit.emit(this.form.value);
  }

  obtenerErrorCampoNombre(){
    let campo = this.form.get('nombre');
    if(campo.hasError('required')){
      return 'El campo nombre es requerido';
    }

    if(campo.hasError('minlength')){
      return 'La longitud minima es de 3 caracteres';
    }

    if(campo.hasError('primeraLetraMayuscula')){
      return campo.getError('primeraLetraMayuscula').mensaje;
    }

    return '';
  }

}
