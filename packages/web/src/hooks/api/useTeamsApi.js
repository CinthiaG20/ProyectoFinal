import * as TeamsApi from '../../api/endpoints/teams.js';

export function useTeamsApi() {
  return {
    listTeams: TeamsApi.apiListTeams,
    createTeam: TeamsApi.apiCreateTeam,
    updateTeam: TeamsApi.apiUpdateTeam,
    deleteTeam: TeamsApi.apiDeleteTeam,
  };
}
