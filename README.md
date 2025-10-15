# Barber Shop - Sitio Web con Sistema de Reservas

Sitio web moderno para barbería con sistema de reservas integrado a Google Calendar.

## 🚀 Tecnologías

- **Astro 5.0** - Framework web moderno
- **React 19** - Componentes interactivos (Islands)
- **TailwindCSS 4** - Estilos
- **Google Calendar API** - Sistema de reservas
- **TypeScript** - Type safety

## 📦 Instalación

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Build para producción
bun run build

# Preview de producción
bun run preview
```

## 🔧 Configuración de Google Calendar

### Paso Rápido:

1. **Lee la guía completa**: [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md)

2. **Obtén credenciales**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto
   - Habilita Google Calendar API
   - Crea credenciales OAuth 2.0

3. **Genera el Refresh Token**:
   ```bash
   # Edita el script con tus credenciales
   nano scripts/get-refresh-token.js

   # Ejecuta el script
   node scripts/get-refresh-token.js
   ```

4. **Configura las variables de entorno**:
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env

   # Edita con tus valores
   nano .env
   ```

5. **Reinicia el servidor** y prueba el formulario de reservas

## 📁 Estructura del Proyecto

```
barber-astro/
├── src/
│   ├── components/
│   │   ├── react/          # Componentes React (Islands)
│   │   │   ├── BookingForm.tsx
│   │   │   └── Calendar.tsx
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Services.astro
│   │   └── Contact.astro
│   ├── layouts/
│   │   └── Layout.astro    # Layout principal
│   ├── lib/
│   │   └── googleCalendar.ts  # Lógica de Google Calendar
│   ├── pages/
│   │   ├── api/
│   │   │   └── booking.ts  # API endpoint para reservas
│   │   └── index.astro     # Página principal
│   └── styles/
│       └── global.css      # Estilos globales
├── scripts/
│   └── get-refresh-token.js   # Script helper
├── .env.example
├── GOOGLE_CALENDAR_SETUP.md   # Guía detallada
└── README.md
```

## ✨ Características

### Sitio Web
- ✅ Diseño moderno y responsive
- ✅ Efecto parallax en hero
- ✅ Footer con bordes redondeados
- ✅ Animaciones suaves
- ✅ Compatible con todos los navegadores (incluyendo Firefox)

### Sistema de Reservas
- ✅ Formulario de 3 pasos intuitivo
- ✅ Calendario interactivo
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Creación automática de eventos en Google Calendar
- ✅ Envío de invitaciones por email al cliente
- ✅ Recordatorios automáticos (24h y 1h antes)
- ✅ Gestión de duración según el servicio
- ✅ Estados de carga y manejo de errores

### Servicios Disponibles
- **Solo Barba** - 30 min - $15
- **Solo Corte** - 45 min - $20
- **Barba y Corte** - 75 min - $32

## 🎨 Personalización

### Colores
Los colores principales son amber/amarillo. Para cambiarlos, edita `tailwind.config.js` y `src/styles/global.css`.

### Servicios
Edita los servicios en:
- `src/components/Services.astro` (vista)
- `src/components/react/BookingForm.tsx` (formulario)
- `src/lib/googleCalendar.ts` (duraciones)

### Horarios
Modifica los horarios disponibles en `src/components/react/Calendar.tsx`:
```typescript
const timeSlots = [
  '09:00', '09:30', '10:00', // ... agrega o quita horarios
];
```

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Nunca subas el archivo `.env` a git. Las credenciales deben mantenerse privadas.

Para producción, considera:
- Usar variables de entorno del hosting (Vercel, Netlify, etc.)
- Implementar rate limiting en el endpoint `/api/booking`
- Validar datos del lado del servidor
- Usar un backend separado para las credenciales de Google

## 📱 Deployment

### Vercel
```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configura las variables de entorno en el dashboard de Vercel
```

### Netlify
```bash
# Instala Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Configura las variables de entorno en el dashboard de Netlify
```

## 🐛 Solución de Problemas

### El calendario no carga
- Verifica que todas las variables de entorno estén configuradas
- Revisa la consola del navegador para errores
- Verifica que Google Calendar API esté habilitada

### Las reservas no se crean
- Verifica que el refresh token sea válido
- Revisa los logs del servidor (`bun run dev`)
- Asegúrate de que la cuenta tenga permisos en el calendario

### Error "invalid_grant"
- El refresh token ha expirado
- Genera uno nuevo con `node scripts/get-refresh-token.js`

## 📞 Soporte

Para más información, revisa:
- [GOOGLE_CALENDAR_SETUP.md](./GOOGLE_CALENDAR_SETUP.md) - Guía completa de configuración
- [Documentación de Astro](https://docs.astro.build)
- [Google Calendar API Docs](https://developers.google.com/calendar/api)
