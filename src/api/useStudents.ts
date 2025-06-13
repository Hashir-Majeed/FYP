import { useCallback } from "react";
import useSWR from "swr";
import { Osdk, PageResult } from "@osdk/client";
import { uep_student } from "@tutorial-todo-aip-app/sdk";
import { client } from "../auth/client";
import { Student } from "../interfaces/Student";

function useStudents() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    Student[]
  >("students", async () => {
    try {
      const result: PageResult<Osdk.Instance<uep_student>> = await client(uep_student).fetchPage({
        $pageSize: 50,
      });
      
      const students: Student[] = result.data.map(student => ({
        address: student.address || '',
        dateOfBirth: student.dateOfBirth || '',
        enrollmentDate: student.enrollmentDate || '',
        examCandidateNumber: student.examCandidateNumber || '',
        firstName: student.firstName || '',
        house: student.house || '',
        lastName: student.lastName || '',
        photoConsent: Boolean(student.photoConsent),
        previousSchool: student.previousSchool || 0,
        studentId: student.studentId || 0,
        subjects: student.subjects || [],
        tripConsent: Boolean(student.tripConsent),
        uci: student.uci || '',
        tutor: student.tutor || 0,
        yearGroup: student.yearGroup || 0
      }));

      return students;
    } catch (error) {
      console.error("Failed to fetch students", error);
      return [];
    }
  });

  return {
    students: data,
    isLoading,
    isValidating,
    isError: error,
  };
}

export default useStudents;
