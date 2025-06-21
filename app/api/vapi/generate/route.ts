import {generateText} from "ai";
import {google} from "@ai-sdk/google";
import {getRandomInterviewCover} from "@/lib/utils";
import {db} from "@/firebase/admin";

export async function POST(request: Request) {
    console.log("✅ /api/vapi/generate called");

    const body = await request.json();
    console.log("📦 Incoming body:", body);

    const { type, role, level, techstack, amount, userid } = body;

    try {
        const { text: questionsRaw } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `
      Prepare ${amount} ${type} interview questions for a ${role} role.
      Experience level: ${level}, Tech stack: ${techstack}.
      Return ONLY an array of questions like this:
      ["Question 1", "Question 2", "Question 3"]
      No intro or extra text.
    `,
        });

        let parsedQuestions;

        try {
            parsedQuestions = JSON.parse(questionsRaw);
        } catch (error) {
            console.error("❌ JSON Parse Error:", questionsRaw);
            return Response.json({ success: false, error: "Invalid question format from Gemini" });
        }

        const interview = {
            role,
            type,
            level,
            techstack: techstack.split(","),
            questions: parsedQuestions,
            userId: userid,
            finalized: true,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
        };

        await db.collection("interviews").add(interview);
        console.log("✅ Interview stored in Firestore");

        return Response.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("❌ Error generating/storing interview:", error);
        return Response.json({ success: false, error }, { status: 500 });
    }
}
