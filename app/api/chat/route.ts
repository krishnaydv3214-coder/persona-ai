
// import { NextResponse } from "next/server";
// import { generateReplyStream } from "@/lib/ai";
// import { buildPrompt } from "@/lib/promptBuilder";



// export async function POST(request: Request) {
//     const body = await request.json();
//    const { persona, history } = body;
//     const { systemInstruction, contents } = buildPrompt(
//   persona,
//   history
// );
  

//   console.log(persona);


// const stream = await generateReplyStream(
//   systemInstruction,
//   contents
// );

// const encoder = new TextEncoder();

// const readableStream = new ReadableStream({
//   async start(controller) {
//     try {
//       for await (const chunk of stream) {

//         const text = chunk.text;
//        // console.log("Chunk:", text);

//         if (text) {
//           controller.enqueue(encoder.encode(text));
//         }
//       }

//       controller.close();
//     } catch (error) {
//       controller.error(error);
//     }
//   },
// });

// return new Response(readableStream, {
//   headers: {
//     "Content-Type": "text/plain; charset=utf-8",
//     "Cache-Control": "no-cache",
//   },
// });

// }



// import { generateReplyStream } from "@/lib/ai";
// import { buildPrompt } from "@/lib/promptBuilder";

// export async function POST(request: Request) {
//     let stage = "Starting API";

//     try {
//         stage = "Reading request";

//         const body = await request.json();
//         const { persona, history } = body;

//         console.log("Persona:", persona);
//         console.log("History:", history);

//         stage = "Building prompt";

//         const { systemInstruction, contents } = buildPrompt(
//             persona,
//             history
//         );

//         console.log("Prompt built successfully");
//         console.log("Contents:", contents);

//         stage = "Connecting to Gemini";

//         const stream = await generateReplyStream(
//             systemInstruction,
//             contents
//         );

//         console.log("Gemini stream created successfully");

//         const encoder = new TextEncoder();

//         const readableStream = new ReadableStream({
//             async start(controller) {
//                 try {
//                     for await (const chunk of stream) {
//                         const text = chunk.text;

//                         if (text) {
//                             controller.enqueue(
//                                 encoder.encode(text)
//                             );
//                         }
//                     }

//                     controller.close();

//                 } catch (error) {
//                     console.error("Stream processing error:", error);
//                     controller.error(error);
//                 }
//             },
//         });

//         return new Response(readableStream, {
//             headers: {
//                 "Content-Type": "text/plain; charset=utf-8",
//                 "Cache-Control": "no-cache",
//             },
//         });

//     } catch (error) {
//         console.error(`Error at stage: ${stage}`);
//         console.error("Actual backend error:", error);

//         return Response.json(
//             {
//                 error: error instanceof Error
//                     ? error.message
//                     : String(error),
//                 stage,
//             },
//             { status: 500 }
//         );
//     }
// }



// import { generateReplyStream } from "@/lib/ai";
// import { buildPrompt } from "@/lib/promptBuilder";

// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// export async function POST(request: Request) {
//     try {
//         const body = await request.json();
//         const { persona, history } = body;

//         if (!persona || !Array.isArray(history)) {
//             return Response.json(
//                 { error: "Invalid request data" },
//                 { status: 400 }
//             );
//         }

//         console.log("Persona:", persona);
//         console.log("History:", history);

//         const { systemInstruction, contents } = buildPrompt(
//             persona,
//             history
//         );

//         console.log("Prompt built successfully");

//         const encoder = new TextEncoder();

//         const readableStream = new ReadableStream<Uint8Array>({
//             start(controller) {
//                 (async () => {
//                     try {
//                         console.log("Connecting to Gemini...");

//                         const stream = await generateReplyStream(
//                             systemInstruction,
//                             contents
//                         );

//                         console.log("Gemini stream connected!");
// for await (const text of stream) {
//     if (text) {
//         controller.enqueue(encoder.encode(text));
//     }
// }

//                         console.log("Gemini stream completed");

//                         controller.close();

//                     } catch (error) {
//                         console.error("Gemini streaming error:", error);

//                         controller.error(error);
//                     }
//                 })();
//             },
//         });

//         return new Response(readableStream, {
//             headers: {
//                 "Content-Type": "text/plain; charset=utf-8",
//                 "Cache-Control": "no-cache, no-transform",
//                 "Connection": "keep-alive",
//                 "X-Accel-Buffering": "no",
//             },
//         });

//     } catch (error) {
//         console.error("API route error:", error);

//         return Response.json(
//             {
//                 error: error instanceof Error
//                     ? error.message
//                     : String(error),
//             },
//             { status: 500 }
//         );
//     }
// }

import { generateReplyStream } from "@/lib/ai";
import { buildPrompt } from "@/lib/promptBuilder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { persona, history } = body;

        if (!persona || !Array.isArray(history)) {
            return Response.json(
                { error: "Invalid request data" },
                { status: 400 }
            );
        }

        const { systemInstruction, contents } = buildPrompt(
            persona,
            history
        );

        const stream = generateReplyStream(
            systemInstruction,
            contents
        );

        // IMPORTANT: Start the generator before returning the response.
        const firstChunk = await stream.next();

        if (firstChunk.done) {
            return Response.json(
                { error: "Gemini returned an empty response" },
                { status: 502 }
            );
        }

        const encoder = new TextEncoder();

        const readableStream = new ReadableStream<Uint8Array>({
            async start(controller) {
                try {
                    if (firstChunk.value) {
                        controller.enqueue(
                            encoder.encode(firstChunk.value)
                        );
                    }

                    while (true) {
                        const { done, value } = await stream.next();

                        if (done) break;

                        if (value) {
                            controller.enqueue(encoder.encode(value));
                        }
                    }

                    controller.close();

                } catch (error) {
                    console.error("Streaming error:", error);

                    // Avoid abruptly breaking the browser connection.
                    controller.enqueue(
                        encoder.encode(
                            "\n\n⚠️ The response was interrupted. Please try again."
                        )
                    );

                    controller.close();
                }
            }
        });

        return new Response(readableStream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no"
            }
        });

    } catch (error) {
        console.error("API route error:", error);

        return Response.json(
            {
                error: error instanceof Error
                    ? error.message
                    : String(error)
            },
            { status: 503 }
        );
    }
}
