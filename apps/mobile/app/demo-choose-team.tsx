import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Header } from '../components/Header';
import demoRealization from '../assets/demo-realization.json';
import { useTeam } from './team-context';

export default function DemoChooseTeamScreen() {
  const router = useRouter();
  const teams = demoRealization.teams || [];
  const { setTeamId } = useTeam();

  const handleChoose = (team: any) => {
    setTeamId(team.id);
    router.push('/demo-edit-team');
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <Header />
      <ScrollView className="flex-1 px-6 py-8">
        <Text className="text-2xl font-bold text-primary dark:text-primary-dark mb-6 text-center">Wybierz swoją drużynę</Text>
        {teams.map((team: any) => (
          <TouchableOpacity
            key={team.id}
            className="mb-4 p-4 rounded-xl bg-white/80 dark:bg-black/40 border border-primary/20 dark:border-primary-dark/20 items-center"
            onPress={() => handleChoose(team)}
          >
            <Text className="text-lg font-bold text-primary dark:text-primary-dark mb-1">{team.name}</Text>
            <Text className="text-base text-secondary dark:text-secondary-dark">Status: {team.status}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
