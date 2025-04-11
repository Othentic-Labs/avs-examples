import axios, { AxiosInstance, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import { defaultRetryOptions, HttpClientOptions, HttpClientRequestOptions, RetryOptions } from "./types";

export class HttpClient {
    private baseURL: string;
    private readonly instance: AxiosInstance;

    constructor(options: HttpClientOptions) {
        const { baseURL, retryOptions } = options;
        this.instance = axios.create({
            baseURL,
        });

        this.setRetryOptions(retryOptions);
    }

    setRetryOptions(options?: RetryOptions) {
        axiosRetry(this.instance, options ?? defaultRetryOptions);
    }

    async get<T>(requestOptions: HttpClientRequestOptions): Promise<T> {
        const { url, axiosRequestConfig } = requestOptions;
        try {
            const response = await this.instance.get<T>(url, axiosRequestConfig);
            return response.data as T;
        } catch (error: any) {
            console.error(`Get request to ${this.baseURL}/${url} failed with error ${error.message}`);
            throw error;
        }
    }

    async post<T>(requestOptions: HttpClientRequestOptions): Promise<T> {
        let { url, axiosRequestConfig, body } = requestOptions;
        try {
            const response: AxiosResponse<T> = await this.instance.post(url, body, axiosRequestConfig);
            return response.data;
        } catch (error: any) {
            console.error(`Get request to ${this.baseURL}/${url} failed with error ${error.message}`, error);
            throw error;
        }
    }
}
