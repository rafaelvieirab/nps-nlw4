function npsCalculate(promoters: number, detractors: number, totalAnswers: number) {
  return Number(
    (((promoters - detractors) / totalAnswers) * 100).toFixed(2)
  );
}

export { npsCalculate }