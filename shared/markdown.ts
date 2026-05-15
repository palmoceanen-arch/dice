// Simple markdown renderer for game rules
// Supports: headers, bold, lists, line breaks

export function renderMarkdown(text: string): string {
  let html = text;
  
  // Headers (# ## ###)
  html = html.replace(/^### (.+)$/gm, '<h3 style="color: white; font-size: 14px; font-weight: 600; margin: 12px 0 6px 0;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="color: white; font-size: 16px; font-weight: 600; margin: 16px 0 8px 0;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="color: white; font-size: 20px; font-weight: 700; margin: 0 0 16px 0; text-align: center;">$1</h1>');
  
  // Bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color: #4CAF50; font-weight: 600;">$1</strong>');
  
  // Lists (- item)
  html = html.replace(/^- (.+)$/gm, '<li style="margin-left: 20px; margin-bottom: 4px; color: #ddd;">$1</li>');
  
  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, (match) => {
    return '<ul style="margin: 8px 0; padding-left: 0; list-style-position: inside;">' + match + '</ul>';
  });
  
  // Line breaks
  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');
  
  return html;
}
