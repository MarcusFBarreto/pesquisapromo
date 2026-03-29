import { NextResponse } from "next/server";

/**
 * GET /api/chat/debug — diagnostic endpoint to check Gemini API status.
 * Tries a simple generation and reports back what happened.
 */
export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return NextResponse.json({
      status: "❌ SEM CHAVE",
      detail: "GEMINI_API_KEY não encontrada no .env.local",
      envKeys: Object.keys(process.env).filter((k) => k.includes("GEMINI")),
    });
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(key);
    
    // Try both models
    const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];
    for (const modelId of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        const result = await model.generateContent("Diga apenas: OK");
        const text = result.response.text();
        return NextResponse.json({
          status: "✅ FUNCIONANDO",
          model: modelId,
          response: text,
          keyPrefix: key.slice(0, 10) + "...",
        });
      } catch (e: unknown) {
        const err = e as Error;
        console.log(`[Debug] ${modelId} falhou: ${err.message?.slice(0, 80)}`);
        continue; // try next model
      }
    }
    
    return NextResponse.json({
      status: "❌ AMBOS MODELOS COM QUOTA ESGOTADA",
      detail: "Tente novamente em alguns minutos, ou ative o billing do projeto Google.",
      keyPrefix: key.slice(0, 10) + "...",
    });
  } catch (error: unknown) {
    const err = error as Error & { status?: number; statusText?: string };
    return NextResponse.json({
      status: "❌ ERRO",
      error: err.message,
      httpStatus: err.status,
      statusText: err.statusText,
      keyPrefix: key.slice(0, 10) + "...",
    });
  }
}
