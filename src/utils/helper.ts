// Function to extract company name from website URL
export const extractCompanyName = (url: string | undefined): string | null => {
    console.log({ url });
    if (!url) return null;
    try {
        // Ensure URL has a valid protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = `https://${url}`; // Default to https
        }

        const hostname = new URL(url).hostname; // Extract hostname
        const parts = hostname.replace(/^www\./, '').split('.'); // Remove "www." if exists and split by "."

        // If domain has more than two parts, use second last part (e.g., "example.co.uk" → "example")
        return parts.length > 2 ? parts[parts.length - 2] : parts[0];
    } catch (error) {
        return null;
    }
};
