// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";
import { Badge } from "@/components/ui/badge";
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
  const fetchQuotes = useStore((state) => state.fetchQuotes);
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const fetchLMResponse = useStore((state) => state.fetchLMResponse);
  const LMResponse = useStore((state) => state.LMResponse);

  useEffect(() => {
    fetchQuotes();
    fetchLMResponse();
  }, [fetchQuotes, fetchLMResponse]);

  useEffect(() => {
    console.log("QUOTES", quotes);
    console.log("LM Res", LMResponse);
  }, [quotes, LMResponse]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!quotes) {
    return <div>Loading now...</div>; // Prevent rendering before data is available
  }

  if (!LMResponse) {
    return <div>No Response From LM Studio</div>; // Prevent rendering before data is available
  }

  return (
    <div>
      <h2>Sentiment Analysis</h2>
      {/* {quotesArray.map((quote) => (
        <Badge key={quote.id}>{quote.quote}</Badge>
      ))} */}

      {quotes ? (
        <Badge key={quotes.id}>{quotes.quote}</Badge>
      ) : (
        <Badge>NADA</Badge>
      )}

      <br />

      {LMResponse ? (
        <Badge key={LMResponse}>{LMResponse}</Badge>
      ) : (
        <Badge>NADA</Badge>
      )}
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
