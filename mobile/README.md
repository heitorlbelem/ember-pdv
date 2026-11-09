# Ember PDV Mobile

Cliente React Native/Expo do Ember PDV. O projeto usa Expo SDK 58, React Native 0.88 e Node.js 22.23.4.

## Configuração

```bash
cd mobile
cp .env.example .env.local
```

Defina `EXPO_PUBLIC_API_URL` no `.env.local` conforme o destino:

- iOS Simulator: `http://localhost:3000`
- Android Emulator: `http://10.0.2.2:3000`
- Dispositivo físico: `http://<ip-da-sua-maquina>:3000`

O backend precisa estar acessível na rede do dispositivo. Inicie-o em `backend` com `npm run dev`.
O build de desenvolvimento permite HTTP local para o backend; em ambientes publicados, use uma URL HTTPS.

## Development build local

Com Android Studio ou Xcode configurado:

```bash
npx expo run:android
npx expo run:ios
```

Para instalar em um dispositivo físico conectado, use `npm run android:device` ou `npm run ios:device`. Depois do primeiro build nativo, alterações apenas em TypeScript usam `npm run dev`.

## Development build na nuvem

Faça login no Expo e configure o projeto EAS quando solicitado:

```bash
npx eas-cli@latest login
npx eas-cli@latest build:configure
npm run build:development
npm run build:ios-simulator
```

O perfil `development` gera builds instaláveis para Android e iOS físicos. O perfil `development-simulator` gera o build para iOS Simulator. No primeiro build para iOS físico, o Expo solicitará o registro do dispositivo e as credenciais de assinatura.

## Verificação

```bash
npm run typecheck
npm run doctor
```
