"use client";
import { useFileStore } from "@/store/fielStore";
import { useCallback, useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerExampleProps {
  fileUrl?: string;
  pageNumber?: number;
  highlightText?: string;
}

interface TextSpan {
  element: HTMLElement;
  text: string;
  normalizedText: string;
  startIndex: number;
  endIndex: number;
  rect?: DOMRect;
}

interface HighlightMatch {
  startSpanIndex: number;
  endSpanIndex: number;
  startOffset: number;
  endOffset: number;
  matchText: string;
}

export function PDFViewerExample({fileUrl, pageNumber, highlightText}: PDFViewerExampleProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const highlightColor = "#ff0";
  const pageRef = useRef<HTMLDivElement>(null);
  const [textSpans, setTextSpans] = useState<TextSpan[]>([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  // Normalize text for better matching (remove extra spaces, handle special chars)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[\u00A0\u2000-\u200B\u2028\u2029]/g, ' ') // Replace various unicode spaces
      .trim();
  };

  // Create fuzzy regex for more flexible matching
  const createSearchRegex = (searchText: string): RegExp => {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Allow for flexible spacing and line breaks
    const flexible = escaped.replace(/\s+/g, '\\s*');
    return new RegExp(flexible, 'gi');
  };

  // Build comprehensive text map from all spans
  const buildTextMap = (textLayer: Element): TextSpan[] => {
    const spans = Array.from(textLayer.querySelectorAll('span')) as HTMLElement[];
    const textSpans: TextSpan[] = [];
    let currentIndex = 0;

    spans.forEach((span) => {
      const text = span.textContent || '';
      const normalizedText = normalizeText(text);
      
      if (text.trim()) { // Only include non-empty spans
        textSpans.push({
          element: span,
          text,
          normalizedText,
          startIndex: currentIndex,
          endIndex: currentIndex + normalizedText.length,
          rect: span.getBoundingClientRect()
        });
        currentIndex += normalizedText.length;
      }
    });

    return textSpans;
  };

  // Find all matches using multiple strategies
  const findMatches = (textSpans: TextSpan[], searchText: string): HighlightMatch[] => {
    if (!searchText.trim()) return [];

    const matches: HighlightMatch[] = [];
    const normalizedSearch = normalizeText(searchText);
    const searchRegex = createSearchRegex(normalizedSearch);

    // Strategy 1: Direct span matching (fastest)
    textSpans.forEach((span, index) => {
      const spanMatches = [...span.normalizedText.matchAll(searchRegex)];
      spanMatches.forEach(match => {
        if (match.index !== undefined) {
          matches.push({
            startSpanIndex: index,
            endSpanIndex: index,
            startOffset: match.index,
            endOffset: match.index + match[0].length,
            matchText: match[0]
          });
        }
      });
    });

    // Strategy 2: Cross-span matching
    const fullText = textSpans.map(span => span.normalizedText).join('');
    const crossSpanMatches = [...fullText.matchAll(searchRegex)];
    
    crossSpanMatches.forEach(match => {
      if (match.index !== undefined) {
        const startPos = match.index;
        const endPos = match.index + match[0].length;
        
        // Find which spans contain this match
        const startSpan = textSpans.findIndex(span => 
          startPos >= span.startIndex && startPos < span.endIndex
        );
        const endSpan = textSpans.findIndex(span => 
          endPos > span.startIndex && endPos <= span.endIndex
        );

        if (startSpan !== -1 && endSpan !== -1) {
          // Check if this is a new match (not already found in Strategy 1)
          const isNewMatch = !matches.some(existingMatch => 
            existingMatch.startSpanIndex === startSpan && 
            existingMatch.endSpanIndex === endSpan &&
            Math.abs(existingMatch.startOffset - (startPos - textSpans[startSpan].startIndex)) < 2
          );

          if (isNewMatch) {
            matches.push({
              startSpanIndex: startSpan,
              endSpanIndex: endSpan,
              startOffset: startPos - textSpans[startSpan].startIndex,
              endOffset: endPos - textSpans[endSpan].startIndex,
              matchText: match[0]
            });
          }
        }
      }
    });

    // Strategy 3: Fuzzy matching for common PDF text extraction issues
    if (matches.length === 0) {
      return findFuzzyMatches(textSpans, searchText);
    }

    return matches;
  };

  // Fuzzy matching for problematic text extraction
  const findFuzzyMatches = (textSpans: TextSpan[], searchText: string): HighlightMatch[] => {
    const matches: HighlightMatch[] = [];
    const searchWords = normalizeText(searchText).split(' ').filter(word => word.length > 2);
    
    if (searchWords.length === 0) return matches;

    // Look for sequences where most words match
    for (let i = 0; i < textSpans.length; i++) {
      for (let j = i; j < Math.min(i + 10, textSpans.length); j++) {
        const spanRange = textSpans.slice(i, j + 1);
        const combinedText = spanRange.map(span => span.normalizedText).join(' ');
        
        const matchedWords = searchWords.filter(word => 
          combinedText.includes(word)
        );
        
        // If most words match, consider it a fuzzy match
        if (matchedWords.length >= Math.ceil(searchWords.length * 0.7)) {
          matches.push({
            startSpanIndex: i,
            endSpanIndex: j,
            startOffset: 0,
            endOffset: spanRange[spanRange.length - 1].normalizedText.length,
            matchText: combinedText
          });
        }
      }
    }

    return matches;
  };

  // Apply highlights to the DOM
  const applyHighlights = (matches: HighlightMatch[], textSpans: TextSpan[]) => {
    // Remove existing highlights
    textSpans.forEach(span => {
      const existingHighlights = span.element.querySelectorAll('.custom-highlight');
      existingHighlights.forEach(highlight => {
        const parent = highlight.parentNode;
        if (parent) {
          parent.replaceChild(document.createTextNode(highlight.textContent || ''), highlight);
          parent.normalize();
        }
      });
    });

    // Apply new highlights
    matches.forEach(match => {
      if (match.startSpanIndex === match.endSpanIndex) {
        // Single span highlight
        const span = textSpans[match.startSpanIndex];
        const originalText = span.element.textContent || '';
        const before = originalText.substring(0, match.startOffset);
        const highlighted = originalText.substring(match.startOffset, match.endOffset);
        const after = originalText.substring(match.endOffset);

        span.element.innerHTML = 
          before + 
          `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${highlighted}</span>` + 
          after;
      } else {
        // Multi-span highlight
        for (let i = match.startSpanIndex; i <= match.endSpanIndex; i++) {
          const span = textSpans[i];
          const originalText = span.element.textContent || '';
          
          let highlightStart = 0;
          let highlightEnd = originalText.length;
          
          if (i === match.startSpanIndex) {
            highlightStart = match.startOffset;
          }
          if (i === match.endSpanIndex) {
            highlightEnd = match.endOffset;
          }

          const before = originalText.substring(0, highlightStart);
          const highlighted = originalText.substring(highlightStart, highlightEnd);
          const after = originalText.substring(highlightEnd);

          span.element.innerHTML = 
            before + 
            `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${highlighted}</span>` + 
            after;
        }
      }
    });
  };

  // Main highlighting function
  const highlightTextInPage = useCallback(() => {
    if (!highlightText || !pageRef.current) return;

    const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
    if (!textLayer) return;

    // Build text map
    const spans = buildTextMap(textLayer);
    setTextSpans(spans);

    // Find matches
    const matches = findMatches(spans, highlightText);
    
    console.log(`Found ${matches.length} matches for "${highlightText}"`);
    
    // Apply highlights
    if (matches.length > 0) {
      applyHighlights(matches, spans);
    }
  }, [highlightText]);

  // Enhanced page render success handler
  const onPageRenderSuccess = useCallback(() => {
    console.log(`Page rendered successfully`);
    if (highlightText && pageRef.current) {
      // Use multiple timeout strategies for different PDF types
      const timeouts = [100, 300, 600, 1000];
      
      timeouts.forEach(timeout => {
        setTimeout(() => {
          const textLayer = pageRef.current?.querySelector('.react-pdf__Page__textContent');
          if (textLayer && textLayer.children.length > 0) {
            highlightTextInPage();
          }
        }, timeout);
      });
    }
  }, [highlightText, highlightTextInPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
  }

  // Re-highlight when highlightText changes
  useEffect(() => {
    if (highlightText) {
      const timer = setTimeout(highlightTextInPage, 200);
      return () => clearTimeout(timer);
    }
  }, [highlightText, highlightTextInPage]);

  console.log(`PDF loaded with ${numPages} pages`);
  return (
    <div className="flex items-center justify-center flex-row pdf-viewer-container">
      <Document
        file="https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/04d34a7e-b431-4191-ab42-4afaec0e6f0b-280+Richards+-+OM.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div ref={pageRef}>
          {isDocumentLoaded && <Page
            pageNumber={Number(pageNumber)}
            onRenderSuccess={onPageRenderSuccess}
            scale={1.0}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />}
        </div>
      </Document>

      <style jsx>{`
        .custom-highlight {
          background-color: ${highlightColor} !important;
          padding: 1px 2px;
          border-radius: 2px;
          font-weight: 500;
          color: black !important;
        }

        .pdf-document-container {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 400px;
        }

        .react-pdf__Document {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .react-pdf__Page {
          margin-bottom: 1rem;
        }

        .react-pdf__Page__textContent {
          position: absolute !important;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          opacity: 1;
          line-height: 1;
        }

        .react-pdf__Page__textContent span {
          position: absolute;
          white-space: pre;
          cursor: text;
          transform-origin: 0% 0%;
        }
      `}</style>
    </div>
  );
}


