#!/usr/bin/env node

/**
 * Script para obtener el Refresh Token de Google Calendar
 *
 * Uso:
 * 1. Configura CLIENT_ID y CLIENT_SECRET abajo
 * 2. Ejecuta: node scripts/get-refresh-token.js
 * 3. Sigue las instrucciones
 */

import { google } from 'googleapis';
import readline from 'readline';

// CONFIGURA ESTOS VALORES CON TUS CREDENCIALES
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = '';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

console.log('\n=== Generador de Refresh Token para Google Calendar ===\n');

if (CLIENT_ID === 'TU_CLIENT_ID_AQUI' || CLIENT_SECRET === 'TU_CLIENT_SECRET_AQUI') {
  console.error('❌ ERROR: Debes configurar CLIENT_ID y CLIENT_SECRET primero');
  console.log('\nPuedes:');
  console.log('1. Editar este archivo y reemplazar los valores');
  console.log('2. O usar variables de entorno:');
  console.log('   GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/get-refresh-token.js\n');
  process.exit(1);
}

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
  prompt: 'consent'
});

console.log('📝 PASO 1: Abre esta URL en tu navegador:\n');
console.log(authUrl);
console.log('\n📝 PASO 2: Autoriza la aplicación');
console.log('📝 PASO 3: Copia el código de la URL de callback\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('🔑 Pega el código aquí: ', async (code) => {
  rl.close();

  if (!code || code.trim() === '') {
    console.error('\n❌ ERROR: No ingresaste ningún código\n');
    process.exit(1);
  }

  try {
    console.log('\n⏳ Obteniendo tokens...\n');
    const { tokens } = await oauth2Client.getToken(code.trim());

    console.log('✅ ¡Éxito! Guarda estos valores en tu archivo .env:\n');
    console.log('─────────────────────────────────────────────────────');
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REDIRECT_URI=${REDIRECT_URI}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_CALENDAR_ID=primary`);
    console.log('─────────────────────────────────────────────────────\n');

    if (!tokens.refresh_token) {
      console.log('⚠️  ADVERTENCIA: No se recibió refresh_token');
      console.log('   Intenta revocar el acceso y volver a generar:');
      console.log('   https://myaccount.google.com/permissions\n');
    }

    console.log('💡 TIP: Si quieres usar un calendario específico:');
    console.log('   1. Ve a calendar.google.com');
    console.log('   2. Configuración del calendario > Integrar calendario');
    console.log('   3. Copia el ID de calendario\n');

  } catch (error) {
    console.error('\n❌ ERROR obteniendo tokens:');
    console.error(error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   - Asegúrate de copiar el código completo');
    console.log('   - Verifica que CLIENT_ID y CLIENT_SECRET sean correctos');
    console.log('   - El código expira rápido, intenta de nuevo\n');
    process.exit(1);
  }
});

console.log('⏳ Esperando el código...\n');
