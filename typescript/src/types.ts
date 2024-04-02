export type Source = {
    name: string;
}

export type News = {
    title: string;
    publishedAt: string;
    source: Source;
}

export interface NewsResponse {
    articles : News[];
}

export type HistoricalData = {
    time: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
    close: number;
}

export interface CryptocurrencyResponse {
    Data: HistoricalData[]
}