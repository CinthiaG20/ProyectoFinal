import * as TournamentsApi from '../../api/endpoints/tournaments.js';

export function useTournamentsApi() {
  return {
    listTournaments: TournamentsApi.apiListTournaments,
    getTournament: TournamentsApi.apiGetTournament,
    createTournament: TournamentsApi.apiCreateTournament,
    updateTournament: TournamentsApi.apiUpdateTournament,
    deleteTournament: TournamentsApi.apiDeleteTournament,
    inviteUserToTournament: TournamentsApi.apiInviteUserToTournament,
    // Gambler 
    listMyTournaments: TournamentsApi.apiListMyTournaments,
    getMyTournament: TournamentsApi.apiGetMyTournament,
    listMyMatches: TournamentsApi.apiListMyMatches,
  };
}
