document.addEventListener('DOMContentLoaded', function() {
    // Get the Markdown content from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const markdownContent = decodeURIComponent(urlParams.get('markdown'));

    // Function to convert Markdown to HTML
    function convertMarkdownToHtml(markdown) {
        // Convert headings
        markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Convert bold and italic
        markdown = markdown.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');  // bold
        markdown = markdown.replace(/\*(.*)\*/gim, '<em>$1</em>');              // italic
        
        // Convert inline code
        markdown = markdown.replace(/`(.*?)`/gim, '<code>$1</code>');
        
        // Convert unordered lists
        markdown = markdown.replace(/^\s*[-*]\s+(.*$)/gim, '<li>$1</li>');
        markdown = markdown.replace(/<\/li>\n<li>/gim, '</li><li>');  // Fix list item separation
        markdown = markdown.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

        // Convert numbered lists
        markdown = markdown.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');
        markdown = markdown.replace(/<\/li>\n<li>/gim, '</li><li>');  // Fix list item separation
        markdown = markdown.replace(/(<li>.*<\/li>)/gim, '<ol>$1</ol>');

        // Convert paragraphs (basic)
        markdown = markdown.replace(/\n$/gim, '<br>');  // Simple line break replacement

        return markdown.trim();  // Return the generated HTML
    }

    // Convert the Markdown to HTML
    const htmlContent = convertMarkdownToHtml(markdownContent);

    // Insert the converted HTML into the page
    document.getElementById('markdown-content').innerHTML = htmlContent;
});
