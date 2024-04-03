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

export type CryptoData = {
    time: number;
    high: number;
    low: number;
    open: number;
    close: number;
}

export interface HistoricalResponse {
    Data: CryptoData[]
}