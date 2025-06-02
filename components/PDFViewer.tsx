"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import Papa from "papaparse";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useLeaseStore } from "@/store/leaseStore";
import { useFileStore } from "@/store/fielStore";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ViewerProps {
  fileUrl?: string;
  pageNumber?: string | number;
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

interface CSVData {
  headers: string[];
  rows: string[][];
}

interface ColumnValuePair {
  columnName: string;
  value: string;
}

export default function EnhancedPDFCSVViewer({
  fileUrl,
  pageNumber,
  highlightText,
}: ViewerProps) {
  console.log(pageNumber, highlightText);
  const [numPages, setNumPages] = useState<number>(0);
  const { fileData } = useFileStore();
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [csvUrl, setCsvUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const highlightColor = "#ff0";
  const pageRef = useRef<HTMLDivElement>(null);
  const csvRef = useRef<HTMLDivElement>(null);
  const [textSpans, setTextSpans] = useState<TextSpan[]>([]);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  console.log("File Data:", fileData);
  // Check if we're dealing with a CSV based on pageNumber
  const isCSVMode = pageNumber === "CSV" || pageNumber === "csv";

  useEffect(() => {
    if (fileData && fileData.length > 0) {
      const pdfFile = fileData.find(file => file.fileName.includes('.pdf'));
      const pdfUrl = pdfFile ? pdfFile.fileUrl : "";
      setPdfUrl(pdfUrl);
    } else {
      // If no file data is available, set a placeholder URL or handle accordingly
      setPdfUrl("https://example.com/placeholder.pdf");
    }
  }, [fileData]);
  // Parse CSV file name and highlight text from highlightText prop
  useEffect(() => {
    if (isCSVMode && highlightText) {
      // Parse format: "CSV: tenant_data.csv - Lease Start: 01/05/2022"
      const csvMatch = highlightText.match(/CSV:\s*([^-]+)\s*-\s*(.+)/);
      // get the file name
      if (csvMatch) {
        const fileName = csvMatch[1].trim();
        console.log("CSV File Name:", fileName);
        const fileUrl = fileData.find(
          (file) => file.fileName === fileName
        )?.fileUrl;

        // For demo purposes, using a placeholder URL - you'd replace this with your actual CSV URL logic
        setCsvUrl(fileUrl!);
      }
      // if (csvMatch) {
      //   // For demo purposes, using a placeholder URL - you'd replace this with your actual CSV URL logic
      //   setCsvUrl(`https://assignment-starbaord.s3.ap-south-1.amazonaws.com/uploads/89ee002b-3693-488e-bc4e-fab1ee6c66aa-280_Richards_Pro_Forma (2).csv`);
      // }
    }
  }, [isCSVMode, highlightText]);

  // Load CSV data
  const loadCSV = useCallback(async () => {
    if (!csvUrl) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvContent = await response.text();

      Papa.parse(csvContent, {
        header: false,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          const data = results.data as string[][];
          if (data.length > 0) {
            setCsvData({
              headers: data[0],
              rows: data.slice(1),
            });
          }
          setLoading(false);
        },
        error: (error: Error) => {
          setError(`Error parsing CSV: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      setError(
        `Error loading CSV: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
      setLoading(false);
    }
  }, [csvUrl]);

  useEffect(() => {
    if (isCSVMode && csvUrl) {
      loadCSV();
    }
  }, [isCSVMode, csvUrl, loadCSV]);

  // Extract just the highlight text from the full string
  const getHighlightText = useCallback(() => {
    if (!highlightText) return "";

    if (isCSVMode) {
      // Extract text after the dash: "CSV: tenant_data.csv - Lease Start: 01/05/2022" -> "Lease Start: 01/05/2022"
      const match = highlightText.match(/CSV:\s*[^-]+\s*-\s*(.+)/);
      return match ? match[1].trim() : "";
    }

    return highlightText;
  }, [highlightText, isCSVMode]);

  // Parse multiple column-value pairs from CSV highlight text
  const parseCSVHighlightData = useCallback((): ColumnValuePair[] => {
    const textToHighlight = getHighlightText();
    if (!textToHighlight) return [];

    const pairs: ColumnValuePair[] = [];

    // Split by comma to handle multiple pairs: "Year Ending: Jun-25, Scheduled Base Rent ($): 7613773"
    const segments = textToHighlight.split(",").map((s) => s.trim());

    for (const segment of segments) {
      // Parse format: "Column Name: Value"
      const match = segment.match(/^([^:]+):\s*(.+)$/);
      if (match) {
        pairs.push({
          columnName: match[1].trim(),
          value: match[2].trim(),
        });
      } else if (segment.trim()) {
        // If no colon found, treat the whole segment as a value to search for
        pairs.push({
          columnName: "",
          value: segment.trim(),
        });
      }
    }

    // If no pairs found with colon format, treat the whole text as a single value
    if (pairs.length === 0 && textToHighlight.trim()) {
      pairs.push({
        columnName: "",
        value: textToHighlight.trim(),
      });
    }

    return pairs;
  }, [getHighlightText]);

  // Enhanced CSV highlighting function for multiple column-value pairs
  const highlightCSVText = useCallback(() => {
    if (!csvRef.current || !csvData) return;

    const columnValuePairs = parseCSVHighlightData();
    if (columnValuePairs.length === 0) return;

    const csvContainer = csvRef.current;

    // Process each column-value pair
    columnValuePairs.forEach(({ columnName, value }) => {
      if (!value) return;

      if (columnName) {
        // Find the column index
        const columnIndex = csvData.headers.findIndex(
          (header) =>
            header.toLowerCase().trim() === columnName.toLowerCase().trim()
        );

        if (columnIndex !== -1) {
          // Highlight header cell
          const headerCells = csvContainer.querySelectorAll("th");
          const headerCell = headerCells[columnIndex];
          if (
            headerCell &&
            headerCell.textContent?.toLowerCase().trim() ===
              columnName.toLowerCase().trim()
          ) {
            const headerText = headerCell.textContent;
            const regex = new RegExp(
              `(${columnName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
              "gi"
            );
            headerCell.innerHTML = headerText.replace(
              regex,
              `<span class="csv-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black; font-weight: 500;">$1</span>`
            );
          }

          // Highlight matching values in the specific column
          const rows = csvContainer.querySelectorAll("tbody tr");
          rows.forEach((row) => {
            const cells = row.querySelectorAll("td");
            const targetCell = cells[columnIndex];
            if (targetCell) {
              const cellText = targetCell.textContent || "";
              if (cellText.toLowerCase().includes(value.toLowerCase())) {
                const regex = new RegExp(
                  `(${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                  "gi"
                );
                // Preserve existing highlights by checking if the cell already has highlighted content
                let currentHTML = targetCell.innerHTML;
                if (!currentHTML.includes("csv-highlight")) {
                  currentHTML = cellText;
                }
                const highlightedHTML = currentHTML.replace(
                  regex,
                  `<span class="csv-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black; font-weight: 500;">$1</span>`
                );
                targetCell.innerHTML = highlightedHTML;
              }
            }
          });
        } else {
          // Column not found, fall back to highlighting the value anywhere
          const allCells = csvContainer.querySelectorAll("td, th");
          allCells.forEach((cell) => {
            const cellText = cell.textContent || "";
            if (cellText.toLowerCase().includes(value.toLowerCase())) {
              const regex = new RegExp(
                `(${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
                "gi"
              );
              // Preserve existing highlights
              let currentHTML = cell.innerHTML;
              if (!currentHTML.includes("csv-highlight")) {
                currentHTML = cellText;
              }
              const highlightedHTML = currentHTML.replace(
                regex,
                `<span class="csv-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black; font-weight: 500;">$1</span>`
              );
              cell.innerHTML = highlightedHTML;
            }
          });
        }
      } else {
        // No column specified, highlight the value anywhere
        const allCells = csvContainer.querySelectorAll("td, th");
        allCells.forEach((cell) => {
          const cellText = cell.textContent || "";
          if (cellText.toLowerCase().includes(value.toLowerCase())) {
            const regex = new RegExp(
              `(${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
              "gi"
            );
            // Preserve existing highlights
            let currentHTML = cell.innerHTML;
            if (!currentHTML.includes("csv-highlight")) {
              currentHTML = cellText;
            }
            const highlightedHTML = currentHTML.replace(
              regex,
              `<span class="csv-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black; font-weight: 500;">$1</span>`
            );
            cell.innerHTML = highlightedHTML;
          }
        });
      }
    });
  }, [csvData, parseCSVHighlightData, highlightColor]);

  // Apply CSV highlighting when data loads or highlight text changes
  useEffect(() => {
    if (isCSVMode && csvData && getHighlightText()) {
      setTimeout(highlightCSVText, 100);
    }
  }, [isCSVMode, csvData, highlightCSVText, getHighlightText]);

  // Enhanced PDF functions (from the second document)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/[\u00A0\u2000-\u200B\u2028\u2029]/g, " ")
      .trim();
  };

  const createSearchRegex = (searchText: string): RegExp => {
    const escaped = searchText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const flexible = escaped.replace(/\s+/g, "\\s*");
    return new RegExp(flexible, "gi");
  };

  const buildTextMap = (textLayer: Element): TextSpan[] => {
    const spans = Array.from(
      textLayer.querySelectorAll("span")
    ) as HTMLElement[];
    const textSpans: TextSpan[] = [];
    let currentIndex = 0;

    spans.forEach((span) => {
      const text = span.textContent || "";
      const normalizedText = normalizeText(text);

      if (text.trim()) {
        textSpans.push({
          element: span,
          text,
          normalizedText,
          startIndex: currentIndex,
          endIndex: currentIndex + normalizedText.length,
          rect: span.getBoundingClientRect(),
        });
        currentIndex += normalizedText.length;
      }
    });

    return textSpans;
  };

  const findMatches = (
    textSpans: TextSpan[],
    searchText: string
  ): HighlightMatch[] => {
    if (!searchText.trim()) return [];

    const matches: HighlightMatch[] = [];
    const normalizedSearch = normalizeText(searchText);
    const searchRegex = createSearchRegex(normalizedSearch);

    // Strategy 1: Direct span matching
    textSpans.forEach((span, index) => {
      const spanMatches = [...span.normalizedText.matchAll(searchRegex)];
      spanMatches.forEach((match) => {
        if (match.index !== undefined) {
          matches.push({
            startSpanIndex: index,
            endSpanIndex: index,
            startOffset: match.index,
            endOffset: match.index + match[0].length,
            matchText: match[0],
          });
        }
      });
    });

    // Strategy 2: Cross-span matching
    const fullText = textSpans.map((span) => span.normalizedText).join("");
    const crossSpanMatches = [...fullText.matchAll(searchRegex)];

    crossSpanMatches.forEach((match) => {
      if (match.index !== undefined) {
        const startPos = match.index;
        const endPos = match.index + match[0].length;

        const startSpan = textSpans.findIndex(
          (span) => startPos >= span.startIndex && startPos < span.endIndex
        );
        const endSpan = textSpans.findIndex(
          (span) => endPos > span.startIndex && endPos <= span.endIndex
        );

        if (startSpan !== -1 && endSpan !== -1) {
          const isNewMatch = !matches.some(
            (existingMatch) =>
              existingMatch.startSpanIndex === startSpan &&
              existingMatch.endSpanIndex === endSpan &&
              Math.abs(
                existingMatch.startOffset -
                  (startPos - textSpans[startSpan].startIndex)
              ) < 2
          );

          if (isNewMatch) {
            matches.push({
              startSpanIndex: startSpan,
              endSpanIndex: endSpan,
              startOffset: startPos - textSpans[startSpan].startIndex,
              endOffset: endPos - textSpans[endSpan].startIndex,
              matchText: match[0],
            });
          }
        }
      }
    });

    // Strategy 3: Fuzzy matching
    if (matches.length === 0) {
      return findFuzzyMatches(textSpans, searchText);
    }

    return matches;
  };

  const findFuzzyMatches = (
    textSpans: TextSpan[],
    searchText: string
  ): HighlightMatch[] => {
    const matches: HighlightMatch[] = [];
    const searchWords = normalizeText(searchText)
      .split(" ")
      .filter((word) => word.length > 2);

    if (searchWords.length === 0) return matches;

    for (let i = 0; i < textSpans.length; i++) {
      for (let j = i; j < Math.min(i + 10, textSpans.length); j++) {
        const spanRange = textSpans.slice(i, j + 1);
        const combinedText = spanRange
          .map((span) => span.normalizedText)
          .join(" ");

        const matchedWords = searchWords.filter((word) =>
          combinedText.includes(word)
        );

        if (matchedWords.length >= Math.ceil(searchWords.length * 0.7)) {
          matches.push({
            startSpanIndex: i,
            endSpanIndex: j,
            startOffset: 0,
            endOffset: spanRange[spanRange.length - 1].normalizedText.length,
            matchText: combinedText,
          });
        }
      }
    }

    return matches;
  };

  const applyHighlights = (
    matches: HighlightMatch[],
    textSpans: TextSpan[]
  ) => {
    // Remove existing highlights
    textSpans.forEach((span) => {
      const existingHighlights =
        span.element.querySelectorAll(".custom-highlight");
      existingHighlights.forEach((highlight) => {
        const parent = highlight.parentNode;
        if (parent) {
          parent.replaceChild(
            document.createTextNode(highlight.textContent || ""),
            highlight
          );
          parent.normalize();
        }
      });
    });

    // Apply new highlights
    matches.forEach((match) => {
      if (match.startSpanIndex === match.endSpanIndex) {
        // Single span highlight
        const span = textSpans[match.startSpanIndex];
        const originalText = span.element.textContent || "";
        const before = originalText.substring(0, match.startOffset);
        const highlighted = originalText.substring(
          match.startOffset,
          match.endOffset
        );
        const after = originalText.substring(match.endOffset);

        span.element.innerHTML =
          before +
          `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${highlighted}</span>` +
          after;
      } else {
        // Multi-span highlight
        for (let i = match.startSpanIndex; i <= match.endSpanIndex; i++) {
          const span = textSpans[i];
          const originalText = span.element.textContent || "";

          let highlightStart = 0;
          let highlightEnd = originalText.length;

          if (i === match.startSpanIndex) {
            highlightStart = match.startOffset;
          }
          if (i === match.endSpanIndex) {
            highlightEnd = match.endOffset;
          }

          const before = originalText.substring(0, highlightStart);
          const highlighted = originalText.substring(
            highlightStart,
            highlightEnd
          );
          const after = originalText.substring(highlightEnd);

          span.element.innerHTML =
            before +
            `<span class="custom-highlight" style="background-color: ${highlightColor}; padding: 1px 2px; border-radius: 2px; color: black;">${highlighted}</span>` +
            after;
        }
      }
    });
  };

  const highlightTextInPage = useCallback(() => {
    const textToHighlight = getHighlightText();
    if (!textToHighlight || !pageRef.current) return;

    const textLayer = pageRef.current.querySelector(
      ".react-pdf__Page__textContent"
    );
    if (!textLayer) return;

    const spans = buildTextMap(textLayer);
    setTextSpans(spans);

    const matches = findMatches(spans, textToHighlight);

    console.log(`Found ${matches.length} matches for "${textToHighlight}"`);

    if (matches.length > 0) {
      applyHighlights(matches, spans);
    }
  }, [getHighlightText]);

  const onPageRenderSuccess = useCallback(() => {
    console.log(`Page rendered successfully`);
    const textToHighlight = getHighlightText();
    if (textToHighlight && pageRef.current) {
      const timeouts = [100, 300, 600, 1000];

      timeouts.forEach((timeout) => {
        setTimeout(() => {
          const textLayer = pageRef.current?.querySelector(
            ".react-pdf__Page__textContent"
          );
          if (textLayer && textLayer.children.length > 0) {
            highlightTextInPage();
          }
        }, timeout);
      });
    }
  }, [getHighlightText, highlightTextInPage]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setIsDocumentLoaded(true);
  }

  useEffect(() => {
    const textToHighlight = getHighlightText();
    if (textToHighlight && !isCSVMode) {
      const timer = setTimeout(highlightTextInPage, 200);
      return () => clearTimeout(timer);
    }
  }, [getHighlightText, highlightTextInPage, isCSVMode]);

  // Render CSV view with multiple highlights
  if (isCSVMode) {
    const columnValuePairs = parseCSVHighlightData();

    return (
      <div className="flex items-center justify-center flex-col csv-viewer-container p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">CSV Viewer</h3>
          {getHighlightText() && (
            <div className="text-sm text-gray-600">
              <p className="mb-2">Highlighting the following:</p>
              <div className="space-y-1">
                {columnValuePairs.map((pair, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {pair.columnName ? (
                      <>
                        <span className="text-xs text-gray-500">Column:</span>
                        <span className="font-mono bg-blue-100 px-2 py-1 rounded text-xs">
                          {pair.columnName}
                        </span>
                        <span className="text-xs text-gray-500">Value:</span>
                        <span className="font-mono bg-yellow-100 px-2 py-1 rounded text-xs">
                          {pair.value}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-gray-500">Value:</span>
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                          {pair.value}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && <div className="text-blue-600">Loading CSV...</div>}
        {error && (
          <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>
        )}

        {csvData && (
          <div ref={csvRef} className="csv-container overflow-auto max-w-full">
            <table className="border-collapse border border-gray-300 bg-white shadow-lg">
              <thead>
                <tr className="bg-gray-50">
                  {csvData.headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-gray-300 px-4 py-2 text-left font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <style jsx>{`
          .csv-highlight {
            background-color: ${highlightColor} !important;
            padding: 1px 2px;
            border-radius: 2px;
            font-weight: 500;
            color: black !important;
          }

          .csv-container {
            max-height: 600px;
            border-radius: 8px;
          }

          .csv-viewer-container {
            min-height: 400px;
          }
        `}</style>
      </div>
    );
  }

  // Render PDF view with enhanced highlighting
  console.log(`PDF loaded with ${numPages} pages`);
  return (
    <div className="flex items-center justify-center flex-row pdf-viewer-container">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <div ref={pageRef}>
          {isDocumentLoaded && (
            <Page
              pageNumber={Number(pageNumber)}
              onRenderSuccess={onPageRenderSuccess}
              scale={1.0}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          )}
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
