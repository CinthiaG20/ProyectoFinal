// Simple fetch interceptor for development as a fallback when MSW service
// worker is not available. Intercepts `/api/login` and `/api/me`.
(function setupFetchMock() {
  if (typeof window === 'undefined' || !window.fetch) return;
  if (window.__FETCH_MOCK_INSTALLED__) return;
  window.__FETCH_MOCK_INSTALLED__ = true;

  const originalFetch = window.fetch.bind(window);

  const users = {
    'admin@example.com': { id: '1', email: 'admin@example.com', username: 'Admin', roles: 'admin' },
    'manager@example.com': { id: '2', email: 'manager@example.com', username: 'Manager', roles: 'manager' },
    'gambler@example.com': { id: '3', email: 'gambler@example.com', username: 'Gambler', roles: 'gambler' },
  };

  // Mutable mock state for development
  let myTournaments = [
    { id: 't1', name: 'Copa Primavera', description: 'Torneo de prueba', startDate: '2025-10-01', endDate: '2025-12-01' }
  ];

  let myInvites = [
    { id: 'i1', invitedGambler: '3', invitingManager: '2', tournament: 't1', acceptedAt: null, revokedAt: null }
  ];

  // Manager/admin mock state
  let mockTeams = [
    { id: 'a1', name: 'Equipo A', description: 'Equipo A', logo: '' },
    { id: 'b1', name: 'Equipo B', description: 'Equipo B', logo: '' },
  ];

  let mockMatches = [
    { id: 't1-m1', name: 'Partido 1', tournamentId: 't1', teamA: mockTeams[0], teamB: mockTeams[1], date: '2025-11-30T12:00:00Z', result: null },
  ];

  let mockUserList = Object.values(users).map(u => ({ id: u.id, email: u.email, username: u.username, role: u.roles }));

  function ensureTournament(tid) {
    if (!myTournaments.find((t) => t.id === tid)) {
      myTournaments.push({ id: tid, name: `Torneo ${tid}`, description: 'Torneo agregado por mock', startDate: '2025-10-01', endDate: '2025-12-01' });
    }
  }

  function ensureTournament(tid) {
    if (!myTournaments.find((t) => t.id === tid)) {
      myTournaments.push({ id: tid, name: `Torneo ${tid}`, description: 'Torneo agregado por mock', startDate: '2025-10-01', endDate: '2025-12-01' });
    }
  }

  async function handleLogin(request) {
    let body;
    try {
      body = await request.clone().json();
    } catch {
      body = {};
    }
    const { email, password } = body;
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y password requeridos' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const user = users[email];
    if (!user || password !== user.roles) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = `mock-token-${user.id}`;
    return new Response(JSON.stringify({ token, user }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  async function handleMe(request) {
    const auth = request.headers.get('authorization') || '';
    const match = auth.match(/^Bearer mock-token-(\d+)$/);
    if (!match) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const id = match[1];
    const user = Object.values(users).find((u) => u.id === id);
    if (!user) return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    return new Response(JSON.stringify({ username: user.username }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  window.fetch = async function (input, init = {}) {
    try {
      const req = new Request(input, init);
      const url = new URL(req.url, window.location.origin);
      if (url.pathname === '/api/login' && req.method.toUpperCase() === 'POST') {
        return handleLogin(req);
      }
      if (url.pathname === '/api/me' && req.method.toUpperCase() === 'GET') {
        return handleMe(req);
      }
      // Gambler endpoints
      if (url.pathname === '/api/me/tournaments' && req.method.toUpperCase() === 'GET') {
        return new Response(JSON.stringify(myTournaments), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/me\/tournaments\/[^/]+$/) && req.method.toUpperCase() === 'GET') {
        const id = url.pathname.split('/').pop();
        return new Response(JSON.stringify({ id, name: `Torneo ${id}`, description: 'Detalle' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/me\/tournaments\/[^/]+\/matches$/) && req.method.toUpperCase() === 'GET') {
        const id = url.pathname.split('/')[4];
        return new Response(JSON.stringify([
          { id: `${id}-m1`, name: 'Partido 1', teamA: { id: 'a1', name: 'Equipo A' }, teamB: { id: 'b1', name: 'Equipo B' }, date: '2025-11-30T12:00:00Z', tournamentId: id, result: null }
        ]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/me/gambles' && req.method.toUpperCase() === 'GET') {
        const match = url.searchParams.get('match');
        const all = [{ id: 'g1', user: '3', match: 't1-m1', goalsA: 1, goalsB: 1, tournamentId: 't1', userEmail: 'gambler@example.com' }];
        if (match) return new Response(JSON.stringify(all.filter((g) => g.match === match)), { status: 200, headers: { 'Content-Type': 'application/json' } });
        return new Response(JSON.stringify(all), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/me/gambles' && req.method.toUpperCase() === 'PUT') {
        let body;
        try { body = await req.clone().json(); } catch { body = {}; }
        const id = body.id ?? `g-${Math.random().toString(36).slice(2, 8)}`;
        const gamble = { id, user: '3', match: body.match, goalsA: body.homeScore ?? body.goalsA, goalsB: body.awayScore ?? body.goalsB, tournamentId: body.tournamentId ?? 't1', userEmail: 'gambler@example.com' };
        return new Response(JSON.stringify(gamble), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/me\/gambles\/[^/]+$/) && req.method.toUpperCase() === 'DELETE') {
        return new Response(null, { status: 204 });
      }
      if (url.pathname.match(/^\/api\/me\/tournaments\/[^/]+\/gambles$/) && req.method.toUpperCase() === 'GET') {
        const id = url.pathname.split('/')[4];
        const gambles = [ { id: 'g1', user: '3', match: `${id}-m1`, goalsA: 1, goalsB: 1, tournamentId: id, userEmail: 'gambler@example.com' } ];
        return new Response(JSON.stringify(gambles), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/me/invitations' && req.method.toUpperCase() === 'GET') {
        return new Response(JSON.stringify(myInvites), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/me\/invitations\/[^/]+\/accept$/) && req.method.toUpperCase() === 'POST') {
        const parts = url.pathname.split('/');
        const id = parts[3];
        const idx = myInvites.findIndex((i) => i.id === id);
        if (idx === -1) return new Response(JSON.stringify({ error: 'Invitación no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        const invite = { ...myInvites[idx], acceptedAt: new Date().toISOString() };
        // remove from invites
        myInvites.splice(idx, 1);
        // ensure tournament present in myTournaments
        ensureTournament(invite.tournament);
        return new Response(JSON.stringify(invite), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/me\/invitations\/[^/]+\/reject$/) && req.method.toUpperCase() === 'POST') {
        const parts = url.pathname.split('/');
        const id = parts[3];
        const idx = myInvites.findIndex((i) => i.id === id);
        if (idx === -1) return new Response(JSON.stringify({ error: 'Invitación no encontrada' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        const invite = { ...myInvites[idx], revokedAt: new Date().toISOString() };
        myInvites.splice(idx, 1);
        return new Response(JSON.stringify(invite), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      // Manager: tournaments
      if (url.pathname === '/api/tournaments' && req.method.toUpperCase() === 'GET') {
        return new Response(JSON.stringify(myTournaments), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/tournaments' && req.method.toUpperCase() === 'POST') {
        let body;
        try { body = await req.clone().json(); } catch { body = {}; }
        const id = body.id ?? `t${Math.random().toString(36).slice(2,6)}`;
        const t = { id, name: body.name, description: body.description ?? '', startDate: body.startDate, endDate: body.endDate };
        myTournaments.push(t);
        return new Response(JSON.stringify(t), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/tournaments\/[^/]+$/) && req.method.toUpperCase() === 'PUT') {
        const id = url.pathname.split('/')[3];
        let body; try { body = await req.clone().json(); } catch { body = {}; }
        const idx = myTournaments.findIndex(t => t.id === id);
        if (idx === -1) return new Response(JSON.stringify({ error: 'Torneo no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        myTournaments[idx] = { ...myTournaments[idx], ...body };
        return new Response(JSON.stringify(myTournaments[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/tournaments\/[^/]+$/) && req.method.toUpperCase() === 'DELETE') {
        const id = url.pathname.split('/')[3];
        const idx = myTournaments.findIndex(t => t.id === id);
        if (idx === -1) return new Response(JSON.stringify({ error: 'Torneo no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        myTournaments.splice(idx,1);
        for (let i = mockMatches.length - 1; i >= 0; i--) if (mockMatches[i].tournamentId === id) mockMatches.splice(i,1);
        return new Response(null, { status: 204 });
      }

      // Manager: invite
      if (url.pathname.match(/^\/api\/tournaments\/[^/]+\/invites$/) && req.method.toUpperCase() === 'POST') {
        const parts = url.pathname.split('/'); const tid = parts[3];
        let body; try { body = await req.clone().json(); } catch { body = {}; }
        const inviteId = `i${Math.random().toString(36).slice(2,6)}`;
        myInvites.push({ id: inviteId, invitedGambler: body.userId, invitingManager: '2', tournament: tid, acceptedAt: null, revokedAt: null });
        const tournament = myTournaments.find(t => t.id === tid) ?? { id: tid, name: `Torneo ${tid}` };
        tournament.invitedUsers = (tournament.invitedUsers || []).concat(body.userId);
        return new Response(JSON.stringify(tournament), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // Teams
      if (url.pathname === '/api/teams' && req.method.toUpperCase() === 'GET') {
        return new Response(JSON.stringify(mockTeams), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/teams' && req.method.toUpperCase() === 'POST') {
        let body; try { body = await req.clone().json(); } catch { body = {}; }
        const id = `team-${Math.random().toString(36).slice(2,6)}`;
        const team = { id, name: body.name, description: body.description ?? '', logo: body.logo ?? '' };
        mockTeams.push(team);
        return new Response(JSON.stringify(team), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/teams\/[^/]+$/) && req.method.toUpperCase() === 'PUT') {
        const id = url.pathname.split('/')[3]; let body; try { body = await req.clone().json(); } catch { body = {}; }
        const idx = mockTeams.findIndex(t => t.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Equipo no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        mockTeams[idx] = { ...mockTeams[idx], ...body };
        return new Response(JSON.stringify(mockTeams[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/teams\/[^/]+$/) && req.method.toUpperCase() === 'DELETE') {
        const id = url.pathname.split('/')[3]; const idx = mockTeams.findIndex(t => t.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Equipo no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); mockTeams.splice(idx,1); return new Response(null, { status: 204 });
      }

      // Matches
      if (url.pathname.match(/^\/api\/tournaments\/[^/]+\/matches$/) && req.method.toUpperCase() === 'GET') {
        const tid = url.pathname.split('/')[3]; return new Response(JSON.stringify(mockMatches.filter(m => m.tournamentId === tid)), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/matches\/[^/]+$/) && req.method.toUpperCase() === 'GET') {
        const id = url.pathname.split('/')[3]; const match = mockMatches.find(m => m.id === id); if (!match) return new Response(JSON.stringify({ error: 'Partido no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); return new Response(JSON.stringify(match), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/matches' && req.method.toUpperCase() === 'POST') {
        let body; try { body = await req.clone().json(); } catch { body = {}; }
        const id = `m-${Math.random().toString(36).slice(2,6)}`; const teamA = mockTeams.find(t => t.id === body.teamA) || { id: body.teamA, name: `Equipo ${body.teamA}` }; const teamB = mockTeams.find(t => t.id === body.teamB) || { id: body.teamB, name: `Equipo ${body.teamB}` }; const match = { id, name: body.name, tournamentId: body.tournamentId, teamA, teamB, date: body.date, result: null }; mockMatches.push(match); return new Response(JSON.stringify(match), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/matches\/[^/]+$/) && req.method.toUpperCase() === 'PUT') {
        const id = url.pathname.split('/')[3]; let body; try { body = await req.clone().json(); } catch { body = {}; } const idx = mockMatches.findIndex(m => m.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Partido no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); mockMatches[idx] = { ...mockMatches[idx], ...body }; return new Response(JSON.stringify(mockMatches[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/matches\/[^/]+\/result$/) && req.method.toUpperCase() === 'POST') {
        const id = url.pathname.split('/')[3]; let body; try { body = await req.clone().json(); } catch { body = {}; } const idx = mockMatches.findIndex(m => m.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Partido no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); mockMatches[idx].result = { goalsA: body.goalsA, goalsB: body.goalsB }; return new Response(JSON.stringify(mockMatches[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      // Users
      if (url.pathname === '/api/users' && req.method.toUpperCase() === 'GET') {
        return new Response(JSON.stringify(mockUserList), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname === '/api/users' && req.method.toUpperCase() === 'POST') {
        let body; try { body = await req.clone().json(); } catch { body = {}; } const id = `${Math.random().toString(36).slice(2,6)}`; const user = { id, email: body.email, username: body.username ?? body.email.split('@')[0], role: body.role ?? 'gambler' }; mockUserList.push(user); return new Response(JSON.stringify(user), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/users\/[^/]+$/) && req.method.toUpperCase() === 'PUT') {
        const id = url.pathname.split('/')[3]; let body; try { body = await req.clone().json(); } catch { body = {}; } const idx = mockUserList.findIndex(u => u.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); mockUserList[idx] = { ...mockUserList[idx], ...body }; return new Response(JSON.stringify(mockUserList[idx]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      if (url.pathname.match(/^\/api\/users\/[^/]+$/) && req.method.toUpperCase() === 'DELETE') {
        const id = url.pathname.split('/')[3]; const idx = mockUserList.findIndex(u => u.id === id); if (idx === -1) return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404, headers: { 'Content-Type': 'application/json' } }); mockUserList.splice(idx,1); return new Response(null, { status: 204 });
      }
      if (url.pathname.match(/^\/api\/me\/tournaments\/[^/]+\/ranking$/) && req.method.toUpperCase() === 'GET') {
        const id = url.pathname.split('/')[4];
        const ranking = [ { user: '3', userId: '3', userEmail: 'gambler@example.com', rank: 1, points: 10 } ];
        return new Response(JSON.stringify(ranking), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
      return originalFetch(input, init);
    } catch (err) {
      return Promise.reject(err);
    }
  };
})();
