
using System.ComponentModel.DataAnnotations;
using PeliculasAPI.Validaciones;
namespace PeliculasAPI.Entidades;

public class Genero
{
    public int Id { get; set; }

    [Required(ErrorMessage ="El campo {0} es requerido")]
    [StringLength(50)]
    [PrimeraLetraMayuscula]
    public string Nombre { get; set; }
    public List<PeliculasGeneros> PeliculasGeneros { get; set; }
}
