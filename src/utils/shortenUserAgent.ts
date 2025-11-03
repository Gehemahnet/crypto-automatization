export const shortenUserAgent = (userAgent: string): string => {
    const match = userAgent.match(/(Mozilla\/[\d.]+) \((.*?)\) (AppleWebKit\/[\d.]+) \((.*?)\) (Chrome\/[\d.]+)/);
    if (match) {
        const [, mozilla, platform, webkit, , chrome] = match;
        return `${mozilla} (${platform}) ${chrome}`;
    }
    return userAgent.length > 60 ? userAgent.substring(0, 60) + '...' : userAgent;
};
