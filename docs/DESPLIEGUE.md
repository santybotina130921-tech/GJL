# Despliegue en Vercel, medición de velocidad y respaldos

## 1. Subir el proyecto a GitHub (repositorio PRIVADO)
```powershell
cd C:\dev\jgl-estructural
git add .
git commit -m "Sitio JGL Estructural"
```
Crea un repositorio **privado** en GitHub y sigue las instrucciones que te muestra para subir el código
(`git remote add origin ...` y `git push -u origin main`). Nunca subas el archivo `.env`.

## 2. Crear el proyecto en Vercel
1. Entra a vercel.com e inicia sesión con GitHub.
2. **Add New → Project** y elige el repositorio.
3. En **Environment Variables** agrega (las mismas de tu `.env`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (secreta)
   - `NEXT_PUBLIC_SITE_URL` = la dirección final de la página, por ejemplo `https://www.jglestructural.co`
4. Pulsa **Deploy**.

## 3. Configurar Supabase para la dirección real
En Supabase: **Authentication → URL Configuration**
- **Site URL**: la dirección de la página.
- **Redirect URLs**: agrega la misma dirección (y `http://localhost:3000` para trabajar en tu computador).

Verifica que la **verificación en dos pasos (TOTP)** esté habilitada en
**Authentication → Sign In / Providers → Multi-Factor**.

## 4. Dominio propio
En Vercel: **Settings → Domains**, agrega el dominio y sigue las indicaciones de DNS.

## 5. Medir la velocidad (Speed Insights)
```powershell
npm install @vercel/speed-insights
```
En `src/app/layout.tsx` agrega:
```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
// ...dentro de <body>, después de {children}:
<SpeedInsights />
```
Haz commit y sube. En Vercel, abre la pestaña **Speed Insights** del proyecto y activa la función.
Ahí verás los tiempos reales de carga que ven los visitantes. También puedes probar con PageSpeed Insights
(pagespeed.web.dev) o con Lighthouse en Chrome.

## 6. Copias de seguridad
- **Desde el panel:** *Seguridad y respaldo → Descargar copia de seguridad* (archivo JSON con todos los datos).
- **Automática diaria:** el archivo `.github/workflows/respaldo.yml` guarda un respaldo completo cada día en GitHub (14 días).
  1. En Supabase: **Connect → Connection string** y copia la cadena de conexión (modo *Session pooler*) con tu contraseña.
  2. En GitHub: **Settings → Secrets and variables → Actions → New repository secret**
     - Nombre: `SUPABASE_DB_URL`
     - Valor: la cadena de conexión.
  3. En la pestaña **Actions** puedes ejecutarlo a mano para probarlo.
  El repositorio debe ser privado: el respaldo contiene datos de clientes.
- Supabase también ofrece respaldos automáticos en sus planes de pago.

## 7. Revisión antes de entregar
- [ ] Verificación en dos pasos activa para el administrador.
- [ ] Clave del administrador larga y única.
- [ ] `NEXT_PUBLIC_SITE_URL` configurada.
- [ ] Probado el formulario de contacto, la visita, el seguimiento por código y la aprobación de cotización.
- [ ] Copia de seguridad descargada una vez.
