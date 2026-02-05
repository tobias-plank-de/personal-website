// Simple Markdown Parser für Portfolio Website
// Unterstützt: Headings, Listen, Bold, Italic, Links

function parseMarkdown(markdown) {
    let html = markdown;

    // Headings (h1-h6)
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Listen
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Paragraphs (Zeilen die nicht bereits Tags sind)
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
        const trimmed = line.trim();
        if (trimmed === '') return '';
        if (trimmed.startsWith('<')) return line;
        return `<p>${line}</p>`;
    });
    html = processedLines.join('\n');

    // Leere Paragraphs entfernen
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
}

// Markdown-Datei laden und parsen
async function loadMarkdown(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseMarkdown(text);
    } catch (error) {
        console.error('Error loading markdown file:', error);
        return '<p>Fehler beim Laden des Inhalts.</p>';
    }
}

// Content für einen Modus und Sprache laden
async function loadContent(mode, lang) {
    const file = `content/${mode}/${mode}-${lang}.md`;
    return await loadMarkdown(file);
}

// Impressum laden
async function loadImprint(lang) {
    const file = `content/imprint/imprint-${lang}.md`;
    return await loadMarkdown(file);
}

// News laden und parsen
async function loadNews(mode, lang) {
    const file = `content/news/news-${mode}-${lang}.md`;
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        return parseNews(text);
    } catch (error) {
        console.error('Error loading news file:', error);
        return '<p>Fehler beim Laden der News.</p>';
    }
}

// News im Format parsen: DATUM\nTITEL\n\n
function parseNews(text) {
    const lines = text.trim().split('\n');
    let html = '';

    for (let i = 0; i < lines.length; i += 3) {
        const date = lines[i]?.trim();
        const title = lines[i + 1]?.trim();

        if (date && title) {
            html += `<div class="feed-item">
                <span class="feed-date">${date}</span>
                <p>${title}</p>
            </div>\n`;
        }
    }

    return html;
}
