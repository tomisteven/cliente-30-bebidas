import { useEffect } from 'react';

const SEO = ({ title, description, keywords, canonical }) => {
    useEffect(() => {
        // Update Title
        if (title) {
            document.title = `${title} | 30 Bebidas`;
        }

        // Update Description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription && description) {
            metaDescription.setAttribute('content', description);
        }

        // Update Keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords && keywords) {
            metaKeywords.setAttribute('content', keywords);
        }

        // Update Canonical
        const linkCanonical = document.querySelector('link[rel="canonical"]');
        if (linkCanonical && canonical) {
            linkCanonical.setAttribute('href', canonical);
        } else if (linkCanonical) {
            // Default canonical for the current path if not provided
            linkCanonical.setAttribute('href', `https://30bebidas.com.ar${window.location.pathname}`);
        }

        // OG Tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle && title) ogTitle.setAttribute('content', title);

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription && description) ogDescription.setAttribute('content', description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    }, [title, description, keywords, canonical]);

    return null;
};

export default SEO;
