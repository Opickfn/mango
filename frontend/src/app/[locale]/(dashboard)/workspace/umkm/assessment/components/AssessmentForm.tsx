"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/src/i18n/navigation";
import { api } from "@/src/lib/http/axios";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Loader2, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  id: number;
  text: string;
  type: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  questions: Question[];
}

export default function AssessmentForm({ umkmId }: { umkmId: number }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { value: string; score: number }>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "destructive"; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Questions
        const qRes = await api.get("/v1/assessments/questions");
        setCategories(qRes.data.data);

        // 2. Create or Get Assessment Session
        const aRes = await api.post("/v1/assessments", { umkm_id: umkmId });
        const assessment = aRes.data.data;
        setAssessmentId(assessment.id);

        // 3. Populate existing answers if any
        if (assessment.answers && assessment.answers.length > 0) {
          const existingAnswers: Record<number, { value: string; score: number }> = {};
          assessment.answers.forEach((ans: any) => {
            existingAnswers[ans.question_id] = { 
              value: ans.value, 
              score: parseFloat(ans.score) 
            };
          });
          setAnswers(existingAnswers);
        }
      } catch (error) {
        console.error("Failed to initialize assessment", error);
        setStatus({ type: "destructive", message: "Failed to load assessment questions. Please try again later." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [umkmId]);

  const handleScoreSelect = (questionId: number, score: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { value: score.toString(), score },
    }));
  };

  const nextStep = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (!assessmentId) return;
    setSubmitting(true);
    setStatus(null);
    try {
      // 1. Submit Answers
      const answerPayload = Object.entries(answers).map(([qId, data]) => ({
        question_id: parseInt(qId),
        value: data.value,
        score: data.score,
      }));

      await api.post(`/v1/assessments/${assessmentId}/answers`, { answers: answerPayload });

      // 2. Calculate
      await api.post(`/v1/assessments/${assessmentId}/calculate`);

      setStatus({ type: "success", message: "Assessment submitted successfully! Redirecting to results..." });
      
      // 3. Redirect to Result after a short delay
      setTimeout(() => {
        router.push(`/workspace/umkm/assessment/${assessmentId}/result`);
      }, 1500);
    } catch (error: any) {
      console.error("Failed to submit assessment", error);
      setStatus({ type: "destructive", message: error.response?.data?.message || "Failed to submit assessment." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">Memuat kuesioner...</p>
      </div>
    );
  }

  if (categories.length === 0) return null;

  const category = categories[currentStep];
  const progress = ((currentStep + 1) / categories.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {status && (
        <Alert 
          variant={status.type} 
          className="animate-in fade-in slide-in-from-top-2 duration-300"
        >
          {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription className="flex items-center justify-between">
            {status.message}
            <button 
              onClick={() => setStatus(null)}
              className="ml-4 text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100 transition-opacity"
            >
              Close
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Dimensi: {category.name}</span>
          <span>Tahap {currentStep + 1} dari {categories.length}</span>
        </div>
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-mango-blue"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50 p-8">
              <CardTitle className="text-2xl font-extrabold text-mango-blue">{category.name}</CardTitle>
              <CardDescription>Berikan penilaian objektif pada parameter berikut (Skala 1-5)</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {category.questions.map((q) => (
                <div key={q.id} className="space-y-4">
                  <p className="text-lg font-semibold text-foreground leading-relaxed">
                    {q.text}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => handleScoreSelect(q.id, score)}
                        className={`
                          h-12 w-12 rounded-xl border-2 font-bold transition-all
                          ${answers[q.id]?.score === score 
                            ? "bg-mango-blue border-mango-blue text-white shadow-lg shadow-mango-blue/20 scale-110" 
                            : "bg-background border-border text-muted-foreground hover:border-mango-blue/50 hover:text-mango-blue"}
                        `}
                      >
                        {score}
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground self-center italic">
                      {answers[q.id]?.score === 1 && "— Belum Dilakukan"}
                      {answers[q.id]?.score === 5 && "— Sudah Terstandarisasi"}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center bg-background/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 sticky bottom-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0 || submitting}
          className="h-12 rounded-xl px-6 gap-2"
        >
          <ChevronLeft size={20} />
          Kembali
        </Button>

        {currentStep === categories.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length < categories.reduce((acc, cat) => acc + cat.questions.length, 0)}
            className="h-12 rounded-xl px-8 bg-success hover:bg-success/90 text-white font-bold gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
            Selesaikan Assessment
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={category.questions.some(q => !answers[q.id])}
            className="h-12 rounded-xl px-8 bg-mango-blue hover:bg-mango-hover font-bold gap-2"
          >
            Lanjutkan
            <ChevronRight size={20} />
          </Button>
        )}
      </div>
    </div>
  );
}
