import axios from "axios";

const API_KEY = "AIzaSyCYyp1ZCHxt2wiTxsPQcwd9cmJl9i7HXFk"; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

export const generateLessonPlan = async (formData) => {
  try {
    const prompt = `
      Based on the following inputs, generate a complete lesson plan in the exact format specified below. Use the provided details where available and create appropriate content for any missing sections to ensure a full lesson plan is generated. Do not leave any fields empty.

      Inputs:
      - Topic: ${formData.topic || "unspecified"}
      - Date: ${formData.date || "unspecified"}
      - Subject: ${formData.subject || "unspecified"}
      - Grade Level: ${formData.gradeLevel || "unspecified"}
      - Subtopics: ${formData.subtopics || "unspecified"}
      - Materials: ${formData.materials || "unspecified"}
      - Objectives: ${formData.objectives || "unspecified"}
      - Outline: ${formData.outline || "unspecified"}
      - Notes: ${formData.notes || "unspecified"}

      Format the lesson plan exactly like this:

      **LESSON PLAN**

      **Topic:** [Generated or Input Topic]

      **Summary**
      | Field | Value |
      |------|------|
      | Date | [Generated or Input Date] |
      | Subject | [Generated or Input Subject] |
      | Year Group or Grade Level | [Generated or Input Grade Level] |
      | Main Topic or Unit | [Generated or Input Topic] |
      | Subtopics or Key Concepts | [Generated or Input Subtopics] |

      **Materials Needed**
      [Generated or Input Materials]

      **Learning Objectives**
      [Generated or Input Objectives]

      **Lesson Outline**
      | Duration | Guide | Remarks |
      | [Generated or Input Outline Rows] |

      **Notes**
      [Generated or Input Notes]
    `;

    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Raw Gemini API Response:", response.data);

    const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      console.error("No content returned from API. Full response:", response.data);
      throw new Error("Failed to generate lesson plan");
    }

    return parseGeneratedText(generatedText);
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate lesson plan");
  }
};

const parseGeneratedText = (text) => {
  const summaryMatch = text.match(/\*\*Summary\*\*\s*\n([\s\S]+?)(?=\*\*Materials Needed|\*\*Learning Objectives|\*\*Lesson Outline|\*\*Notes|$)/);
  
  let date = "",
      subject = "",
      gradeLevel = "",
      topic = "",
      subtopics = "";

  if (summaryMatch) {
    const summaryLines = summaryMatch[1]
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.startsWith("|")); 

    summaryLines.forEach(line => {
      const parts = line.split("|").map(part => part.trim());
      if (parts.length >= 3) {
        const key = parts[1].toLowerCase();
        const value = parts[2] || "";
        
        if (key.includes("date")) date = value;
        if (key.includes("subject")) subject = value;
        if (key.includes("year group") || key.includes("grade level")) gradeLevel = value;
        if (key.includes("main topic")) topic = value;
        if (key.includes("subtopics")) subtopics = value;
      }
    });
  }

  const materialsMatch = text.match(/\*\*Materials Needed\*\*\s*([\s\S]+?)(?=\*\*Learning Objectives|\*\*Lesson Outline|\*\*Notes|$)/);
  const objectivesMatch = text.match(/\*\*Learning Objectives\*\*\s*([\s\S]+?)(?=\*\*Lesson Outline|\*\*Notes|$)/);
  const outlineMatch = text.match(/\*\*Lesson Outline\*\*\s*([\s\S]+?)(?=\*\*Notes|$)/);
  const notesMatch = text.match(/\*\*Notes\*\*\s*([\s\S]+)/);

  const outlineRows = outlineMatch?.[1]?.split("\n").filter(line => line.startsWith("|"));
  const outline = outlineRows?.map(row => {
    const [duration, guide, remarks] = row.split("|").map(part => part.trim()).filter(Boolean);
    return { duration, guide, remarks };
  }) || [];

  return {
    date,
    subject,
    gradeLevel,
    topic,
    subtopics,
    materials: materialsMatch?.[1]?.trim() || "",
    objectives: objectivesMatch?.[1]?.trim() || "",
    outline,
    notes: notesMatch?.[1]?.trim() || "",
  };
};
