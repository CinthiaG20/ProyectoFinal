export function calculatePoints(realScore, predictedScore) {
  if (!realScore || !predictedScore) return 0;

  const teamIds = Object.keys(realScore);
  if (teamIds.length < 2) return 0;

  const [t1, t2] = teamIds;
  const rh = realScore[t1];
  const ra = realScore[t2];
  const ph = predictedScore[t1];
  const pa = predictedScore[t2];

  if (ph === rh && pa === ra) return 3;

  const realDiff = rh - ra;
  const predDiff = ph - pa;

  if (
    (realDiff > 0 && predDiff > 0) ||
    (realDiff < 0 && predDiff < 0) ||
    (realDiff === 0 && predDiff === 0)
  ) {
    return 1;
  }

  return 0;
}