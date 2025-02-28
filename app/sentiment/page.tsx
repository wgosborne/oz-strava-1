// @ts-nocheck

"use client";

import { WordTokenizer } from "natural";
import aposToLexForm from "apos-to-lex-form";
import SpellCorrector from "spelling-corrector";
import stopword from "stopword";
import React, { useEffect } from "react";
import { useStore } from "../store/store";
import Sentiment from "sentiment";

export default function Page() {
  const getSentiment = (str: string) => {
    //add spell check and stop word check?

    const sentiment = new Sentiment();

    if (!str.trim()) {
      return 0;
    }

    str = str.toLowerCase().replace(/[^a-zA-Z\s]+/g, "");

    let result = sentiment.analyze(str);

    console.log(result);
  };

  getSentiment("I love you");

  return (
    <div>
      <h2>Sentiment Analysis</h2>
    </div>
  );
}

// export default function Page() {
//   //get distance
//   const { activities, isLoading, error, fetchActivities, totalDistance } =
//     useStore();

//   const analyzeSentiment = (text: string) => {
//     const analyzer = new SentimentAnalyzer("English", undefined, "senticon");
//     const score = analyzer.getSentiment(text.split(" "));
//     return score >= 0 ? "Positive" : score < 0 ? "Negative" : "Neutral";
//   };

//   useEffect(() => {
//     console.log("DISTANCE", totalDistance);
//   });

//   const sampleText = "This is an amazing day!";
//   const sentiment = analyzeSentiment(sampleText);

//   return (
//     <div>
//       <h2>Sentiment Analysis</h2>
//       <p>Positive: {sentiment}</p>
//     </div>
//   );
// }
