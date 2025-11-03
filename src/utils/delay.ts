export const getRandomDelay = (delayRange?: { min: number; max: number }): number => {
    if (!delayRange) return 0;
    const { min, max } = delayRange;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomDelay = async (delayRange?: { min: number; max: number }): Promise<void> => {
    const delay = getRandomDelay(delayRange);
    if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
    }
};

export const delay = (ms: number): Promise<void> =>
    ms > 0 ? new Promise(resolve => setTimeout(resolve, ms)) : Promise.resolve();