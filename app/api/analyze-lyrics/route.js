import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const LINE_SCHEMA = {
  type: "object",
  properties: {
    language: { type: "string", description: "가사 언어의 한국어 이름 (예: 일본어, 영어, 이탈리아어)" },
    lines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          original: { type: "string" },
          romanized: { type: "string", description: "로마자 발음 표기, 원문이 이미 로마자면 빈 문자열" },
          meaning: { type: "string", description: "자연스러운 한국어 번역" },
          ipa: { type: "string", description: "국제음성기호(IPA) 표기" },
          note: { type: "string", description: "성악 발음(딕션) 관점의 한 문장 유의사항, 한국어" },
        },
        required: ["original", "romanized", "meaning", "ipa", "note"],
      },
    },
  },
  required: ["language", "lines"],
};

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return Response.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
  }

  const { text } = await request.json();
  const lines = (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return Response.json({ error: "가사를 입력해주세요." }, { status: 400 });
  }
  if (lines.length > 40) {
    return Response.json({ error: "가사는 최대 40줄까지 분석할 수 있습니다." }, { status: 400 });
  }

  const numbered = lines.map((line, i) => `${i + 1}. ${line}`).join("\n");
  const prompt = `다음은 사용자가 입력한 노래 가사입니다. 아래 줄들을 순서와 개수를 그대로 유지하며(총 ${lines.length}줄), 각 줄에 대해 romanized(로마자 발음), meaning(자연스러운 한국어 번역), ipa(국제음성기호), note(성악 딕션 관점의 한 문장 유의사항)를 채워서 반환하세요. 가사 전체의 언어를 한국어 이름으로 판단해 language 필드에도 넣으세요.

가사:
${numbered}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: LINE_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text);
    return Response.json(parsed);
  } catch (error) {
    console.error("Gemini lyric analysis failed:", error);
    return Response.json({ error: "가사 분석에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 502 });
  }
}
