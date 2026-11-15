/** Reduce y convierte una foto a WebP en el navegador antes de subirla. */
export async function comprimirImagen(archivo: File, maxLado = 1920, calidad = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(archivo);
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * escala);
  canvas.height = Math.round(bitmap.height * escala);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((ok, fallo) =>
    canvas.toBlob((b) => (b ? ok(b) : fallo(new Error("No se pudo comprimir la imagen"))), "image/webp", calidad),
  );
}

export const nombreArchivo = (extension: string) =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${extension}`;
