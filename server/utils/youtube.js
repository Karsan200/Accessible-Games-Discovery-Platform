export function extractYouTubeId(url) {
    if (!url) return null;
    url = url.trim();

    // common patterns: watch?v=ID, youtu.be/ID, /embed/ID
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regex);
    if (match && match[1]) return match[1];

    // fallback: try URL query param v
    try {
        const u = new URL(url);
        const v = u.searchParams.get("v");
        if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    } catch (e) {
        // ignore if invalid URL
    }

    return null;
}

export function toEmbedUrl(url) {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
}
