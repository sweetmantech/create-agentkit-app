export const TRACING_ALS_KEY = Symbol.for("ls:tracing_async_local_storage");
export const setGlobalAsyncLocalStorageInstance = (instance) => {
    globalThis[TRACING_ALS_KEY] = instance;
};
export const getGlobalAsyncLocalStorageInstance = () => {
    return globalThis[TRACING_ALS_KEY];
};
