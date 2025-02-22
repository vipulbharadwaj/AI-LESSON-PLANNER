import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LessonPlanDisplay from "./LessonPlanDisplay"; 
import { generateLessonPlan } from "../services/geminiAPI"; 

const PlannerPage = () => {
  const [formData, setFormData] = useState({
    date: "",
    subject: "",
    gradeLevel: "",
    topic: "",
    subtopics: "",
    materials: "",
    objectives: "",
    outline: "",
    notes: "",
  });

  const [lessonPlan, setLessonPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Generate lesson plan
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generatedPlan = await generateLessonPlan(formData);
      setLessonPlan(generatedPlan);
    } catch (error) {
      console.error("API error:", error);
      alert("Error generating lesson plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">AI-Powered Lesson Planner</h1>

      <Card className="p-6 max-w-2xl mx-auto mb-6">
        <h2 className="text-xl font-semibold mb-4">Create Lesson Plan</h2>
        <div className="space-y-4">
          <Input
            name="date"
            placeholder="Date (e.g., February 20, 2025)"
            value={formData.date}
            onChange={handleChange}
          />
          <Input
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <Input
            name="gradeLevel"
            placeholder="Year Group or Grade Level"
            value={formData.gradeLevel}
            onChange={handleChange}
          />
          <Input
            name="topic"
            placeholder="Main Topic or Unit"
            value={formData.topic}
            onChange={handleChange}
          />
          <Textarea
            name="subtopics"
            placeholder="Subtopics or Key Concepts (comma-separated)"
            value={formData.subtopics}
            onChange={handleChange}
          />
          <Textarea
            name="materials"
            placeholder="Materials Needed"
            value={formData.materials}
            onChange={handleChange}
          />
          <Textarea
            name="objectives"
            placeholder="Learning Objectives (at least 2, Bloom's Taxonomy)"
            value={formData.objectives}
            onChange={handleChange}
          />
          <Textarea
            name="outline"
            placeholder="Lesson Outline (e.g., 5 min|Springboard|Engage)"
            value={formData.outline}
            onChange={handleChange}
          />
          <Textarea
            name="notes"
            placeholder="Notes (pre/post-lesson remarks)"
            value={formData.notes}
            onChange={handleChange}
          />
          <Button onClick={handleGenerate} className="w-full">
            Generate Lesson Plan
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {loading && <Skeleton className="w-full h-64 max-w-4xl mx-auto" />}

      {/* Display Section */}
      {lessonPlan && !loading && (
        <LessonPlanDisplay lessonPlan={lessonPlan} setLessonPlan={setLessonPlan} />
      )}
    </div>
  );
};

export default PlannerPage;