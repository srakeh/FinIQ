"use client";

import { useState } from "react";
import {
  generateQuizQuestions,
  recordQuizAttempt,
  QuizQuestion,
} from "@/actions/quiz";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Calculator,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface QuizAttemptRecord {
  id: string;
  topic: string;
  score: number;
  totalScore: number;
  completedAt: Date;
}

const TOPICS = [
  {
    title: "Angel Investing 101",
    desc: "SAFEs, convertible notes, valuation caps, and founder vesting.",
    icon: Briefcase,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Valuation & Cap Tables",
    desc: "Pre/post money math, dilution, ESOP pools, and liquidation preferences.",
    icon: Calculator,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Indian Startup Taxation & Regulation",
    desc: "Section 56(2)(viib) abolition, LTCG rules, and Section 80-IAC.",
    icon: ShieldCheck,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    title: "Venture Capital Due Diligence",
    desc: "LTV/CAC ratios, payback cycles, TAM/SAM/SOM, and NRR metrics.",
    icon: TrendingUp,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
];

export function QuizEngine({
  initialHistory = [],
}: {
  initialHistory?: QuizAttemptRecord[];
}) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  // Active quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [history, setHistory] = useState<QuizAttemptRecord[]>(initialHistory);

  // Start a quiz on topic
  const startQuiz = async (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setLoading(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const res = await generateQuizQuestions(topicTitle);
      if (res.success && res.questions.length > 0) {
        setQuestions(res.questions);
        setIsAiGenerated(res.isAiGenerated);
      } else {
        toast.error("Failed to load questions. Please choose another topic.");
        setSelectedTopic(null);
      }
    } catch {
      toast.error("Error starting quiz.");
      setSelectedTopic(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle option selection
  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // Prevent changing after selection

    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  // Move to next question or complete quiz
  const handleNext = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Finished quiz
      setQuizFinished(true);
      const finalScore =
        score +
        (selectedAnswer === questions[currentIndex].correctAnswer ? 0 : 0); // score already updated

      // Save to database
      if (selectedTopic) {
        try {
          const res = await recordQuizAttempt({
            topic: selectedTopic,
            score: finalScore,
            totalScore: questions.length,
          });

          if (res.success) {
            toast.success("Quiz completed! Score saved to your profile.");
            // Append locally to history
            setHistory((prev) => [
              {
                id: res.attemptId || Math.random().toString(),
                topic: selectedTopic,
                score: finalScore,
                totalScore: questions.length,
                completedAt: new Date(),
              },
              ...prev,
            ]);
          }
        } catch {
          console.error("Failed to save quiz attempt.");
        }
      }
    }
  };

  // Reset back to topic selection
  const resetQuiz = () => {
    setSelectedTopic(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Evaluation tier helper
  const getTier = (s: number, total: number) => {
    const pct = Math.round((s / total) * 100);
    if (pct === 100) return { label: "Master Investor 🏆", color: "text-emerald-500" };
    if (pct >= 80) return { label: "Senior Venture Partner 🚀", color: "text-blue-500" };
    if (pct >= 60) return { label: "Savvy Analyst 📈", color: "text-amber-500" };
    return { label: "Junior Scout — Keep Practicing 💡", color: "text-zinc-400" };
  };

  // Loading screen
  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto p-12 text-center bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Generating Financial Quiz...
        </h3>
        <p className="text-sm text-zinc-500 mt-1">
          Our AI is synthesizing real-world scenarios on {selectedTopic}.
        </p>
      </Card>
    );
  }

  // Quiz Finished / Scorecard view
  if (quizFinished && selectedTopic) {
    const tier = getTier(score, questions.length);
    const pct = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-center p-8">
          <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mb-4">
            <Trophy className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Quiz Completed!
          </h2>
          <p className="text-sm text-zinc-500 mt-1">{selectedTopic}</p>

          <div className="my-6">
            <div className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {score} <span className="text-2xl text-zinc-400">/ {questions.length}</span>
            </div>
            <p className={`text-lg font-semibold mt-2 ${tier.color}`}>
              {tier.label} ({pct}%)
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => startQuiz(selectedTopic)}
              className="border-zinc-300 dark:border-zinc-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Topic
            </Button>
            <Button
              onClick={resetQuiz}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              Choose New Topic
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Active Question view
  if (selectedTopic && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {selectedTopic}
            </span>
            {isAiGenerated && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-500" /> AI-Generated
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetQuiz}
            className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Exit Quiz
          </Button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-zinc-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold leading-relaxed text-zinc-900 dark:text-zinc-50">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQ.correctAnswer;

              let style =
                "border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100";

              if (isAnswered) {
                if (isCorrect) {
                  style =
                    "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold";
                } else if (isSelected && !isCorrect) {
                  style =
                    "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-200";
                } else {
                  style = "opacity-50 border-zinc-200 dark:border-zinc-800";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-xs font-semibold shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                </button>
              );
            })}

            {/* Explanation box */}
            {isAnswered && (
              <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed animate-in fade-in">
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mb-1">
                  <HelpCircle className="h-4 w-4 text-emerald-500" /> Financial Insight
                </div>
                {currentQ.explanation}
              </div>
            )}

            {/* Next button */}
            {isAnswered && (
              <div className="pt-4 flex justify-end">
                <Button
                  onClick={handleNext}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                >
                  {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Topic Selection (Default screen)
  return (
    <div className="space-y-8">
      {/* Topics Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <Card
            key={t.title}
            onClick={() => startQuiz(t.title)}
            className="cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          >
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
              <div className={`p-3 rounded-xl ${t.bg} ${t.color}`}>
                <t.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {t.title}
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs leading-relaxed">
                  {t.desc}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="text-zinc-500">5 Questions • Multiple Choice</span>
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  Start Quiz <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quiz Attempts Table */}
      {history.length > 0 && (
        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Recent Quiz Attempts
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Your historical scores and investment knowledge milestones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {history.slice(0, 5).map((attempt) => {
                const pct = Math.round((attempt.score / attempt.totalScore) * 100);
                return (
                  <div
                    key={attempt.id}
                    className="py-3 flex items-center justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-zinc-100">
                        {attempt.topic}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {new Date(attempt.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          pct >= 80
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            : pct >= 60
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {attempt.score}/{attempt.totalScore} ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
