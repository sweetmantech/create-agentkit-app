import { InternalAxiosRequestConfig } from "axios";
/**
 * A class that builds JWTs for authenticating with the Coinbase Platform APIs.
 */
export declare class CoinbaseAuthenticator {
    private apiKey;
    private privateKey;
    private source;
    private sourceVersion?;
    /**
     * Initializes the Authenticator.
     *
     * @param {string} apiKey - The API key name.
     * @param {string} privateKey - The private key associated with the API key.
     * @param {string} source - The source of the request.
     * @param {string} sourceVersion - The version of the source.
     */
    constructor(apiKey: string, privateKey: string, source: string, sourceVersion?: string);
    /**
     * Middleware to intercept requests and add JWT to Authorization header.
     *
     * @param {InternalAxiosRequestConfig} config - The request configuration.
     * @param {boolean} debugging - Flag to enable debugging.
     * @returns {Promise<InternalAxiosRequestConfig>} The request configuration with the Authorization header added.
     * @throws {InvalidAPIKeyFormat} If JWT could not be built.
     */
    authenticateRequest(config: InternalAxiosRequestConfig, debugging?: boolean): Promise<InternalAxiosRequestConfig>;
    /**
     * Builds the JWT for the given API endpoint URL.
     *
     * @param {string} url - URL of the API endpoint.
     * @param {string} method - HTTP method of the request.
     * @returns {Promise<string>} JWT token.
     * @throws {InvalidAPIKeyFormat} If the private key is not in the correct format.
     */
    buildJWT(url: string, method?: string): Promise<string>;
    /**
     * Extracts the PEM key from the given private key string.
     *
     * @param {string} privateKeyString - The private key string.
     * @returns {string} The PEM key.
     * @throws {InvalidAPIKeyFormat} If the private key string is not in the correct format.
     */
    private extractPemKey;
    /**
     * Generates a random nonce for the JWT.
     *
     * @returns {string} The generated nonce.
     */
    private nonce;
    /**
     * Returns encoded correlation data including the SDK version and language.
     *
     * @returns {string} Encoded correlation data.
     */
    private getCorrelationData;
}
