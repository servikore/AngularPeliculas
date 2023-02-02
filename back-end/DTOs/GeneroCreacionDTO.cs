
using System.ComponentModel.DataAnnotations;
using PeliculasAPI.Validaciones;

namespace PeliculasAPI.DTOs;

public class GeneroCreacionDTO
{
    [Required(ErrorMessage ="El campo {0} es requerido")]
    [StringLength(50)]
    [PrimeraLetraMayuscula]
    public string Nombre { get; set; }
}
