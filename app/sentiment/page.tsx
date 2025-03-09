// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
  const { activities, isLoading, error, fetchComments, comments } = useStore();

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  useEffect(() => {
    console.log("COMMENTS", comments);
  });

  const getSentiment = (str: string) => {
    //add spell check and stop word check?

    console.log(comments);

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
