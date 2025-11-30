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
    // Only fetch if we don't have a response yet
    if (LMResponse.length === 0 && activities.length > 0) {
      fetchLMResponse(activities, "");
    }
  }, [fetchLMResponse, activities, LMResponse.length]);

  useEffect(() => {
    // Add assistant response to message history
    if (LMResponse) {
      addMessage({ role: "assistant", content: LMResponse });
    }
  }, [LMResponse, addMessage]);

  const handleSendResponse = () => {
    const text = textareaRef.current?.value.trim();
    if (!text) return;

    const newMessageParams = {
      role: "user" as const,
      content: `${text}. Please answer me as directly and accurately as possible. Keep it short and to the point.`,
    };

    fetchLMResponse(activities, newMessageParams);

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
  };

  if (error) {
    console.log(`Error: ${error}`);
    console.log("Check that LM Studio is running");
  }

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
            <Button onClick={handleSendResponse} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="plan">Plan goes here.</TabsContent>
    </Tabs>
  );
}
