// import { GoogleGenAI } from "@google/genai";
// import { GeminiContent } from "./types";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export async function generateReply(
//  systemInstruction: string,
//   contents: GeminiContent[]
// ) {
//   const response = await ai.models.generateContent({
//     model: "models/gemini-flash-latest",

//     config: {
//       systemInstruction,
//     },

//    contents,
//   });

//   return response.text;
// }

// // export async function generateReplyStream(
// //   systemInstruction: string,
// //   contents: GeminiContent[]
// // ) {
// //   return ai.models.generateContentStream({
// //     model: "models/gemini-flash-latest",

// //     config: {
// //       systemInstruction,
// //     },

// //     contents,
// //   });
// // }


// export async function generateReplyStream(
//     systemInstruction: string,
//     contents: GeminiContent[]
// ) {
//     const maxAttempts = 3;

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//         try {
//             console.log(`Gemini attempt: ${attempt}`);

//             const stream = await ai.models.generateContentStream({
//                 model: "models/gemini-flash-latest",
//                 config: {
//                     systemInstruction,
//                 },
//                 contents,
//             });

//             console.log("Gemini stream connected successfully!");

//             return stream;

//         } catch (error) {
//             console.error(`Gemini attempt ${attempt} failed:`, error);

//             const errorMessage =
//                 error instanceof Error
//                     ? error.message
//                     : String(error);

//             const isTemporaryError =
//                 errorMessage.includes("503") ||
//                 errorMessage.includes("UNAVAILABLE") ||
//                 errorMessage.includes("Service Unavailable");

//             if (!isTemporaryError || attempt === maxAttempts) {
//                 throw error;
//             }

//             const delay = 1000 * Math.pow(2, attempt - 1);

//             console.log(`Retrying in ${delay}ms...`);

//             await new Promise((resolve) =>
//                 setTimeout(resolve, delay)
//             );
//         }
//     }

//     throw new Error("Gemini failed after multiple attempts");
// }



// import { GoogleGenAI } from "@google/genai";
// import type { GeminiContent } from "./types";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// const MODEL = "gemini-flash-latest";

// export async function generateReply(
//   systemInstruction: string,
//   contents: GeminiContent[]
// ) {
//   const response = await ai.models.generateContent({
//     model: MODEL,
//     config: {
//       systemInstruction,
//     },
//     contents,
//   });

//   return response.text;
// }

// // Helper function to identify temporary errors
// function isRetryableError(error: unknown): boolean {
//   const err = error as {
//     message?: string;
//     status?: number;
//     code?: string;
//     cause?: {
//       code?: string;
//       message?: string;
//     };
//   };

//   const message = `${err.message ?? ""} ${err.cause?.message ?? ""}`
//     .toLowerCase();

//   const status = err.status;
//   const code = err.code || err.cause?.code;

//   return (
//     [429, 500, 502, 503, 504].includes(status ?? 0) ||
//     [
//       "UND_ERR_HEADERS_TIMEOUT",
//       "UND_ERR_CONNECT_TIMEOUT",
//       "ECONNRESET",
//       "ETIMEDOUT",
//       "ECONNREFUSED",
//     ].includes(code ?? "") ||
//     message.includes("timeout") ||
//     message.includes("fetch failed") ||
//     message.includes("unavailable") ||
//     message.includes("high demand")
//   );
// }

// export async function generateReplyStream(
//   systemInstruction: string,
//   contents: GeminiContent[]
// ) {
//   const maxAttempts = 3;

//   for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//     try {
//       console.log(`Gemini attempt: ${attempt}`);

//       const stream = await ai.models.generateContentStream({
//         model: MODEL,
//         config: {
//           systemInstruction,
//         },
//         contents,
//       });

//       console.log("Gemini stream connected successfully!");

//       return stream;

//     } catch (error) {
//       console.error(
//         `Gemini attempt ${attempt} failed:`,
//         error
//       );

//       if (!isRetryableError(error) || attempt === maxAttempts) {
//         throw error;
//       }

//       // Exponential backoff
//       const delay = 2000 * Math.pow(2, attempt - 1);

//       console.log(`Retrying in ${delay}ms...`);

//       await new Promise((resolve) =>
//         setTimeout(resolve, delay)
//       );
//     }
//   }

//   throw new Error("Gemini failed after multiple attempts");
// }


// import { GoogleGenAI } from "@google/genai";
// import type { GeminiContent } from "./types";

// const apiKey = process.env.GEMINI_API_KEY;

// if (!apiKey) {
//     throw new Error("GEMINI_API_KEY is missing from environment variables");
// }

// const ai = new GoogleGenAI({ apiKey });

// const MODEL = "gemini-flash-latest";

// // Check whether an error is temporary
// function isRetryableError(error: unknown): boolean {
//     const err = error as {
//         message?: string;
//         status?: number;
//         statusCode?: number;
//         code?: string;
//         cause?: {
//             code?: string;
//             message?: string;
//         };
//     };

//     const message = `${err.message ?? ""} ${err.cause?.message ?? ""}`
//         .toLowerCase();

//     const status = err.status ?? err.statusCode;
//     const code = err.code ?? err.cause?.code;

//     return (
//         [500, 502, 503, 504].includes(status ?? 0) ||
//         [
//             "UND_ERR_HEADERS_TIMEOUT",
//             "UND_ERR_CONNECT_TIMEOUT",
//             "ECONNRESET",
//             "ETIMEDOUT",
//         ].includes(code ?? "") ||
//         message.includes("timeout") ||
//         message.includes("fetch failed") ||
//         message.includes("unavailable") ||
//         message.includes("high demand")
//     );
// }

// // Normal non-streaming response
// export async function generateReply(
//     systemInstruction: string,
//     contents: GeminiContent[]
// ) {
//     const response = await ai.models.generateContent({
//         model: MODEL,
//         config: {
//             systemInstruction,
//         },
//         contents,
//     });

//     return response.text;
// }

// // Streaming response with controlled retries
// export async function* generateReplyStream(
//     systemInstruction: string,
//     contents: GeminiContent[]
// ): AsyncGenerator<string> {

//     const maxAttempts = 2;

//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {

//         let receivedText = false;

//         try {
//             console.log(`Gemini attempt: ${attempt}`);

//             const stream = await ai.models.generateContentStream({
//                 model: MODEL,
//                 config: {
//                     systemInstruction,
//                 },
//                 contents,
//             });

//             console.log("Gemini stream connected!");

//             for await (const chunk of stream) {
//                 const text = chunk.text;

//                 if (text) {
//                     receivedText = true;
//                     yield text;
//                 }
//             }

//             console.log("Gemini stream completed!");

//             return;

//         } catch (error) {

//             console.error(
//                 `Gemini attempt ${attempt} failed:`,
//                 error
//             );

//             // Never restart a response after sending partial text
//             if (
//                 receivedText ||
//                 !isRetryableError(error) ||
//                 attempt === maxAttempts
//             ) {
//                 throw error;
//             }

//             const delay = 1000 * Math.pow(2, attempt - 1);

//             console.log(`Retrying in ${delay}ms...`);

//             await new Promise(resolve =>
//                 setTimeout(resolve, delay)
//             );
//         }
//     }

//     throw new Error("Gemini failed after multiple attempts");
// }


import { GoogleGenAI } from "@google/genai";
import type { GeminiContent } from "./types";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from environment variables");
}

const ai = new GoogleGenAI({ apiKey });

const MODEL ="gemini-flash-lite-latest";

// Check whether an error is temporary
function isRetryableError(error: unknown): boolean {
    const err = error as {
        message?: string;
        status?: number | string;
        statusCode?: number;
        code?: string;
        cause?: {
            code?: string;
            message?: string;
        };
    };

    const message =
        `${err.message ?? ""} ${err.cause?.message ?? ""}`
            .toLowerCase();

    const status = Number(err.status ?? err.statusCode);

    const code = String(err.code ?? err.cause?.code ?? "");

    // Temporary server errors
    if ([500, 502, 503, 504].includes(status)) {
        return true;
    }

    // Retry temporary rate limits, not exhausted quotas
    if (
        status === 429 &&
        (message.includes("rate limit") ||
            message.includes("too many requests"))
    ) {
        return true;
    }

    // Temporary network errors
    const networkErrors = [
        "UND_ERR_HEADERS_TIMEOUT",
        "UND_ERR_CONNECT_TIMEOUT",
        "ECONNRESET",
        "ECONNREFUSED",
        "ETIMEDOUT",
        "EAI_AGAIN",
    ];

    return (
        networkErrors.includes(code) ||
        message.includes("timeout") ||
        message.includes("fetch failed") ||
        message.includes("unavailable") ||
        message.includes("high demand")
    );
}

// Normal non-streaming response
export async function generateReply(
    systemInstruction: string,
    contents: GeminiContent[]
) {
    const response = await ai.models.generateContent({
        model: MODEL,
        config: {
            systemInstruction,
        },
        contents,
    });

    return response.text;
}

// Streaming response with controlled retries
export async function* generateReplyStream(
    systemInstruction: string,
    contents: GeminiContent[]
): AsyncGenerator<string> {

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        let receivedText = false;

        try {
            console.log(`Gemini attempt: ${attempt}`);

            const stream = await ai.models.generateContentStream({
                model: MODEL,
                config: {
                    systemInstruction,
                },
                contents,
            });

            console.log("Gemini stream connected!");

            for await (const chunk of stream) {
                const text = chunk.text;

                if (text) {
                    receivedText = true;
                    yield text;
                }
            }

            console.log("Gemini stream completed!");

            return;

        } catch (error) {

            console.error(
                `Gemini attempt ${attempt} failed:`,
                error
            );

            // Never restart after sending partial text
            if (
                receivedText ||
                !isRetryableError(error) ||
                attempt === maxAttempts
            ) {
                throw error;
            }

            // Exponential backoff: 1s, then 2s
            const delay = 1000 * Math.pow(2, attempt - 1);

            console.log(`Retrying in ${delay}ms...`);

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );
        }
    }

    throw new Error("Gemini failed after multiple attempts");
}
