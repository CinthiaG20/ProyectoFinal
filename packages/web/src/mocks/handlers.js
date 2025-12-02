import { rest } from 'msw';

<<<<<<< HEAD
const users = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    username: 'Admin',
    roles: 'admin',
  },
  'manager@example.com': {
    id: '2',
    email: 'manager@example.com',
    username: 'Manager',
    roles: 'manager',
  },
  'gambler@example.com': {
    id: '3',
    email: 'gambler@example.com',
    username: 'Gambler',
    roles: 'gambler',
  },
};

const mockTournaments = [
  {
    id: 't1',
    name: 'Copa Primavera',
    description: 'Torneo de prueba',
    startDate: '2025-10-01',
    endDate: '2025-12-01',
    invitedUsers: [],
  },
  {
    id: 't2',
    name: 'Liga Verano',
    description: 'Liga de ejemplo',
    startDate: '2025-06-01',
    endDate: '2025-08-01',
    invitedUsers: [],
  },
];

const mockInvites = [
  {
    id: 'i1',
    invitedGambler: '3',
    invitingManager: '2',
    tournament: 't1',
    acceptedAt: null,
    revokedAt: null,
  },
];

=======
// Usuarios de prueba (de acuerdo con Login.jsx)
const users = {
  'admin@example.com': { id: '1', email: 'admin@example.com', username: 'Admin', roles: 'admin' },
  'manager@example.com': { id: '2', email: 'manager@example.com', username: 'Manager', roles: 'manager' },
  'gambler@example.com': { id: '3', email: 'gambler@example.com', username: 'Gambler', roles: 'gambler' },
};

// Estado mutable del mock (para simular cambios entre llamadas)
const mockTournaments = [
  { id: 't1', name: 'Copa Primavera', description: 'Torneo de prueba', startDate: '2025-10-01', endDate: '2025-12-01' },
  { id: 't2', name: 'Liga Verano', description: 'Liga de ejemplo', startDate: '2025-06-01', endDate: '2025-08-01' },
];

const mockInvites = [
  { id: 'i1', invitedGambler: '3', invitingManager: '2', tournament: 't1', acceptedAt: null, revokedAt: null },
];

// Manager/admin mock state
>>>>>>> main
const mockTeams = [
  { id: 'a1', name: 'Equipo A', description: 'Equipo A', logo: '' },
  { id: 'b1', name: 'Equipo B', description: 'Equipo B', logo: '' },
];

const mockMatches = [
<<<<<<< HEAD
  {
    id: 't1-m1',
    name: 'Partido 1',
    tournamentId: 't1',
    teamA: mockTeams[0],
    teamB: mockTeams[1],
    date: '2025-11-30T12:00:00Z',
    result: null,
  },
];

const mockGambles = [
  {
    id: 'g1',
    user: '3',
    match: 't1-m1',
    goalsA: 1,
    goalsB: 1,
    tournamentId: 't1',
    userEmail: 'gambler@example.com',
  },
];

const mockUserList = Object.values(users).map((u) => ({
  id: u.id,
  email: u.email,
  username: u.username,
  role: u.roles,
}));

function ensureTournament(tid) {
  if (!mockTournaments.find((t) => t.id === tid)) {
    mockTournaments.push({
      id: tid,
      name: `Torneo ${tid}`,
      description: 'Torneo agregado por mock',
      startDate: '2025-10-01',
      endDate: '2025-12-01',
    });
=======
  { id: 't1-m1', name: 'Partido 1', tournamentId: 't1', teamA: mockTeams[0], teamB: mockTeams[1], date: '2025-11-30T12:00:00Z', result: null },
];

const mockUserList = Object.values(users).map(u => ({ id: u.id, email: u.email, username: u.username, role: u.roles }));

function ensureTournament(tid) {
  if (!mockTournaments.find((t) => t.id === tid)) {
    mockTournaments.push({ id: tid, name: `Torneo ${tid}`, description: 'Torneo agregado por mock', startDate: '2025-10-01', endDate: '2025-12-01' });
>>>>>>> main
  }
}

export const handlers = [
<<<<<<< HEAD
=======
  
>>>>>>> main
  rest.post('/api/login', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

<<<<<<< HEAD
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email y password requeridos' })
      );
    }
    // Accept password stored on user object (created via POST /api/users)
    const user = users[email] || mockUserList.find((u) => u.email === email);
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Credenciales inválidas' })
      );
    }

    const ok =
      (user.password && password === user.password) || password === user.roles;
    if (!ok) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Credenciales inválidas' })
      );
    }

    const token = `mock-token-${user.id}`;
    return res(ctx.status(200), ctx.json({ token, user }));
  }),

=======
    // Validar campos
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Email y password requeridos' }),
      );
    }

    const user = users[email];
    // Passwords en los usuarios de prueba: admin | manager | gambler
    if (!user || password !== (user.roles)) {
      return res(
        ctx.status(401),
        ctx.json({ error: 'Credenciales inválidas' }),
      );
    }

    // Devolver formato similar al backend: { token, user }
    const token = `mock-token-${user.id}`;
    return res(
      ctx.status(200),
      ctx.json({ token, user }),
    );
  }),

  
>>>>>>> main
  rest.get('/api/me', (req, res, ctx) => {
    const auth = req.headers.get('authorization') || '';
    const match = auth.match(/^Bearer mock-token-(\d+)$/);
    if (!match) {
      return res(ctx.status(401), ctx.json({ error: 'No autorizado' }));
    }
    const id = match[1];
    const user = Object.values(users).find((u) => u.id === id);
<<<<<<< HEAD
    if (!user)
      return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));

    return res(ctx.status(200), ctx.json({ username: user.username }));
  }),

=======
    if (!user) return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));

    // apiMe in AuthContext expects { username }
    return res(ctx.status(200), ctx.json({ username: user.username }));
  }),

  
>>>>>>> main
  rest.get('/api/me/tournaments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTournaments));
  }),

<<<<<<< HEAD
  rest.get('/api/me/tournaments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const tournament = mockTournaments.find((t) => t.id === id) ?? {
      id,
      name: `Torneo ${id}`,
      description: 'Detalle de torneo',
      startDate: '2025-10-01',
      endDate: '2025-12-01',
    };
    return res(ctx.status(200), ctx.json(tournament));
  }),

  rest.get('/api/me/tournaments/:id/matches', (req, res, ctx) => {
    const { id } = req.params;
    const matches = [
      {
        id: `${id}-m1`,
        name: 'Partido 1',
        teamA: { id: 'a1', name: 'Equipo A' },
        teamB: { id: 'b1', name: 'Equipo B' },
        date: '2025-11-30T12:00:00Z',
        tournamentId: id,
        result: null,
      },
      {
        id: `${id}-m2`,
        name: 'Partido 2',
        teamA: { id: 'a2', name: 'Equipo C' },
        teamB: { id: 'b2', name: 'Equipo D' },
        date: '2025-10-01T12:00:00Z',
        tournamentId: id,
        result: { goalsA: 2, goalsB: 1 },
      },
=======
  
  rest.get('/api/me/tournaments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const tournament = mockTournaments.find((t) => t.id === id) ?? { id, name: `Torneo ${id}`, description: 'Detalle de torneo', startDate: '2025-10-01', endDate: '2025-12-01' };
    return res(ctx.status(200), ctx.json(tournament));
  }),

  
  rest.get('/api/me/tournaments/:id/matches', (req, res, ctx) => {
    const { id } = req.params;
    const matches = [
      { id: `${id}-m1`, name: 'Partido 1', teamA: { id: 'a1', name: 'Equipo A' }, teamB: { id: 'b1', name: 'Equipo B' }, date: '2025-11-30T12:00:00Z', tournamentId: id, result: null },
      { id: `${id}-m2`, name: 'Partido 2', teamA: { id: 'a2', name: 'Equipo C' }, teamB: { id: 'b2', name: 'Equipo D' }, date: '2025-10-01T12:00:00Z', tournamentId: id, result: { goalsA: 2, goalsB: 1 } },
>>>>>>> main
    ];
    return res(ctx.status(200), ctx.json(matches));
  }),

<<<<<<< HEAD
  rest.get('/api/me/gambles', (req, res, ctx) => {
    const match = req.url.searchParams.get('match');
    if (match) {
      return res(
        ctx.status(200),
        ctx.json(mockGambles.filter((g) => g.match === match))
      );
    }
    return res(ctx.status(200), ctx.json(mockGambles));
=======
  
  rest.get('/api/me/gambles', (req, res, ctx) => {
    const match = req.url.searchParams.get('match');
    const all = [
      { id: 'g1', user: '3', match: 't1-m1', goalsA: 1, goalsB: 1, tournamentId: 't1', userEmail: 'gambler@example.com' },
    ];
    if (match) {
      return res(ctx.status(200), ctx.json(all.filter((g) => g.match === match)));
    }
    return res(ctx.status(200), ctx.json(all));
>>>>>>> main
  }),

  rest.put('/api/me/gambles', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
    const id = body.id ?? `g-${Math.random().toString(36).slice(2, 8)}`;
<<<<<<< HEAD
    const gamble = {
      id,
      user: '3',
      match: body.match,
      goalsA: body.homeScore ?? body.goalsA,
      goalsB: body.awayScore ?? body.goalsB,
      tournamentId: body.tournamentId ?? 't1',
      userEmail: 'gambler@example.com',
    };
    mockGambles.push(gamble);
    return res(ctx.status(201), ctx.json(gamble));
  }),

  rest.patch('/api/me/gambles/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
    const idx = mockGambles.findIndex((g) => g.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Gamble not found' }));
    mockGambles[idx] = {
      ...mockGambles[idx],
      goalsA: body.homeScore ?? body.goalsA ?? mockGambles[idx].goalsA,
      goalsB: body.awayScore ?? body.goalsB ?? mockGambles[idx].goalsB,
      dateModified: new Date().toISOString(),
    };
    return res(ctx.status(200), ctx.json(mockGambles[idx]));
  }),

  rest.delete('/api/me/gambles/:id', (req, res, ctx) => {
    const { id } = req.params;
    const idx = mockGambles.findIndex((g) => g.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Gamble not found' }));
    mockGambles.splice(idx, 1);
    return res(ctx.status(204));
  }),

  rest.get('/api/me/tournaments/:id/gambles', (req, res, ctx) => {
    const { id } = req.params;

    const gambles = mockGambles.filter(
      (g) => g.tournamentId === id || g.tournament === id
    );
    return res(ctx.status(200), ctx.json(gambles));
  }),

=======
    const gamble = { id, user: '3', match: body.match, goalsA: body.homeScore ?? body.goalsA, goalsB: body.awayScore ?? body.goalsB, tournamentId: body.tournamentId ?? 't1', userEmail: 'gambler@example.com' };
    return res(ctx.status(200), ctx.json(gamble));
  }),

  rest.delete('/api/me/gambles/:id', (req, res, ctx) => {
    return res(ctx.status(204));
  }),

  
  rest.get('/api/me/tournaments/:id/gambles', (req, res, ctx) => {
    const { id } = req.params;
    const gambles = [
      { id: 'g1', user: '3', match: `${id}-m1`, goalsA: 1, goalsB: 1, tournamentId: id, userEmail: 'gambler@example.com' },
      { id: 'g2', user: '2', match: `${id}-m1`, goalsA: 0, goalsB: 2, tournamentId: id, userEmail: 'other@example.com' },
    ];
    return res(ctx.status(200), ctx.json(gambles));
  }),

  
>>>>>>> main
  rest.get('/api/me/invitations', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockInvites));
  }),

  rest.post('/api/me/invitations/:id/accept', (req, res, ctx) => {
    const { id } = req.params;
    const idx = mockInvites.findIndex((i) => i.id === id);
<<<<<<< HEAD
    if (idx === -1)
      return res(
        ctx.status(404),
        ctx.json({ error: 'Invitación no encontrada' })
      );
    const invite = {
      ...mockInvites[idx],
      acceptedAt: new Date().toISOString(),
    };

    mockInvites.splice(idx, 1);

=======
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Invitación no encontrada' }));
    const invite = { ...mockInvites[idx], acceptedAt: new Date().toISOString() };
    // remove invite from pending
    mockInvites.splice(idx, 1);
    // ensure tournament appears in my tournaments
>>>>>>> main
    ensureTournament(invite.tournament);
    return res(ctx.status(200), ctx.json(invite));
  }),

  rest.post('/api/me/invitations/:id/reject', (req, res, ctx) => {
    const { id } = req.params;
    const idx = mockInvites.findIndex((i) => i.id === id);
<<<<<<< HEAD
    if (idx === -1)
      return res(
        ctx.status(404),
        ctx.json({ error: 'Invitación no encontrada' })
      );
    const invite = { ...mockInvites[idx], revokedAt: new Date().toISOString() };

=======
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Invitación no encontrada' }));
    const invite = { ...mockInvites[idx], revokedAt: new Date().toISOString() };
    // remove invite from pending
>>>>>>> main
    mockInvites.splice(idx, 1);
    return res(ctx.status(200), ctx.json(invite));
  }),

<<<<<<< HEAD
  rest.get('/api/me/tournaments/:id/ranking', (req, res, ctx) => {
    const ranking = [
      {
        user: '4',
        userId: '4',
        userEmail: 'player4@example.com',
        rank: 1,
        points: 20,
      },
      {
        user: '5',
        userId: '5',
        userEmail: 'player5@example.com',
        rank: 2,
        points: 18,
      },
      {
        user: '6',
        userId: '6',
        userEmail: 'player6@example.com',
        rank: 3,
        points: 15,
      },
      {
        user: '3',
        userId: '3',
        userEmail: 'gambler@example.com',
        rank: 4,
        points: 10,
      },
      {
        user: '2',
        userId: '2',
        userEmail: 'other@example.com',
        rank: 5,
        points: 5,
      },
      {
        user: '7',
        userId: '7',
        userEmail: 'player7@example.com',
        rank: 6,
        points: 3,
      },
=======
  
  rest.get('/api/me/tournaments/:id/ranking', (req, res, ctx) => {
    
    const ranking = [
      { user: '4', userId: '4', userEmail: 'player4@example.com', rank: 1, points: 20 },
      { user: '5', userId: '5', userEmail: 'player5@example.com', rank: 2, points: 18 },
      { user: '6', userId: '6', userEmail: 'player6@example.com', rank: 3, points: 15 },
      { user: '3', userId: '3', userEmail: 'gambler@example.com', rank: 4, points: 10 },
      { user: '2', userId: '2', userEmail: 'other@example.com', rank: 5, points: 5 },
      { user: '7', userId: '7', userEmail: 'player7@example.com', rank: 6, points: 3 },
>>>>>>> main
    ];
    return res(ctx.status(200), ctx.json(ranking));
  }),

<<<<<<< HEAD
=======
  
>>>>>>> main
  rest.get('/api/tournaments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTournaments));
  }),

<<<<<<< HEAD
  rest.get('/api/tournaments/:id', (req, res, ctx) => {
    const { id } = req.params;
    const tournament = mockTournaments.find((t) => t.id === id) ?? {
      id,
      name: `Torneo ${id}`,
      description: 'Detalle de torneo',
      startDate: '2025-10-01',
      endDate: '2025-12-01',
      invitedUsers: [],
    };
    return res(ctx.status(200), ctx.json(tournament));
  }),

  rest.post('/api/tournaments', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
    const id = body.id ?? `t${Math.random().toString(36).slice(2, 6)}`;
    const t = {
      id,
      name: body.name,
      description: body.description ?? '',
      startDate: body.startDate,
      endDate: body.endDate,
      invitedUsers: [],
    };
=======
  rest.post('/api/tournaments', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
    const id = body.id ?? `t${Math.random().toString(36).slice(2,6)}`;
    const t = { id, name: body.name, description: body.description ?? '', startDate: body.startDate, endDate: body.endDate };
>>>>>>> main
    mockTournaments.push(t);
    return res(ctx.status(201), ctx.json(t));
  }),

  rest.put('/api/tournaments/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const idx = mockTournaments.findIndex((t) => t.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Torneo no encontrado' }));

    const existing = mockTournaments[idx];
    mockTournaments[idx] = {
      ...existing,
      ...body,
      invitedUsers: existing.invitedUsers ?? body.invitedUsers ?? [],
    };
=======
    const idx = mockTournaments.findIndex(t => t.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Torneo no encontrado' }));
    mockTournaments[idx] = { ...mockTournaments[idx], ...body };
>>>>>>> main
    return res(ctx.status(200), ctx.json(mockTournaments[idx]));
  }),

  rest.delete('/api/tournaments/:id', (req, res, ctx) => {
    const { id } = req.params;
<<<<<<< HEAD
    const idx = mockTournaments.findIndex((t) => t.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Torneo no encontrado' }));
    mockTournaments.splice(idx, 1);

    for (let i = mockMatches.length - 1; i >= 0; i--) {
      if (mockMatches[i].tournamentId === id) mockMatches.splice(i, 1);
=======
    const idx = mockTournaments.findIndex(t => t.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Torneo no encontrado' }));
    mockTournaments.splice(idx,1);
    // also remove matches of that tournament
    for (let i = mockMatches.length - 1; i >= 0; i--) {
      if (mockMatches[i].tournamentId === id) mockMatches.splice(i,1);
>>>>>>> main
    }
    return res(ctx.status(204));
  }),

<<<<<<< HEAD
  rest.post('/api/tournaments/:id/invites', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
    const userId = body.userId;
    const inviteId = `i${Math.random().toString(36).slice(2, 6)}`;
    mockInvites.push({
      id: inviteId,
      invitedGambler: userId,
      invitingManager: '2',
      tournament: id,
      acceptedAt: null,
      revokedAt: null,
    });

    const tournament = mockTournaments.find((t) => t.id === id) ?? {
      id,
      name: `Torneo ${id}`,
    };
=======
  
  rest.post('/api/tournaments/:id/invites', async (req, res, ctx) => {
    const { id } = req.params; // tournament id
    const body = await req.json().catch(() => ({}));
    const userId = body.userId;
    const inviteId = `i${Math.random().toString(36).slice(2,6)}`;
    mockInvites.push({ id: inviteId, invitedGambler: userId, invitingManager: '2', tournament: id, acceptedAt: null, revokedAt: null });
    
    const tournament = mockTournaments.find(t => t.id === id) ?? { id, name: `Torneo ${id}` };
>>>>>>> main
    tournament.invitedUsers = (tournament.invitedUsers || []).concat(userId);
    return res(ctx.status(200), ctx.json(tournament));
  }),

<<<<<<< HEAD
=======
  
>>>>>>> main
  rest.get('/api/teams', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockTeams));
  }),

  rest.post('/api/teams', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const id = `team-${Math.random().toString(36).slice(2, 6)}`;
    const team = {
      id,
      name: body.name,
      description: body.description ?? '',
      logo: body.logo ?? '',
    };
=======
    const id = `team-${Math.random().toString(36).slice(2,6)}`;
    const team = { id, name: body.name, description: body.description ?? '', logo: body.logo ?? '' };
>>>>>>> main
    mockTeams.push(team);
    return res(ctx.status(201), ctx.json(team));
  }),

  rest.put('/api/teams/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Equipo no encontrado' }));
=======
    const idx = mockTeams.findIndex(t => t.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Equipo no encontrado' }));
>>>>>>> main
    mockTeams[idx] = { ...mockTeams[idx], ...body };
    return res(ctx.status(200), ctx.json(mockTeams[idx]));
  }),

  rest.delete('/api/teams/:id', (req, res, ctx) => {
    const { id } = req.params;
<<<<<<< HEAD
    const idx = mockTeams.findIndex((t) => t.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Equipo no encontrado' }));
    mockTeams.splice(idx, 1);
    return res(ctx.status(204));
  }),

  rest.get('/api/tournaments/:id/matches', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json(mockMatches.filter((m) => m.tournamentId === id))
    );
=======
    const idx = mockTeams.findIndex(t => t.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Equipo no encontrado' }));
    mockTeams.splice(idx,1);
    return res(ctx.status(204));
  }),

  
  rest.get('/api/tournaments/:id/matches', (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json(mockMatches.filter(m => m.tournamentId === id)));
>>>>>>> main
  }),

  rest.get('/api/matches/:id', (req, res, ctx) => {
    const { id } = req.params;
<<<<<<< HEAD
    const match = mockMatches.find((m) => m.id === id);
    if (!match)
      return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
=======
    const match = mockMatches.find(m => m.id === id);
    if (!match) return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
>>>>>>> main
    return res(ctx.status(200), ctx.json(match));
  }),

  rest.post('/api/matches', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const id = `m-${Math.random().toString(36).slice(2, 6)}`;
    const teamA = mockTeams.find((t) => t.id === body.teamA) || {
      id: body.teamA,
      name: `Equipo ${body.teamA}`,
    };
    const teamB = mockTeams.find((t) => t.id === body.teamB) || {
      id: body.teamB,
      name: `Equipo ${body.teamB}`,
    };
    const match = {
      id,
      name: body.name,
      tournamentId: body.tournamentId,
      teamA,
      teamB,
      date: body.date,
      result: null,
    };
=======
    const id = `m-${Math.random().toString(36).slice(2,6)}`;
    const teamA = mockTeams.find(t => t.id === body.teamA) || { id: body.teamA, name: `Equipo ${body.teamA}` };
    const teamB = mockTeams.find(t => t.id === body.teamB) || { id: body.teamB, name: `Equipo ${body.teamB}` };
    const match = { id, name: body.name, tournamentId: body.tournamentId, teamA, teamB, date: body.date, result: null };
>>>>>>> main
    mockMatches.push(match);
    return res(ctx.status(201), ctx.json(match));
  }),

  rest.put('/api/matches/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const idx = mockMatches.findIndex((m) => m.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
=======
    const idx = mockMatches.findIndex(m => m.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
>>>>>>> main
    mockMatches[idx] = { ...mockMatches[idx], ...body };
    return res(ctx.status(200), ctx.json(mockMatches[idx]));
  }),

  rest.post('/api/matches/:id/result', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const idx = mockMatches.findIndex((m) => m.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
=======
    const idx = mockMatches.findIndex(m => m.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Partido no encontrado' }));
>>>>>>> main
    mockMatches[idx].result = { goalsA: body.goalsA, goalsB: body.goalsB };
    return res(ctx.status(200), ctx.json(mockMatches[idx]));
  }),

<<<<<<< HEAD
=======
  
>>>>>>> main
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUserList));
  }),

  rest.post('/api/users', async (req, res, ctx) => {
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const id = `${Math.random().toString(36).slice(2, 6)}`;
    const user = {
      id,
      email: body.email,
      username: body.username ?? body.email.split('@')[0],
      role: body.role ?? 'gambler',
    };
    // Store public list
    mockUserList.push(user);

    // If password provided, save credentials in internal users map
    if (body.password) {
      users[body.email] = {
        id,
        email: body.email,
        username: user.username,
        roles: (body.role ?? 'gambler').toLowerCase(),
        password: body.password,
      };
    }

=======
    const id = `${Math.random().toString(36).slice(2,6)}`;
    const user = { id, email: body.email, username: body.username ?? body.email.split('@')[0], role: body.role ?? 'gambler' };
    mockUserList.push(user);
>>>>>>> main
    return res(ctx.status(201), ctx.json(user));
  }),

  rest.put('/api/users/:id', async (req, res, ctx) => {
    const { id } = req.params;
    const body = await req.json().catch(() => ({}));
<<<<<<< HEAD
    const idx = mockUserList.findIndex((u) => u.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));
=======
    const idx = mockUserList.findIndex(u => u.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));
>>>>>>> main
    mockUserList[idx] = { ...mockUserList[idx], ...body };
    return res(ctx.status(200), ctx.json(mockUserList[idx]));
  }),

  rest.delete('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
<<<<<<< HEAD
    const idx = mockUserList.findIndex((u) => u.id === id);
    if (idx === -1)
      return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));
    mockUserList.splice(idx, 1);
=======
    const idx = mockUserList.findIndex(u => u.id === id);
    if (idx === -1) return res(ctx.status(404), ctx.json({ error: 'Usuario no encontrado' }));
    mockUserList.splice(idx,1);
>>>>>>> main
    return res(ctx.status(204));
  }),
];
