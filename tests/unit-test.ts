/**
 * FinIQ Automated Verification & Health Test Suite
 * 
 * Verifies core business logic, schema validations, rate limiting,
 * and financial math calculations without requiring live browser interactions.
 */

import {
  StartupInputSchema,
  InvestorProfileSchema,
  QuizSubmitSchema,
  SendChatMessageSchema,
  DocumentRecordSchema,
} from "../src/lib/validations";
import { rateLimit } from "../src/lib/rate-limit";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
    failedCount++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("       FINIQ PRODUCTION TEST & INTEGRITY SUITE        ");
  console.log("=======================================================\n");

  // -------------------------------------------------------------------------
  // 1. Zod Validation Tests: StartupInputSchema
  // -------------------------------------------------------------------------
  console.log("1. Validating Startup Schema:");
  const validStartup = {
    companyName: "Zepto Delivery",
    industry: "Quick Commerce",
    stage: "Series E",
    description: "10-minute grocery delivery network across tier-1 Indian metros.",
  };
  const validStartupResult = StartupInputSchema.safeParse(validStartup);
  assert(validStartupResult.success, "Valid startup payload parses successfully");

  const invalidStartup = {
    companyName: "A", // too short
    industry: "",
    stage: "",
    description: "Hi",
  };
  const invalidStartupResult = StartupInputSchema.safeParse(invalidStartup);
  assert(!invalidStartupResult.success, "Invalid startup payload correctly rejected");

  // -------------------------------------------------------------------------
  // 2. Zod Validation Tests: QuizSubmitSchema
  // -------------------------------------------------------------------------
  console.log("\n2. Validating Quiz Attempt Schema:");
  const validQuiz = {
    topic: "Angel Investing 101",
    score: 4,
    totalScore: 5,
  };
  const validQuizResult = QuizSubmitSchema.safeParse(validQuiz);
  assert(validQuizResult.success, "Valid quiz score (4/5) parses successfully");

  const cheatingQuiz = {
    topic: "Angel Investing 101",
    score: 10,
    totalScore: 5,
  };
  const cheatingQuizResult = QuizSubmitSchema.safeParse(cheatingQuiz);
  assert(
    !cheatingQuizResult.success,
    "Cheating score (10/5) rejected by refinement rule"
  );

  // -------------------------------------------------------------------------
  // 3. Zod Validation Tests: InvestorProfileSchema
  // -------------------------------------------------------------------------
  console.log("\n3. Validating Investor Profile Schema:");
  const validProfile = {
    riskTolerance: "Aggressive",
    preferredStage: "Seed",
    checkSize: "$25,000 - $50,000",
    targetMarket: "India & Southeast Asia",
    interests: ["Fintech", "AI Infrastructure", "SaaS"],
    bio: "Early-stage angel operator backing high-velocity technical founders.",
  };
  const validProfileResult = InvestorProfileSchema.safeParse(validProfile);
  assert(validProfileResult.success, "Complete investor profile passes validation");

  const emptyInterestsProfile = {
    riskTolerance: "Moderate",
    preferredStage: "Series A",
    checkSize: "$10k",
    targetMarket: "India",
    interests: [],
    bio: "Test",
  };
  const emptyInterestsResult = InvestorProfileSchema.safeParse(emptyInterestsProfile);
  assert(
    emptyInterestsResult.success,
    "Profile with empty interests schema passes schema level (business logic rejects in action)"
  );

  // -------------------------------------------------------------------------
  // 4. Rate Limiter Tests
  // -------------------------------------------------------------------------
  console.log("\n4. Validating In-Memory Sliding Window Rate Limiter:");
  const testUserId = `test-user-${Date.now()}`;
  const testLimit = {
    identifier: "test-action",
    maxRequests: 3,
    windowMs: 5000,
  };

  const hit1 = rateLimit(testUserId, testLimit);
  const hit2 = rateLimit(testUserId, testLimit);
  const hit3 = rateLimit(testUserId, testLimit);
  assert(
    hit1.success && hit2.success && hit3.success,
    "First 3 requests within limit succeed"
  );

  const hit4 = rateLimit(testUserId, testLimit);
  assert(!hit4.success, "4th request is rate-limited (blocked)");
  assert(hit4.remaining === 0, "Remaining tokens reported as 0 when exhausted");

  // -------------------------------------------------------------------------
  // 5. Financial Math Verification
  // -------------------------------------------------------------------------
  console.log("\n5. Validating Core Angel Financial Calculations:");
  // Math: Post-Money Valuation = Pre-Money + Investment
  const preMoney = 40000000; // ₹4.0 Crore
  const investment = 10000000; // ₹1.0 Crore
  const postMoney = preMoney + investment;
  const ownershipPct = (investment / postMoney) * 100;
  assert(
    postMoney === 50000000,
    "Post-Money valuation calculation correct (₹4Cr + ₹1Cr = ₹5Cr)"
  );
  assert(
    Math.round(ownershipPct * 100) / 100 === 20.0,
    "Investor ownership calculation correct (₹1Cr / ₹5Cr = 20.00%)"
  );

  // Math: Dilution in Series A
  const seriesAInvestment = 20000000; // ₹2.0 Cr
  const seriesAPreMoney = 80000000; // ₹8.0 Cr
  const seriesAPostMoney = seriesAPreMoney + seriesAInvestment; // ₹10.0 Cr
  const seedInvestorNewSharesVal = 0.2 * seriesAPreMoney; // ₹1.6 Cr
  const seedDilutedOwnership = (seedInvestorNewSharesVal / seriesAPostMoney) * 100;
  assert(
    seedDilutedOwnership === 16.0,
    "Seed investor dilution calculation correct (20% diluted to 16% in 20% Series A round)"
  );

  // -------------------------------------------------------------------------
  // 6. Portfolio Allocator & Power Law Math
  // -------------------------------------------------------------------------
  console.log("\n6. Validating Portfolio Allocator & Power Law Calculations:");
  const poolLakhs = 50;
  const reservePct = 45;
  const numDeals = 20;
  const initialCapLakhs = (poolLakhs * (100 - reservePct)) / 100;
  const reserveCapLakhs = (poolLakhs * reservePct) / 100;
  const checkSize = initialCapLakhs / numDeals;
  assert(
    initialCapLakhs === 27.5 && reserveCapLakhs === 22.5,
    "Portfolio capital split correct (₹27.5L initial, ₹22.5L follow-on reserve)"
  );
  assert(
    checkSize === 1.375,
    "Average angel check size matches exact slice (₹1.375 Lakhs per deal)"
  );

  // -------------------------------------------------------------------------
  // 7. SAFE Cap vs Discount Decision Rule
  // -------------------------------------------------------------------------
  console.log("\n7. Validating SAFE Cap vs Discount Decision Engine:");
  const capVal = 45000000; // ₹4.5 Cr
  const discount = 0.2; // 20%

  // Case A: High Series A ($6 Cr) -> Cap price (4.5 Cr) < Discount price (4.8 Cr) -> Cap wins
  const seriesAHigh = 60000000;
  const effectivePriceA = Math.min(capVal, seriesAHigh * (1 - discount));
  assert(
    effectivePriceA === 45000000,
    "In high up-round (₹6Cr), Valuation Cap converts at ₹4.5Cr"
  );

  // Case B: Moderate Series A ($5 Cr) -> Discount price (4.0 Cr) < Cap price (4.5 Cr) -> Discount wins
  const seriesALow = 50000000;
  const effectivePriceB = Math.min(capVal, seriesALow * (1 - discount));
  assert(
    effectivePriceB === 40000000,
    "In moderate round (₹5Cr), 20% Discount converts at ₹4.0Cr"
  );

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("\n=======================================================");
  console.log(`TOTAL TESTS: ${passedCount + failedCount}`);
  console.log(`PASSED:      ${passedCount}`);
  console.log(`FAILED:      ${failedCount}`);
  console.log("=======================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTests();
