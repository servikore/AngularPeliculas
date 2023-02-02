using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;

namespace PeliculasAPI.Utilidades;
public class TypeBinder<T> : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        var nombrePropiedad = bindingContext.ModelName;
        var valor = bindingContext.ValueProvider.GetValue(nombrePropiedad);

        if (valor == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        try
        {
            var valorDeserializado = JsonSerializer.Deserialize<T>(valor.FirstValue,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true});
            bindingContext.Result = ModelBindingResult.Success(valorDeserializado);
        }
        catch
        {
            bindingContext.ModelState.TryAddModelError(nombrePropiedad, "El valor no es del tipo adecuado");
        }

        return Task.CompletedTask;
    }
}

