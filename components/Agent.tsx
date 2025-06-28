"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback, getInterviewById } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: "generate" | "feedback";
  questions?: string[];
}

const Agent = ({
                 userName,
                 userId,
                 interviewId,
                 feedbackId,
                 type,
                 questions,
               }: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchInterview = async () => {
      if (interviewId) {
        const interview = await getInterviewById(interviewId);
        if (interview?.questions) {
          setInterviewQuestions(interview.questions);
        }
      }
    };
    fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = {
          role: message.role,
          content: message.transcript
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("VAPI Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async () => {
      if (messages.length > 0 && interviewId && userId) {
        const { success, feedbackId: newFeedbackId } = await createFeedback({
          interviewId,
          userId,
          transcript: messages,
          feedbackId,
        });

        if (success) {
          router.push(`/interview/${interviewId}/feedback${newFeedbackId ? `?feedbackId=${newFeedbackId}` : ''}`);
        } else {
          console.error("Error saving feedback");
          router.push("/");
        }
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback();
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        const questionsToUse = interviewQuestions.length > 0
            ? interviewQuestions
            : questions || [];

        await vapi.start(interviewer, {
          variableValues: {
            questions: questionsToUse.join("\n"),
          },
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
        {/* Animated cards section */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
          {/* AI Interviewer Card with animation */}
          <div className="relative group">
            <div className={cn(
                "relative flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-lg",
                "transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl",
                isSpeaking ? "ring-2 ring-blue-500" : ""
            )}>
              <div className="relative mb-4">
                <Image
                    src="/ai-avatar.png"
                    alt="AI Interviewer"
                    width={80}
                    height={80}
                    className="rounded-full object-cover size-20"
                />
                {isSpeaking && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500"></span>
                </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white">AI Interviewer</h3>
            </div>
          </div>

          {/* User Card with animation */}
          <div className="relative group">
            <div className={cn(
                "relative flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 shadow-lg",
                "transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl"
            )}>
              <Image
                  src="/user-avatar.png"
                  alt="User Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover size-[120px] mb-4"
              />
              <h3 className="text-lg font-semibold text-white">{userName}</h3>
            </div>
          </div>
        </div>

        {/* Transcript with animation */}
        {messages.length > 0 && (
            <div className={cn(
                "w-full max-w-2xl p-6 rounded-xl bg-gray-800/50 border border-gray-700 backdrop-blur-sm",
                "transition-all duration-500 ease-in-out",
                messages.length > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <div className="text-center">
                <p className="text-gray-200 animate-fadeIn">
                  {lastMessage}
                </p>
              </div>
            </div>
        )}

        {/* Button with animation */}
        <div className="w-full flex justify-center mt-8">
          {callStatus !== CallStatus.ACTIVE ? (
              <button
                  className={cn(
                      "relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all bg-blue-600 rounded-full group",
                      "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                      callStatus === CallStatus.CONNECTING ? "opacity-75 cursor-not-allowed" : ""
                  )}
                  onClick={handleCall}
                  disabled={callStatus === CallStatus.CONNECTING}
              >
            <span className={cn(
                "absolute inset-0 rounded-full bg-blue-600 group-hover:bg-blue-700",
                callStatus === CallStatus.CONNECTING ? "animate-pulse" : ""
            )}></span>
                <span className="relative flex items-center gap-2">
              {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED
                  ? "Start Interview"
                  : "Connecting..."}
            </span>
              </button>
          ) : (
              <button
                  className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-white transition-all bg-red-600 rounded-full hover:bg-red-700 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  onClick={handleDisconnect}
              >
                <span className="absolute inset-0 rounded-full bg-red-600 group-hover:bg-red-700"></span>
                <span className="relative flex items-center gap-2">
              End Interview
            </span>
              </button>
          )}
        </div>
      </div>
  );
};

export default Agent;