"use client";
import { useCallback, useRef, useState } from "react";
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
export function PDFViewerExample({fileUrl, pageNumber , highlightText}: PDFViewerExampleProps) {
  const [numPages, setNumPages] = useState<number>();
  const highlightColor = "#ff0"; // Custom highlight color
  const pageRef = useRef<HTMLDivElement>(null);

  // Text to highlight - simplified for testing


  const observeTextLayer = () => {
    if (!pageRef.current) return;
    const observer = new MutationObserver((mutations, obs) => {
      const textLayer = pageRef.current?.querySelector('.react-pdf__Page__textContent');
      if (textLayer && textLayer.childElementCount > 0) {
        highlightTextInPage();
        obs.disconnect(); // Done observing
      }
    });
  
    observer.observe(pageRef.current, {
      childList: true,
      subtree: true,
    });
  };
  
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
    
    
    
    // Debug: Log all text content to see what's actually in the PDF
    textElements.forEach((element, index) => {
      const text = element.textContent || '';
      if (text.trim()) {
        
      }
    });

    // Highlight table-specific patterns
    // highlightTablePattern(textElements);
    
    // Standard single-span highlighting
    textElements.forEach((element, index) => {
      const textContent = element.textContent?.toLowerCase() || '';
      const originalText = element.textContent || '';
      
      if (textContent.includes(searchText)) {
       
        
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




  return (
    <div className="flex items-center justify-center flex-row pdf-viewer-container">
      <Document
        file="https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/15158e48-3fc7-4020-b30e-64b0f98cb8e5-280+Richards+-+OM.pdf"
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div ref={pageRef}>
          <Page
            pageNumber={pageNumber}
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


// "use client";
// import { useCallback, useRef, useState } from "react";
// import { Document, Page } from "react-pdf";
// import { pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface HighlightRange {
//   startPosition: number;
//   endPosition: number;
//   color?: string;
// }

// interface PDFViewerExampleProps {
//   fileUrl?: string;
//   pageNumber?: number;
//   highlightRanges?: HighlightRange[]; // Array of ranges to highlight
//   // Legacy support
//   highlightText?: string;
// }

// export function PDFViewerExample({
//   fileUrl, 
//   pageNumber=4, 
//   highlightRanges = [{ startPosition: 2603, endPosition: 2623 }],
//   highlightText
// }: PDFViewerExampleProps) {
//   const [numPages, setNumPages] = useState<number>();
//   const defaultHighlightColor = "#ff0";
//   const pageRef = useRef<HTMLDivElement>(null);

//   function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
//     setNumPages(numPages);
//   }

//   const onPageRenderSuccess = useCallback(() => {
//     console.log(`Page rendered successfully`);
//     if ((highlightRanges.length > 0 || highlightText) && pageRef.current) {
//       setTimeout(() => {
//         if (highlightRanges.length > 0) {
//           highlightByPositions();
//         } else if (highlightText) {
//           highlightTextInPage(); // Fallback to text-based highlighting
//         }
//       }, 500);
//     }
//   }, [highlightRanges, highlightText]);

//   const highlightByPositions = () => {
//     if (!pageRef.current || highlightRanges.length === 0) return;

//     const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
//     if (!textLayer) return;

//     // Remove existing highlights
//     clearExistingHighlights(textLayer);

//     // Get all text spans
//     const textElements = textLayer.querySelectorAll('span');
//     const spans = Array.from(textElements);
    
//     // Build a map of text positions to spans
//     let fullText = '';
//     let spanMap: Array<{ 
//       span: Element; 
//       start: number; 
//       end: number; 
//       originalText: string;
//     }> = [];
    
//     spans.forEach(span => {
//       const text = span.textContent || '';
//       spanMap.push({
//         span,
//         start: fullText.length,
//         end: fullText.length + text.length,
//         originalText: text
//       });
//       fullText += text;
//     });

//     console.log(`Full text length: ${fullText.length}`);
//     console.log(`Full text preview: "${fullText.substring(0, 200)}..."`);

//     // Apply highlights for each range
//     highlightRanges.forEach((range, rangeIndex) => {
//       const { startPosition, endPosition, color = defaultHighlightColor } = range;
      
//       if (startPosition >= fullText.length || endPosition > fullText.length || startPosition >= endPosition) {
//         console.warn(`Invalid range ${rangeIndex}: start=${startPosition}, end=${endPosition}, textLength=${fullText.length}`);
//         return;
//       }

//       console.log(`Highlighting range ${rangeIndex}: ${startPosition}-${endPosition}`);
//       console.log(`Text to highlight: "${fullText.substring(startPosition, endPosition)}"`);

//       // Find spans that overlap with this range
//       spanMap.forEach(({ span, start, end, originalText }) => {
//         const overlapStart = Math.max(startPosition, start);
//         const overlapEnd = Math.min(endPosition, end);
        
//         if (overlapStart < overlapEnd) {
//           // This span contains part of the range
//           const relativeStart = overlapStart - start;
//           const relativeEnd = overlapEnd - start;
          
//           const before = originalText.substring(0, relativeStart);
//           const matched = originalText.substring(relativeStart, relativeEnd);
//           const after = originalText.substring(relativeEnd);
          
//           // Create highlight span
//           const highlightSpan = `<span class="custom-highlight range-${rangeIndex}" style="background-color: ${color}; padding: 1px 2px; border-radius: 2px; color: black; font-weight: 500;">${matched}</span>`;
          
//           // Update span content
//           span.innerHTML = before + highlightSpan + after;
//         }
//       });
//     });
//   };

//   const clearExistingHighlights = (textLayer: Element) => {
//     const existingHighlights = textLayer.querySelectorAll('.custom-highlight');
//     existingHighlights.forEach(el => {
//       const parent = el.parentNode;
//       if (parent) {
//         parent.replaceChild(document.createTextNode(el.textContent || ''), el);
//         parent.normalize();
//       }
//     });
//   };

//   // Legacy text-based highlighting (kept for backward compatibility)
//   const highlightTextInPage = () => {
//     if (!highlightText || !pageRef.current) return;

//     const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
//     if (!textLayer) return;

//     clearExistingHighlights(textLayer);

//     const textElements = textLayer.querySelectorAll('span');
//     const searchText = highlightText.toLowerCase();
    
//     textElements.forEach((element) => {
//       const textContent = element.textContent?.toLowerCase() || '';
//       const originalText = element.textContent || '';
      
//       if (textContent.includes(searchText)) {
//         const regex = new RegExp(`(${highlightText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
//         const highlightedHTML = originalText.replace(
//           regex, 
//           `<span class="custom-highlight" style="background-color: ${defaultHighlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">$1</span>`
//         );
//         element.innerHTML = highlightedHTML;
//       }
//     });
//   };

//   // Utility function to get text content and positions (for debugging)
//   const getTextPositions = () => {
//     if (!pageRef.current) return;
    
//     const textLayer = pageRef.current.querySelector('.react-pdf__Page__textContent');
//     if (!textLayer) return;
    
//     const textElements = textLayer.querySelectorAll('span');
//     const spans = Array.from(textElements);
//     let fullText = '';
    
//     spans.forEach((span, index) => {
//       const text = span.textContent || '';
//       console.log(`Span ${index}: position ${fullText.length}-${fullText.length + text.length}: "${text}"`);
//       fullText += text;
//     });
    
//     console.log(`Total text length: ${fullText.length}`);
//     return fullText;
//   };

//   return (
//     <div className="flex items-center justify-center flex-row pdf-viewer-container">
//       <Document
//         file="https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/15158e48-3fc7-4020-b30e-64b0f98cb8e5-280+Richards+-+OM.pdf"
//         onLoadSuccess={onDocumentLoadSuccess}
//       >
//         <div ref={pageRef}>
//           <Page
//             pageNumber={pageNumber}
//             onRenderSuccess={onPageRenderSuccess}
//             scale={1.0}
//             className="shadow-lg"
//             renderTextLayer={true}
//             renderAnnotationLayer={true}
//           />
//         </div>
//       </Document>

//       {/* Debug button - remove in production */}
//       <button 
//         onClick={getTextPositions}
//         style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}
//       >
//         Debug Text Positions
//       </button>

//       <style jsx>{`
//         .custom-highlight {
//           background-color: ${defaultHighlightColor} !important;
//           padding: 1px 2px;
//           border-radius: 2px;
//           font-weight: 500;
//           color: black !important;
//         }

//         .pdf-document-container {
//           display: flex;
//           justify-content: center;
//           align-items: flex-start;
//           min-height: 400px;
//         }

//         .react-pdf__Document {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .react-pdf__Page {
//           margin-bottom: 1rem;
//         }

//         .react-pdf__Page__textContent {
//           position: absolute !important;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           overflow: hidden;
//           opacity: 1;
//           line-height: 1;
//         }

//         .react-pdf__Page__textContent span {
//           position: absolute;
//           white-space: pre;
//           cursor: text;
//           transform-origin: 0% 0%;
//         }
//       `}</style>
//     </div>
//   );
// }