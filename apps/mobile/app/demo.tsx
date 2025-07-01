import { View, Text, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import demoRealization from '../assets/demo-realization.json';
import MapView, { Marker } from 'react-native-maps';

export default function DemoScreen() {
  const demo = demoRealization;
  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header />
      <ScrollView className="flex-1 px-6 py-4">
        {/* Mapa z markerem lokalizacji realizacji */}
        <View className="w-full h-64 mb-6 rounded-2xl overflow-hidden border border-primary/30 dark:border-primary-dark/30">
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: 52.2297, // przykładowa lokalizacja Warszawa
              longitude: 21.0122,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            <Marker
              coordinate={{ latitude: 52.2297, longitude: 21.0122 }}
              title={demo.name}
              description={demo.location}
            />
          </MapView>
        </View>
        <Text className="text-2xl font-bold text-primary dark:text-primary-dark mb-2">{demo.name}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Data: {demo.date}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Status: {demo.status}</Text>
        <Text className="mb-2 text-base text-secondary dark:text-secondary-dark">Lokalizacja: {demo.location}</Text>
        <Text className="mb-4 text-base text-secondary dark:text-secondary-dark">Organizator: {demo.organizer?.name} ({demo.organizer?.email})</Text>
        <Text className="text-lg font-semibold text-accent dark:text-accent-dark mb-2">Gry / Stanowiska:</Text>
        {demo.games?.map((game: any) => (
          <View key={game.id} className="mb-4 p-3 rounded-xl bg-white/80 dark:bg-black/40 border border-primary/20 dark:border-primary-dark/20">
            <Text className="font-bold text-primary dark:text-primary-dark mb-1">{game.name}</Text>
            <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Typ: {game.type || game.details?.type}</Text>
            <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Status: {game.status || '-'}</Text>
            {game.details?.description && (
              <Text className="text-sm text-secondary dark:text-secondary-dark mb-1">Opis: {game.details.description}</Text>
            )}
            {game.details?.verificationCode && (
              <Text className="text-sm text-highlight dark:text-highlight-dark mb-1">Kod zaliczenia: {game.details.verificationCode}</Text>
            )}
            {game.details?.questionsDetails && (
              <View className="mt-2">
                <Text className="font-semibold text-accent dark:text-accent-dark">Pytania quizowe:</Text>
                {game.details.questionsDetails.map((q: any) => (
                  <View key={q.questionId} className="mb-1">
                    <Text className="text-sm text-primary dark:text-primary-dark">{q.questionText}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        <Text className="mt-6 text-base text-secondary dark:text-secondary-dark">Uczestnicy:</Text>
        {demo.participants?.map((p: any) => (
          <Text key={p.id} className="text-sm text-primary dark:text-primary-dark">{p.name} ({p.role})</Text>
        ))}
        <Text className="mt-6 text-base text-secondary dark:text-secondary-dark">Notatki:</Text>
        <Text className="text-sm text-primary dark:text-primary-dark mb-4">{demo.notes}</Text>
      </ScrollView>
    </View>
  );
}
