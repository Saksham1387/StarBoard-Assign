"use client";
import { ExternalLink, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TNews } from "../api/getnews/route";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/helper";
import Image from "next/image";
import { useLeaseStore } from "@/store/leaseStore";

export default function LeaseNews() {
  const newsPerPage = 5;
  const { leaseData, setLeaseData, isDataLoaded } = useLeaseStore();
  const tenant = leaseData.tenant!;
  const [news, setNews] = useState<TNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // There was data inconsistency in the first few responses, so i am using the second page as the default
  const [startIndex, setStartIndex] = useState(2);
  const [endIndex, setEndIndex] = useState(newsPerPage);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/getnews",{
        method: "POST",
        body: JSON.stringify({ query: tenant.name }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch news");
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setNews(data);
      } else {
        console.warn("news_results is not an array", data.news_results);
        setNews([]);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news. Please try again later.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderSkeleton = () =>
    Array.from({ length: newsPerPage }).map((_, i) => (
      <Card
        key={`skeleton-${i}`}
        className="mt-4 flex flex-col sm:flex-row overflow-hidden rounded-2xl shadow-sm border"
      >
        <Skeleton className="w-full sm:w-[200px] h-[130px] m-2 rounded-2xl" />
        <div className="flex flex-col justify-between p-4 w-full">
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <div className="flex space-x-4 mt-2">
              <Skeleton className="h-4 w-20 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
        </div>
      </Card>
    ));

  const currentNews = news.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span>Tenant News</span>
            <Badge variant="outline" className="w-fit">
              {tenant.name}
            </Badge>
          </CardTitle>
          <CardDescription>
            Recent news and developments about {tenant.name} that may impact
            their business operations and lease status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            renderSkeleton()
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : news.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No news available
            </div>
          ) : (
            <>
              {currentNews.map((news, index) => (
                <Card
                  key={index}
                  className="mt-4 flex flex-col sm:flex-row overflow-hidden rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="w-full sm:w-[200px] h-[130px] relative flex-shrink-0">
                    <Image
                      src={news.thumbnail}
                      alt={news.title}
                      fill
                      className="object-cover p-2 rounded-2xl"
                    />
                  </div>

                  <div className="flex flex-col justify-between p-4 w-full">
                    <div>
                      <CardTitle className="text-base font-semibold line-clamp-2">
                        {news.title}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mt-2 space-y-2 sm:space-y-0 sm:space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          {news.source?.icon ? (
                            <Image
                              src={news.source.icon}
                              alt={news.source?.name || "News Source"}
                              width={16}
                              height={16}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-muted rounded-full" />
                          )}
                          <span>{news.source?.name || "Unknown Source"}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(news.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          Read More <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Pagination className="mt-5">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        startIndex === 2
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                      onClick={() => {
                        setStartIndex(Math.max(0, startIndex - newsPerPage));
                        setEndIndex(
                          Math.max(newsPerPage, endIndex - newsPerPage)
                        );
                      }}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      className={
                        endIndex >= news.length
                          ? "pointer-cursor opacity-50"
                          : undefined
                      }
                      onClick={() => {
                        setStartIndex(startIndex + newsPerPage);
                        setEndIndex(
                          Math.min(news.length, endIndex + newsPerPage)
                        );
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
