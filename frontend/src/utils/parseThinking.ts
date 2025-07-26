export interface ParsedContent {
  type: 'thinking' | 'regular';
  content: string;
}

export function parseContentWithThinking(content: string): ParsedContent[] {
  const parts: ParsedContent[] = [];
  
  // First, handle complete thinking blocks
  const completeThinkRegex = /<think>([\s\S]*?)<\/think>/g;
  let lastIndex = 0;
  let match;

  while ((match = completeThinkRegex.exec(content)) !== null) {
    // Add any regular content before this thinking block
    if (match.index > lastIndex) {
      const beforeContent = content.slice(lastIndex, match.index).trim();
      if (beforeContent) {
        parts.push({ type: 'regular', content: beforeContent });
      }
    }

    // Add the complete thinking block content
    parts.push({ type: 'thinking', content: match[1].trim() });
    lastIndex = completeThinkRegex.lastIndex;
  }

  // Check for incomplete thinking block (streaming case)
  const remainingContent = content.slice(lastIndex);
  const incompleteThinkMatch = remainingContent.match(/<think>([\s\S]*)$/);
  
  if (incompleteThinkMatch) {
    // There's an incomplete thinking block at the end
    const beforeIncomplete = remainingContent.slice(0, incompleteThinkMatch.index).trim();
    if (beforeIncomplete) {
      parts.push({ type: 'regular', content: beforeIncomplete });
    }
    
    // Add the incomplete thinking content
    const thinkingContent = incompleteThinkMatch[1].trim();
    if (thinkingContent) {
      parts.push({ type: 'thinking', content: thinkingContent });
    }
  } else if (remainingContent.trim()) {
    // No incomplete thinking block, just regular content
    parts.push({ type: 'regular', content: remainingContent.trim() });
  }

  // If no content found at all, return empty array
  if (parts.length === 0 && content.trim()) {
    parts.push({ type: 'regular', content: content.trim() });
  }

  return parts;
}