namespace PeliculasAPI.Utilidades;

public class AlmacenadorArchivosLocal : IAlmacenadorArchivos
{
    private readonly IWebHostEnvironment env;
    private readonly IHttpContextAccessor httpContextAccessor;

    public AlmacenadorArchivosLocal(IWebHostEnvironment env, IHttpContextAccessor httpContextAccessor)
    {
        this.env = env;
        this.httpContextAccessor = httpContextAccessor;
    }
    public Task BorrarArchivo(string ruta, string contenedor)
    {
        if(string.IsNullOrEmpty(ruta) || string.IsNullOrEmpty(contenedor))
        {
            return Task.CompletedTask;
        }

        var nombreArchivo = Path.GetFileName(ruta);
        var directorioArchivo = Path.Combine(env.WebRootPath, contenedor, nombreArchivo);

        if (File.Exists(directorioArchivo))
        {
            File.Delete(directorioArchivo);
        }

        return Task.CompletedTask;
    }

    public async Task<string> EditarArchivo(string contenedor, IFormFile archivo, string ruta)
    {
        await BorrarArchivo(ruta, contenedor);
        return await GuardarArchivo(contenedor, archivo);
    }

    public async Task<string> GuardarArchivo(string contenedor, IFormFile archivo)
    {
        var extension = Path.GetExtension(archivo.FileName);
        var nombreArchivo = $"{Guid.NewGuid()}{extension}";
        var folder = Path.Combine(env.WebRootPath,contenedor);

        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }

        var ruta = Path.Combine(folder, nombreArchivo);
        using (MemoryStream ms = new())
        {
            await archivo.CopyToAsync(ms);
            await File.WriteAllBytesAsync(ruta,ms.ToArray());
        }

        var urlActual = $"{httpContextAccessor.HttpContext.Request.Scheme}://{httpContextAccessor.HttpContext.Request.Host}";
        return Path.Combine(urlActual, contenedor, nombreArchivo)
            .Replace("\\","/");
    }
}

