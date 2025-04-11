import axiosRetry, { IAxiosRetryConfig } from "axios-retry";
import { AxiosRequestConfig } from "axios";

export interface RetryOptions extends IAxiosRetryConfig {}

export interface HttpClientOptions {
    baseURL: string;
    retryOptions?: RetryOptions;
}

export interface HttpClientRequestOptions {
    url: string;
    axiosRequestConfig?: AxiosRequestConfig;
    body?: any;
}

export const defaultRetryOptions: RetryOptions = {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error: any) => {
        return error.config?.method === "get" && error.status >= 500;
    },
};
