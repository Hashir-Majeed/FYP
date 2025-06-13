import { useCallback } from "react";
import useSWR from "swr";
import { Osdk, PageResult } from "@osdk/client";
import { Report_uep } from "@tutorial-todo-aip-app/sdk";
import { client } from "../auth/client";
import { Report } from "../interfaces/Report";

function useReports() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    Report[]
  >("reports", async () => {
    try {
      const result: PageResult<Osdk.Instance<Report_uep>> = await client(Report_uep).fetchPage({
        $pageSize: 50,
      });
      
      const reports: Report[] = result.data.map(report => ({
        uuid: report.uuid || '',
        reportCard: report.reportCardArrayJoin || '',
        reportSummarisation: report.reportSummarisation || '',
        chunkedReport: report.extractedText || [],
        studentId: report.studentId || 0,
        selfReflection: report.entityExtraction?.selfReflection || '',
        sentimentAnalysis: report.sentimentAnalysis || 0
      }));

      return reports;
    } catch (error) {
      console.error("Failed to fetch reports", error);
      return [];
    }
  });

  return {
    reports: data,
    isLoading,
    isValidating,
    isError: error,
  };
}

export default useReports;
