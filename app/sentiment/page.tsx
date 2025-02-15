"use client";

import React, { useEffect } from "react";
import { useStore } from "../store/store";
import { SentimentIntensityAnalyzer } from "vader-sentiment";
import natural, { SentimentAnalyzer } from "natural";

export default function Page() {
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
