// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
// import { WordTokenizer } from "natural";
// import aposToLexForm from "apos-to-lex-form";
// import SpellCorrector from "spelling-corrector";
// import stopword from "stopword";
import React, { useEffect } from "react";
import { useStore } from "../store/store";
// import Sentiment from "sentiment";
// import axios from "axios";

export default function Page() {
  const quotes = useStore((state) => state.quotes);
  const activities = useStore((state) => state.activities);
  const fetchQuotes = useStore((state) => state.fetchQuotes);
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const fetchLMResponse = useStore((state) => state.fetchLMResponse);
  const LMResponse = useStore((state) => state.LMResponse);
  const addMessage = useStore((state) => state.addMessage);
  const MessageParams = useStore((state) => state.MessageParams);

  let LoadingMessage = "Analysis";

  useEffect(() => {
    console.log(LMResponse);
    //fetchQuotes();
    if (LMResponse.length == 0) {
      fetchLMResponse(activities, "");
      LoadingMessage = "Loading message from LM Studio...";
    }
  }, [fetchQuotes, fetchLMResponse, activities]);

  useEffect(() => {
    //console.log("QUOTES", quotes);
    console.log("LM Res", LMResponse);
    if (LMResponse) {
      addMessage({ role: "assistant", content: LMResponse });
    }
  }, [quotes, LMResponse]);

  const SendResponse = () => {
    const text = document.getElementById("UserResponse").value.trim();
    console.log(text);
    const newMessageParams = {
      role: "user",
      content: `${text}. Please answer me as directly and accurately as possible. Keep it short and to the point.`,
    };
    fetchLMResponse(activities, newMessageParams);
    const textarea = document.getElementById(
      "UserResponse"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = "";
    }
  };

  if (isLoading) {
    LoadingMessage = ``;
  }

  if (error) {
    console.log(`Error: ${error}`);
    console.log("Check that LM Studio is running");
    // return (
    //   <div>
    //     Error: {error} <br />
    //     Check that LM Studio is running
    //   </div>
    // );
  }

  // if (!quotes) {
  //   return <div>Loading now...</div>; // Prevent rendering before data is available
  // }

  // if (!LMResponse) {
  //   return (
  //     <div>
  //       No Response From LM Studio, try turning the LM Studio status to running.
  //       If already running, please wait for the responde, could take up to a
  //       minute
  //     </div>
  //   ); // Prevent rendering before data is available
  // }

  return (
    <div className="p-4">
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="items-center space-x-">
            <Card className="w-full max-h-[500px] overflow-y-auto flex flex-col justify-between">
              <CardHeader className="overflow-hidden">
                <CardTitle className="text-wrap break-words text-base">
                  Chat with Coach
                </CardTitle>
                <CardDescription className="text-wrap break-words text-sm line-clamp-6">
                  <span>{LoadingMessage}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="text-md space-y-2">
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
                  </div>
                ) : (
                  (() => {
                    const lines = LMResponse.split("\n");
                    const bullets: string[] = [];
                    const paragraphs: JSX.Element[] = [];

                    lines.forEach((line, idx) => {
                      if (line.trim().startsWith("-")) {
                        bullets.push(line.replace(/^-/, "").trim());
                      } else {
                        if (bullets.length > 0) {
                          paragraphs.push(
                            <ul
                              key={`ul-${idx}`}
                              className="ml-6 list-disc space-y-1"
                            >
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
                  })()
                )}
              </CardContent>

              <CardFooter className="flex justify-between text-sm">
                Footer
              </CardFooter>
            </Card>
            <br></br>
            <div className="">
              <Textarea
                id="UserResponse"
                className="w-full"
                placeholder="Type your message here."
              />
            </div>
            <div className="py-3 float-right pr-5">
              <Button onClick={SendResponse}>Send</Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="plan">Plan goes here.</TabsContent>
      </Tabs>
    </div>
  );
}

// const getSentiment = (str: string) => {
//   //add spell check and stop word check?

//   console.log(comments);

//   const sentiment = new Sentiment();

//   if (!str.trim()) {
//     return 0;
//   }

//   str = str.toLowerCase().replace(/[^a-zA-Z\s]+/g, "");

//   let result = sentiment.analyze(str);

//   console.log(result);
// };

// getSentiment("I love you");
