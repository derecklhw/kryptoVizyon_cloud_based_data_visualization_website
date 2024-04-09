export type Crypto = {
    name: string;
};

export type SentimentDataPoint = {
    negative: number;
    positive: number;
    neutral: number;
  }
  
export interface SentimentsData {
    [symbol: string]: SentimentDataPoint;
}

export type CryptoDataPoint = {
    timestamp: number;
    high: number;
    low: number;
    open: number;
    close: number;
}

export interface CryptoData {
    [symbol: string]: CryptoDataPoint[]
}