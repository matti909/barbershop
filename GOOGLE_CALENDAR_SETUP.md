# Configuración de Google Calendar API

Esta guía te ayudará a configurar la integración con Google Calendar para que las reservas se agreguen automáticamente a tu calendario.

## Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Asegúrate de que el proyecto esté seleccionado en la parte superior

## Paso 2: Habilitar Google Calendar API

1. En el menú lateral, ve a **APIs y servicios** > **Biblioteca**
2. Busca "Google Calendar API"
3. Click en "Google Calendar API"
4. Click en **HABILITAR**

## Paso 3: Crear Credenciales OAuth 2.0

1. Ve a **APIs y servicios** > **Credenciales**
2. Click en **CREAR CREDENCIALES** > **ID de cliente de OAuth**
3. Si es la primera vez, configura la "Pantalla de consentimiento OAuth":
   - Tipo de usuario: **Externo**
   - Nombre de la aplicación: **Barber Shop Booking**
   - Correo electrónico de asistencia: **tu-email@gmail.com**
   - Ámbitos: Agrega `https://www.googleapis.com/auth/calendar.events`
   - Usuarios de prueba: Agrega tu email
   - Guardar y continuar

4. Vuelve a **Credenciales** > **CREAR CREDENCIALES** > **ID de cliente de OAuth**
5. Tipo de aplicación: **Aplicación web**
6. Nombre: **Barber Shop Web Client**
7. URIs de redireccionamiento autorizados:
   ```
   http://localhost:4321/oauth2callback
   http://localhost:3000/oauth2callback
   https://tu-dominio.com/oauth2callback
   ```
8. Click en **CREAR**
9. **GUARDA** el Client ID y Client Secret que aparecen

## Paso 4: Obtener el Refresh Token

Crea un archivo temporal `get-refresh-token.js` en la raíz del proyecto:

```javascript
import { google } from 'googleapis';
import readline from 'readline';

const CLIENT_ID = 'TU_CLIENT_ID';
const CLIENT_SECRET = 'TU_CLIENT_SECRET';
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('Autoriza esta app visitando esta URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Ingresa el código de la URL de callback: ', async (code) => {
  rl.close();
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('\n=== GUARDA ESTOS TOKENS ===');
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('Access Token:', tokens.access_token);
  } catch (error) {
    console.error('Error obteniendo tokens:', error);
  }
});
```

Ejecuta el script:

```bash
node get-refresh-token.js
```

1. Abre la URL que aparece en el navegador
2. Inicia sesión con tu cuenta de Google (la que tiene el calendario)
3. Autoriza la aplicación
4. Copia el **código** de la URL de callback
5. Pégalo en la terminal
6. **GUARDA el Refresh Token** que aparece

## Paso 5: Configurar Variables de Entorno

Crea o edita el archivo `.env` en la raíz del proyecto:

```env
# Google Calendar API
GOOGLE_CLIENT_ID=tu_client_id_aqui
GOOGLE_CLIENT_SECRET=tu_client_secret_aqui
GOOGLE_REDIRECT_URI=http://localhost:3000/oauth2callback
GOOGLE_REFRESH_TOKEN=tu_refresh_token_aqui
GOOGLE_CALENDAR_ID=primary

# O usa un calendario específico:
# GOOGLE_CALENDAR_ID=tu-calendario-id@group.calendar.google.com
```

### Cómo obtener el Calendar ID de un calendario específico:

1. Ve a [Google Calendar](https://calendar.google.com)
2. Click en el calendario que quieres usar
3. Click en los 3 puntos > **Configuración y uso compartido**
4. Scroll hasta **Integrar calendario**
5. Copia el **ID de calendario**

## Paso 6: Agregar .env al .gitignore

Asegúrate de que `.env` esté en tu `.gitignore`:

```
.env
.env.local
.env.*.local
```

## Paso 7: Probar la Integración

1. Inicia el servidor de desarrollo:
   ```bash
   bun run dev
   ```

2. Ve a http://localhost:4321
3. Completa el formulario de reserva
4. Verifica que el evento se haya creado en tu Google Calendar

## Solución de Problemas

### Error: "invalid_grant"
- El refresh token ha expirado o es inválido
- Genera un nuevo refresh token siguiendo el Paso 4

### Error: "insufficient permissions"
- Asegúrate de haber agregado el scope correcto en la configuración OAuth
- Revoca el acceso en [Google Account Permissions](https://myaccount.google.com/permissions)
- Genera un nuevo refresh token

### El evento no aparece en el calendario
- Verifica que `GOOGLE_CALENDAR_ID` sea correcto
- Asegúrate de que la cuenta tiene permisos para escribir en ese calendario

### Error: "Calendar API has not been used in project"
- Asegúrate de haber habilitado la Google Calendar API (Paso 2)
- Espera unos minutos para que los cambios se propaguen

## Características Implementadas

✅ Creación automática de eventos en Google Calendar
✅ Envío de invitaciones por email al cliente
✅ Verificación de disponibilidad antes de reservar
✅ Recordatorios automáticos (1 día y 1 hora antes)
✅ Duración automática según el servicio
✅ Color amarillo/ámbar para identificar fácilmente las reservas
✅ Información completa del cliente en la descripción del evento

## Próximos Pasos (Opcional)

- **Producción**: Cambia los URIs de redirección por tu dominio real
- **Seguridad**: Considera usar un servidor backend para manejar las credenciales
- **Notificaciones**: Configura recordatorios por SMS usando Twilio
- **Sincronización**: Implementa webhook para cancelaciones
