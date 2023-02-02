
export function toBase64(file:File){
  return new Promise((resolve,reject) =>{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function parsearErroresAPI(response:any): string[]{
  const resultado:string[] = [];

  if(response.error){
    const error = response.error;
    if(typeof error === 'string'){
      resultado.push(error);
    }
    else if(Array.isArray(response.error)){
      response.error.forEach(err => resultado.push(err.description));
    }
    else if(response.errors) {
      const errors = error.errors;
      const entradas = Object.entries(errors);
      entradas.forEach((campos:any[])=>{
        const campo = campos[0];
        campos[1].forEach(mensajeError => resultado.push(`${campo}: ${mensajeError}`));
      });
    }
    else{
      resultado.push(error.title);
    }
  }

  return resultado;
}

export function formatearFecha(date:Date):string {
  date = new Date(date);
  const formato = new Intl.DateTimeFormat('en',{
    year:'numeric',
    month:'2-digit',
    day:'2-digit'
  });

  const [
    {value:month},,
    {value:day},,
    {value:year}
  ] = formato.formatToParts(date);

  return `${year}-${month}-${day}`;

}
