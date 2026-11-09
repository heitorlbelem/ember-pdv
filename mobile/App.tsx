import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { API_BASE_URL } from './src/config/api';
import { useHealthCheck } from './src/hooks/use-health-check';

const APP_TITLE = 'Ember PDV';
const CONNECTION_LOADING = 'loading';
const CONNECTION_SUCCESS = 'success';

export default function App() {
  const { checkConnection, connectionState, errorMessage, health } = useHealthCheck();
  const isLoading = connectionState === CONNECTION_LOADING;
  const isConnected = connectionState === CONNECTION_SUCCESS;
  const statusLabel = isConnected ? 'API conectada' : 'API indisponível';
  const statusColor = isConnected ? styles.successText : styles.errorText;
  return (
    <View style={styles.screen}>
      <StatusBar style="auto" />
      <View style={styles.card}>
        <Image accessibilityLabel="Logo Ember" resizeMode="contain" source={require('./assets/ember-logo.png')} style={styles.logo} />
        <Text style={styles.eyebrow}>CLIENTE MOBILE</Text>
        <Text style={styles.title}>{APP_TITLE}</Text>
        <Text style={styles.description}>Base inicial para operar o ponto de venda.</Text>
        <View style={styles.statusBox}>
          {isLoading ? <ActivityIndicator color={COLORS.primary} /> : null}
          <Text style={[styles.statusText, statusColor]}>{isLoading ? 'Verificando API...' : statusLabel}</Text>
          {health ? <Text style={styles.detail}>Banco: {health.database}</Text> : null}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>
        <Pressable disabled={isLoading} onPress={() => void checkConnection()} style={styles.button}>
          <Text style={styles.buttonText}>{isLoading ? 'Aguarde' : 'Verificar conexão'}</Text>
        </Pressable>
        <Text style={styles.endpoint}>API: {API_BASE_URL}</Text>
      </View>
    </View>
  );
}

const COLORS = {
  background: '#F4F7F8',
  card: '#FFFFFF',
  detail: '#5B6870',
  error: '#B42318',
  primary: '#176B87',
  success: '#087443',
  text: '#102A36',
} as const;

const styles = StyleSheet.create({
  screen: { alignItems: 'center', backgroundColor: COLORS.background, flex: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: COLORS.card, borderRadius: 20, elevation: 3, maxWidth: 480, padding: 28, shadowColor: COLORS.text, shadowOpacity: 0.1, shadowRadius: 12, width: '100%' },
  logo: { alignSelf: 'center', height: 74, marginBottom: 24, width: 220 },
  eyebrow: { color: COLORS.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: COLORS.text, fontSize: 32, fontWeight: '700', marginBottom: 8 },
  description: { color: COLORS.detail, fontSize: 16, lineHeight: 24 },
  statusBox: { backgroundColor: COLORS.background, borderRadius: 12, gap: 8, marginTop: 28, padding: 16 },
  statusText: { fontSize: 16, fontWeight: '700' },
  successText: { color: COLORS.success },
  errorText: { color: COLORS.error, fontSize: 14 },
  detail: { color: COLORS.detail, fontSize: 14 },
  button: { alignItems: 'center', backgroundColor: COLORS.primary, borderRadius: 10, marginTop: 20, padding: 14 },
  buttonText: { color: COLORS.card, fontSize: 16, fontWeight: '700' },
  endpoint: { color: COLORS.detail, fontSize: 12, marginTop: 20 },
});
