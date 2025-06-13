import { useCallback } from "react";
import useSWR from "swr";
import { Osdk, PageResult } from "@osdk/client";
import { School } from "@tutorial-todo-aip-app/sdk";
import { client } from "../auth/client";
import { School as SchoolInterface } from "../interfaces/School";

function useSchools() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    SchoolInterface[]
  >("schools", async () => {
    try {
      const result: PageResult<Osdk.Instance<School>> = await client(School).fetchPage({
        $pageSize: 50,
      });
      
      const schools: SchoolInterface[] = result.data.map(school => ({
        address: school.address || '',
        inspectionReport: school.inspectionReport || '',
        recommendations: school.inspectionReportChunks?.recommendations || '',
        academicQuality: school.inspectionReportChunks?.qualityOfAcademics || '',
        personalDevelopment: school.inspectionReportChunks?.qualityOfPersonalDevelopment || '',
        schoolId: school.schoolId || 0,
        sentimentAnalysis: school.sentimentAnalysis || '',
        schoolName: school.schoolName || '',
        schoolType: school.schoolType || ''
      }));

      return schools;
    } catch (error) {
      console.error("Failed to fetch schools", error);
      return [];
    }
  });

  return {
    schools: data,
    isLoading,
    isValidating,
    isError: error,
  };
}

export default useSchools;
