// import { useState } from "react";
// import type { Message } from "@/lib/types";
// import { useEffect } from "react";

// export function useChat(selectedPersona: string | null) {
//   const [message, setMessage] = useState("");

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//    useEffect(() => {
//   const savedMessages = localStorage.getItem("messages");

//   if (savedMessages) {
//     setMessages(JSON.parse(savedMessages));
//   }
// }, []);

//   useEffect(() => {
//   localStorage.setItem("messages", JSON.stringify(messages));
// }, [messages]);


//   return {
//     message,
//     setMessage,
//     messages,
//     setMessages,
//     loading,
//     setLoading,
//     error,
//     setError,
//   };
// }


import { useState, useEffect } from "react";
import type { Message } from "@/lib/types";

export function useChat(selectedPersona: string | null) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Load saved messages
    useEffect(() => {
        try {
            const savedMessages = localStorage.getItem("messages");

            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save messages only after loading is complete
    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            "messages",
            JSON.stringify(messages)
        );
    }, [messages, isLoaded]);

    return {
        message,
        setMessage,
        messages,
        setMessages,
        loading,
        setLoading,
        error,
        setError,
    };
}
