import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TeamContextType {
  teamId: string | null;
  setTeamId: (id: string | null) => void;
}

const TeamContext = createContext<TeamContextType>({ teamId: null, setTeamId: () => {} });

export function TeamProvider({ children }: { children: ReactNode }) {
  const [teamId, setTeamId] = useState<string | null>(null);
  return (
    <TeamContext.Provider value={{ teamId, setTeamId }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
