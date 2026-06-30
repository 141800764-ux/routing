export type BadgeCounts = {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
};

type BadgeCriteria = {
  questions: number;
  answers: number;
  views: number;
};

const THRESHOLDS = {
  QUESTIONS: { BRONZE: 5, SILVER: 50, GOLD: 100 },
  ANSWERS: { BRONZE: 10, SILVER: 50, GOLD: 100 },
  VIEWS: { BRONZE: 1000, SILVER: 5000, GOLD: 10000 },
};

function tierFor(
  count: number,
  thresholds: { BRONZE: number; SILVER: number; GOLD: number }
) {
  if (count >= thresholds.GOLD) return "GOLD";
  if (count >= thresholds.SILVER) return "SILVER";
  if (count >= thresholds.BRONZE) return "BRONZE";
  return null;
}

export function calculateBadgeCounts(criteria: BadgeCriteria): BadgeCounts {
  const counts: BadgeCounts = { GOLD: 0, SILVER: 0, BRONZE: 0 };

  const categories = [
    tierFor(criteria.questions, THRESHOLDS.QUESTIONS),
    tierFor(criteria.answers, THRESHOLDS.ANSWERS),
    tierFor(criteria.views, THRESHOLDS.VIEWS),
  ];

  for (const tier of categories) {
    if (tier) counts[tier as keyof BadgeCounts]++;
  }

  return counts;
}