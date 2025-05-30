"use client";
import { useCallback, useRef, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFViewerExample() {
  const [numPages, setNumPages] = useState<number>();
  const highlightColor = "#ff0"; // Custom highlight color
  const pageRef = useRef<HTMLDivElement>(null);

  const highlightText = "CONFIDENTIAL OFFERING MEMORANDUMThe newly-constructed logistics facility contains a total of 312,000 square feet featuring 36-foot clear heights, significant EV charging infrastructure, $63^{\\prime}\\times54^{\\prime}$ column spacing, as well as expansive rooftop and surface parking. Amazon has four five-year fair market renewal options, offering investors the opportunity to mark rents to market at the end of the remaining 13 years of term with an inevitably sticky tenant. 280 Richards offers Amazon unprecedented scale and access to efficiently tap into its most consequential MSA. Please direct all inquiries to Newmark."; // Text to highlight - simplified for testing

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const onPageRenderSuccess = useCallback(() => {
    console.log(`Page rendered successfully`);
    if (highlightText && pageRef.current) {
      // Wait longer for text layer to be fully rendered
      setTimeout(() => {
        highlightTextInPage();
      }, 500);
    }
  }, [highlightText]);

  const highlightTextInPage = () => {
    if (!highlightText || !pageRef.current) return;

    // Find the text layer within the page
    const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
    if (!textLayer) {
      console.log('Text layer not found');
      return;
    }

    // Remove existing highlights
    const existingHighlights = textLayer.querySelectorAll('.custom-highlight');
    existingHighlights.forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });

    // Find and highlight text in spans
    const textElements = textLayer.querySelectorAll('span');
    const searchText = highlightText.toLowerCase();
    
    console.log(`Found ${textElements.length} text elements`);
    
    // Debug: Log all text content to see what's actually in the PDF
    textElements.forEach((element, index) => {
      const text = element.textContent || '';
      if (text.trim()) {
        console.log(`Element ${index}: "${text}" at position (${(element as HTMLElement).style.left}, ${(element as HTMLElement).style.top})`);
      }
    });

    // Highlight table-specific patterns
    // highlightTablePattern(textElements);
    
    // Standard single-span highlighting
    textElements.forEach((element, index) => {
      const textContent = element.textContent?.toLowerCase() || '';
      const originalText = element.textContent || '';
      
      if (textContent.includes(searchText)) {
        console.log(`Found match in element ${index}: "${originalText}"`);
        
        // Create a case-insensitive regex
        const regex = new RegExp(`(${highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const highlightedHTML = originalText.replace(
          regex, 
          `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">$1</span>`
        );
        element.innerHTML = highlightedHTML;
      }
    });

    // Alternative approach: look for partial matches across multiple spans
    const allText = Array.from(textElements).map(el => el.textContent || '').join('');
    if (allText.toLowerCase().includes(searchText)) {
      console.log('Text found across multiple spans, implementing cross-span highlighting...');
      highlightAcrossSpans(textElements, highlightText);
    }
  };

  const highlightAcrossSpans = (elements: NodeListOf<Element>, searchText: string) => {
    const spans = Array.from(elements);
    let fullText = '';
    let spanMap: Array<{ span: Element; start: number; end: number }> = [];
    
    // Build a map of text positions to spans
    spans.forEach(span => {
      const text = span.textContent || '';
      spanMap.push({
        span,
        start: fullText.length,
        end: fullText.length + text.length
      });
      fullText += text;
    });

    // Find matches in the full text
    const searchLower = searchText.toLowerCase();
    const fullTextLower = fullText.toLowerCase();
    let index = fullTextLower.indexOf(searchLower);
    
    while (index !== -1) {
      const matchStart = index;
      const matchEnd = index + searchText.length;
      
      // Find which spans contain this match
      spanMap.forEach(({ span, start, end }) => {
        const overlapStart = Math.max(matchStart, start);
        const overlapEnd = Math.min(matchEnd, end);
        
        if (overlapStart < overlapEnd) {
          // This span contains part of the match
          const spanText = span.textContent || '';
          const relativeStart = overlapStart - start;
          const relativeEnd = overlapEnd - start;
          
          const before = spanText.substring(0, relativeStart);
          const matched = spanText.substring(relativeStart, relativeEnd);
          const after = spanText.substring(relativeEnd);
          
          span.innerHTML = before + 
            `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${matched}</span>` + 
            after;
        }
      });
      
      // Look for next match
      index = fullTextLower.indexOf(searchLower, index + 1);
    }
  };

  const highlightTablePattern = (elements: NodeListOf<Element>) => {
    // Define the pattern we're looking for in table format
    const tablePattern = ['LCD', 'May-22', 'LXD', 'Sep-37', 'Annual Rent Steps', '3.00%'];
    const spans = Array.from(elements);
    
    // Group spans by approximate vertical position (same row)
    const rows: { [key: string]: Element[] } = {};
    
    spans.forEach(span => {
      const top = parseFloat((span as HTMLElement).style?.top || '0');
      const roundedTop = Math.round(top / 5) * 5; // Group by 5px intervals
      const key = roundedTop.toString();
      
      if (!rows[key]) rows[key] = [];
      rows[key].push(span);
    });

    // Sort rows by vertical position
    const sortedRows = Object.keys(rows)
      .map(key => ({ top: parseFloat(key), elements: rows[key] }))
      .sort((a, b) => a.top - b.top);

    console.log('Table rows found:', sortedRows.length);

    // Look for our pattern in sequential rows
    let patternIndex = 0;
    let foundSpans: Element[] = [];

    sortedRows.forEach(row => {
      // Sort elements in row by horizontal position
      const sortedElements = row.elements.sort((a, b) => {
        const leftA = parseFloat((a as HTMLElement).style?.left || '0');
        const leftB = parseFloat((b as HTMLElement).style?.left || '0');
        return leftA - leftB;
      });

      sortedElements.forEach(element => {
        const text = (element.textContent || '').trim();
        
        if (patternIndex < tablePattern.length && 
            text.toLowerCase().includes(tablePattern[patternIndex].toLowerCase())) {
          console.log(`Found pattern element ${patternIndex}: "${text}"`);
          foundSpans.push(element);
          patternIndex++;
        }
      });
    });

    // Highlight all found spans if we found the complete pattern
    if (patternIndex >= tablePattern.length || foundSpans.length >= 3) {
      console.log(`Highlighting ${foundSpans.length} table pattern elements`);
      foundSpans.forEach(span => {
        const originalHTML = span.innerHTML;
        span.innerHTML = `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${span.textContent}</span>`;
      });
    } else {
      console.log(`Pattern not complete. Found ${patternIndex} of ${tablePattern.length} elements`);
    }
  };

  return (
    <div className="flex items-center justify-center flex-row pdf-viewer-container">
      <Document
        file="https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/15158e48-3fc7-4020-b30e-64b0f98cb8e5-280+Richards+-+OM.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div ref={pageRef}>
          <Page
            pageNumber={4}
            onRenderSuccess={onPageRenderSuccess}
            scale={1.0}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
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
