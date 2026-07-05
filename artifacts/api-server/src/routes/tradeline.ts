import { Router } from "express";

const router = Router();

router.get("/estimate", (req, res) => {
  const currentScore = parseInt(req.query.currentScore as string, 10);
  const utilization = parseInt(req.query.utilization as string, 10);
  const accountAge = parseInt(req.query.accountAge as string, 10);
  const numTradelines = parseInt((req.query.numTradelines as string) || "1", 10);

  if (isNaN(currentScore) || isNaN(utilization) || isNaN(accountAge)) {
    res.status(400).json({ error: "Invalid parameters" });
    return;
  }

  // Estimate score boost based on factors
  let boost = 0;
  const details: string[] = [];

  // Utilization impact (lower is better)
  if (utilization > 70) {
    boost += 40;
    details.push("High utilization (>70%) — adding tradelines can lower your overall utilization significantly");
  } else if (utilization > 50) {
    boost += 25;
    details.push("Moderate utilization — tradelines will help reduce your utilization ratio");
  } else if (utilization > 30) {
    boost += 15;
    details.push("Moderate-low utilization — modest improvement expected");
  } else {
    boost += 5;
    details.push("Good utilization — limited room for improvement here");
  }

  // Account age impact
  if (accountAge < 2) {
    boost += 30;
    details.push("Short credit history — aged tradelines can significantly boost your average account age");
  } else if (accountAge < 5) {
    boost += 15;
    details.push("Moderate credit history — tradelines will help extend your average account age");
  } else {
    boost += 5;
    details.push("Established credit history — minimal age improvement expected");
  }

  // Current score impact (lower score = more room to grow)
  if (currentScore < 550) {
    boost += 20;
    details.push("Low starting score — significant upward potential with positive tradelines");
  } else if (currentScore < 620) {
    boost += 15;
    details.push("Below-average score — strong improvement potential");
  } else if (currentScore < 680) {
    boost += 10;
    details.push("Near-prime score — good room for improvement");
  } else {
    boost += 5;
    details.push("Good score — incremental improvements expected");
  }

  // Number of tradelines
  boost = Math.round(boost * (1 + (numTradelines - 1) * 0.3));
  if (numTradelines > 1) {
    details.push(`${numTradelines} tradelines selected — stacking effect adds ~30% per additional tradeline`);
  }

  const estimatedNewScore = Math.min(currentScore + boost, 850);

  let recommendation = "";
  if (estimatedNewScore >= 680) {
    recommendation = "With this improvement, you would qualify for most rental applications. Our Standard or Premium package is recommended.";
  } else if (estimatedNewScore >= 620) {
    recommendation = "This improvement puts you in a better position, but additional credit coaching may be needed. Our Standard Package is a great starting point.";
  } else {
    recommendation = "Tradelines alone may not be sufficient. Our Full-Service Premium Package includes credit coaching + tradelines for maximum impact.";
  }

  res.json({
    currentScore,
    estimatedBoost: boost,
    estimatedNewScore,
    recommendation,
    details,
  });
});

export default router;
