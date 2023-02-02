
using System.ComponentModel.DataAnnotations;

namespace PeliculasAPI.Validaciones;
public class PrimeraLetraMayuscula: ValidationAttribute
{
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
        if(value != null && !string.IsNullOrEmpty(value.ToString()))
        {
            var primeraLetra = value.ToString()[0].ToString();
            return primeraLetra == primeraLetra.ToUpper() ? ValidationResult.Success : new ValidationResult("La primera letra debe ser mayuscula");
        }

        return ValidationResult.Success;
    }

    
}
