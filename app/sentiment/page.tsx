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

  useEffect(() => {
    //fetchQuotes();
    fetchLMResponse(activities);
  }, [fetchQuotes, fetchLMResponse, activities]);

  useEffect(() => {
    //console.log("QUOTES", quotes);
    console.log("LM Res", LMResponse);
  }, [quotes, LMResponse]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error} <br />
        Check that LM Studio is running
      </div>
    );
  }

  // if (!quotes) {
  //   return <div>Loading now...</div>; // Prevent rendering before data is available
  // }

  if (!LMResponse) {
    return (
      <div>
        No Response From LM Studio, try turning the LM Studio status to running.
        If already running, please wait for the responde, could take up to a
        minute
      </div>
    ); // Prevent rendering before data is available
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>
        <TabsContent value="chat">
          <div className="items-center space-x-">
            <Card className="h-[310px] w-full flex flex-col justify-between">
              <CardHeader className="overflow-hidden">
                <CardTitle className="text-wrap break-words text-base">
                  Chat with Coach
                </CardTitle>
                <CardDescription className="text-wrap break-words text-sm line-clamp-6">
                  Analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="text-md">{LMResponse}</CardContent>
              <CardFooter className="flex justify-between text-sm">
                Footer
              </CardFooter>
            </Card>
            <br></br>
            <div className="">
              <Textarea
                className="w-full"
                placeholder="Type your message here."
              />
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
