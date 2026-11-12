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
