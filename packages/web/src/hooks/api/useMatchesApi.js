import * as MatchesApi from '../../api/endpoints/matches.js';

export function useMatchesApi() {
  return {
    listMatchesByTournament: MatchesApi.apiListMatchesByTournament,
    getMatch: MatchesApi.apiGetMatch,
    createMatch: MatchesApi.apiCreateMatch,
    updateMatch: MatchesApi.apiUpdateMatch,
    setMatchResult: MatchesApi.apiSetMatchResult,
  };
}
