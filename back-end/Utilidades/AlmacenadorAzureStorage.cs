using Azure.Storage.Blobs;

namespace PeliculasAPI.Utilidades;

public class AlmacenadorAzureStorage : IAlmacenadorArchivos
{
	private readonly string connectionString;

	public AlmacenadorAzureStorage(IConfiguration configuration)
	{
		connectionString = configuration.GetConnectionString("AzureStorage");
	}

	public async Task<string> GuardarArchivo(string contenedor, IFormFile archivo)
	{
		var cliente = new BlobContainerClient(connectionString, contenedor);
		await cliente.CreateIfNotExistsAsync(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

		var extension = Path.GetExtension(archivo.FileName);
		var archivoNombre = $"{Guid.NewGuid()}{extension}";
		var blob = cliente.GetBlobClient(archivoNombre);
		await blob.UploadAsync(archivo.OpenReadStream());
		return blob.Uri.ToString();
	}

	public async Task BorrarArchivo(string ruta, string contenedor)
	{
		if (!string.IsNullOrEmpty(ruta) && string.IsNullOrEmpty(contenedor))
		{
			var cliente = new BlobContainerClient(connectionString, contenedor);

			if (await cliente.ExistsAsync())
			{
				var blob = cliente.GetBlobClient(Path.GetFileName(ruta));
				await blob.DeleteIfExistsAsync();
			}
		}
	}
	public async Task<string> EditarArchivo(string contenedor, IFormFile archivo, string ruta)
	{
		await BorrarArchivo(ruta, contenedor);
		return await GuardarArchivo(contenedor, archivo);
	}
}

