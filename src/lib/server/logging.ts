export function logError(source: string, message: string, error: unknown) {
    console.error(`[${source}] ${message}\n`, error);
}


export function logInfo(source: string, message: string, data?: unknown) {
    console.info(`[${source}] ${message}`);
    if (data) {
        console.info(data);
    }
}
