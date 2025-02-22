import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const LessonPlanDisplay = ({ lessonPlan, setLessonPlan }) => {
  const componentRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!componentRef.current) {
      console.error("❌ No content to print.");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(18);
    doc.text("LESSON PLAN", 105, 15, null, null, "center");

    // Topic
    doc.setFontSize(14);
    doc.text(`Topic: ${lessonPlan?.topic || "N/A"}`, 14, 30);

    // Summary Table
    doc.setFontSize(12);
    doc.text("Summary", 14, 40);
    doc.autoTable({
      startY: 45,
      theme: "grid",
      head: [["Field", "Details"]],
      body: [
        ["Date", lessonPlan?.date || "N/A"],
        ["Subject", lessonPlan?.subject || "N/A"],
        ["Year Group or Grade Level", lessonPlan?.gradeLevel || "N/A"],
        ["Main Topic or Unit", lessonPlan?.topic || "N/A"],
        ["Subtopics or Key Concepts", lessonPlan?.subtopics || "N/A"],
      ],
      styles: { fontSize: 10 },
    });

    // Materials Needed
    doc.text("Materials Needed", 14, doc.lastAutoTable.finalY + 10);
    doc.setFontSize(10);
    doc.text(
      lessonPlan?.materials || "Include relevant materials needed for the lesson.",
      14,
      doc.lastAutoTable.finalY + 16,
      { maxWidth: 180 }
    );

    // Learning Objectives
    doc.setFontSize(12);
    doc.text("Learning Objectives", 14, doc.lastAutoTable.finalY + 30);
    doc.setFontSize(10);
    doc.text(
      lessonPlan?.objectives || "Define the learning objectives based on Bloom's Taxonomy.",
      14,
      doc.lastAutoTable.finalY + 36,
      { maxWidth: 180 }
    );

    // Lesson Outline Table
    doc.setFontSize(12);
    doc.text("Lesson Outline", 14, doc.lastAutoTable.finalY + 50);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 55,
      theme: "grid",
      head: [["Duration", "Guide", "Remarks"]],
      body:
        lessonPlan?.outline?.map((row) => [
          row.duration || "xx minutes",
          row.guide || "",
          row.remarks || "",
        ]) || [
          ["xx minutes", "Springboard activity", "Engage students"],
          ["xx minutes", "Introduction", "Present lesson topic"],
          ["xx minutes", "Review", "Recap previous learning"],
          ["xx minutes", "Main Discussion", "Deliver key concepts"],
          ["xx minutes", "Guided Activities", "Interactive learning"],
          ["xx minutes", "Assessment", "Evaluate student understanding"],
        ],
      styles: { fontSize: 10 },
    });

    // Notes
    doc.setFontSize(12);
    doc.text("Notes", 14, doc.lastAutoTable.finalY + 10);
    doc.setFontSize(10);
    doc.text(
      lessonPlan?.notes || "Pre-lesson and post-lesson observations go here.",
      14,
      doc.lastAutoTable.finalY + 16,
      { maxWidth: 180 }
    );

    // Save PDF
    doc.save(`${lessonPlan?.topic || "Lesson_Plan"}.pdf`);
  };

  const handleEdit = (field, value) => {
    setLessonPlan((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4">
      <div className="p-4 border rounded-lg shadow-lg bg-white">
        <div ref={componentRef} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">LESSON PLAN</h2>

          <h3 className="text-lg font-semibold mb-2">Topic</h3>
          <Input value={lessonPlan?.topic || ""} onChange={(e) => handleEdit("topic", e.target.value)} />

          <h3 className="text-lg font-semibold mt-4">Summary</h3>
          <table className="w-full border-collapse border">
            <tbody>
              {[
                ["Date", "date"],
                ["Subject", "subject"],
                ["Year Group or Grade Level", "gradeLevel"],
                ["Main Topic or Unit", "topic"],
                ["Subtopics or Key Concepts", "subtopics"],
              ].map(([label, key]) => (
                <tr key={key}>
                  <td className="border p-2 font-semibold">{label}</td>
                  <td className="border p-2">
                    <Input value={lessonPlan?.[key] || ""} onChange={(e) => handleEdit(key, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold mt-4">Materials Needed</h3>
          <Textarea value={lessonPlan?.materials || ""} onChange={(e) => handleEdit("materials", e.target.value)} />

          <h3 className="text-lg font-semibold mt-4">Learning Objectives</h3>
          <Textarea value={lessonPlan?.objectives || ""} onChange={(e) => handleEdit("objectives", e.target.value)} />

          <h3 className="text-lg font-semibold mt-4">Lesson Outline</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Duration</th>
                <th className="border p-2">Guide</th>
                <th className="border p-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {(lessonPlan?.outline || []).map((row, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <Input value={row?.duration || ""} onChange={(e) => handleEdit(`outline.${index}.duration`, e.target.value)} />
                  </td>
                  <td className="border p-2">
                    <Input value={row?.guide || ""} onChange={(e) => handleEdit(`outline.${index}.guide`, e.target.value)} />
                  </td>
                  <td className="border p-2">
                    <Input value={row?.remarks || ""} onChange={(e) => handleEdit(`outline.${index}.remarks`, e.target.value)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-lg font-semibold mt-4">Notes</h3>
          <Textarea value={lessonPlan?.notes || ""} onChange={(e) => handleEdit("notes", e.target.value)} />
        </div>
      </div>

      <Button onClick={handleDownloadPDF} className="mt-4">Download as PDF</Button>
    </div>
  );
};

export default LessonPlanDisplay;
