declare module 'vader-sentiment' {
    export class SentimentIntensityAnalyzer {
      polarity_scores (text: string): {
        pos: number;
        neu: number;
        neg: number;
        compound: number;
      };
    }
  }