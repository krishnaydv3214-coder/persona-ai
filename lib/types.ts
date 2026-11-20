
export type Message = {
  sender: "user" | "ai";
  text: string;
};
export type GeminiContent = {
  role: "user" | "model";
  parts: {
    text: string;
  }[];
};
export type Persona = {
  id: string;

  name: string;

  tagline: string;

  greeting: string;

  teachingStyle: string[];

  personality: string[];

  principles: string[];

  codeStyle: string[];

  avoid: string[];

  responseStructure: string[];
};