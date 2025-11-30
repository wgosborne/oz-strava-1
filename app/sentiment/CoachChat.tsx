"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "../store/store";
import { Activity } from "@/app/types/Activity";

interface CoachChatProps {
  activities: Activity[];
}

export default function CoachChat({ activities }: CoachChatProps) {
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const fetchLMResponse = useStore((state) => state.fetchLMResponse);
  const LMResponse = useStore((state) => state.LMResponse);
  const addMessage = useStore((state) => state.addMessage);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Only fetch if we don't have a response yet and no error
    if (LMResponse.length === 0 && activities.length > 0 && !error) {
      fetchLMResponse(activities, "");
    }
  }, [fetchLMResponse, activities, LMResponse.length, error]);

  useEffect(() => {
    // Add assistant response to message history
    if (LMResponse) {
      addMessage({ role: "assistant", content: LMResponse });
    }
  }, [LMResponse, addMessage]);

  const handleSendResponse = () => {
    const text = textareaRef.current?.value.trim();
    if (!text || error) return; // Don't send if there's an error

    const newMessageParams = {
      role: "user" as const,
      content: `${text}. Please answer me as directly and accurately as possible. Keep it short and to the point.`,
    };

    fetchLMResponse(activities, newMessageParams);

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  const renderResponse = () => {
    if (!LMResponse) return null;

    const lines = LMResponse.split("\n");
    const bullets: string[] = [];
    const paragraphs: JSX.Element[] = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith("-")) {
        bullets.push(line.replace(/^-/, "").trim());
      } else {
        if (bullets.length > 0) {
          paragraphs.push(
            <ul key={`ul-${idx}`} className="ml-6 list-disc space-y-1">
              {bullets.map((b, i) => (
                <li key={`bullet-${i}`}>{b}</li>
              ))}
            </ul>
          );
          bullets.length = 0;
        }
        if (line.trim()) {
          paragraphs.push(<p key={`p-${idx}`}>{line}</p>);
        }
      }
    });

    // If any bullets are left at the end
    if (bullets.length > 0) {
      paragraphs.push(
        <ul key="ul-end" className="ml-6 list-disc space-y-1">
          {bullets.map((b, i) => (
            <li key={`bullet-end-${i}`}>{b}</li>
          ))}
        </ul>
      );
    }

    return paragraphs;
  };

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-400 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                LM Studio is not running
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
      <TabsContent value="chat">
        <div className="items-center">
          <Card className="w-full max-h-[500px] overflow-y-auto flex flex-col justify-between">
            <CardHeader className="overflow-hidden">
              <CardTitle className="text-wrap break-words text-base">
                Chat with Coach
              </CardTitle>
              <CardDescription className="text-wrap break-words text-sm line-clamp-6">
                {isLoading ? "Loading response from LM Studio..." : "Analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-md space-y-2">
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                </div>
              ) : (
                renderResponse()
              )}
            </CardContent>
            <CardFooter className="flex justify-between text-sm">
              {activities.length > 0
                ? `Analyzing ${activities.length} activities`
                : "No activities loaded"}
            </CardFooter>
          </Card>
          <br />
          <div>
            <Textarea
              ref={textareaRef}
              className="w-full"
              placeholder="Type your message here."
            />
          </div>
          <div className="py-3 float-right pr-5">
            <Button onClick={handleSendResponse} disabled={isLoading || !!error}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="plan">Plan goes here.</TabsContent>
    </Tabs>
    </div>
  );
}
