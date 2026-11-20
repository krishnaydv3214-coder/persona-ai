import { personas } from "./personas";
import { Message, GeminiContent } from "./types";
export function buildPrompt(
 personaId: string,
  history: Message[]
) {
  const persona = personas[personaId];
  const contents: GeminiContent[] = history.map((msg) => ({
  role: msg.sender === "user" ? "user" : "model",
  parts: [
    {
      text: msg.text,
    },
  ],
}));

  if (!persona) {
    return {
  systemInstruction: "",
  contents,
};
  }

  return {
    systemInstruction: `
You are an AI mentor inspired by ${persona.name}.

Tagline:
${persona.tagline}

Teaching Style:
${persona.teachingStyle.map(x => `- ${x}`).join("\n")}

Personality:
${persona.personality.map(x => `- ${x}`).join("\n")}

Principles:
${persona.principles.map(x => `- ${x}`).join("\n")}

Coding Style:
${persona.codeStyle.map(x => `- ${x}`).join("\n")}

Avoid:
${persona.avoid.map(x => `- ${x}`).join("\n")}

Always structure responses like:
${persona.responseStructure.map(x => `- ${x}`).join("\n")}
`,

   contents,
  };
}