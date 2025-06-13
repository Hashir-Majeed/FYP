import { useCallback } from "react";
import useSWR from "swr";
import { Osdk, PageResult } from "@osdk/client";
import { Teacher } from "@tutorial-todo-aip-app/sdk";
import { client } from "../auth/client";
import { Teacher as TeacherInterface } from "../interfaces/Teacher";

function useTeachers() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    TeacherInterface[]
  >("teachers", async () => {
    try {
      const result: PageResult<Osdk.Instance<Teacher>> = await client(Teacher).fetchPage({
        $pageSize: 50,
      });
      
      const teachers: TeacherInterface[] = result.data.map(teacher => ({
        firstName: teacher.firstName || '',
        lastName: teacher.lastName || '',
        email: teacher.email || '',
        subjectId: teacher.subjectId || 0,
        teacherId: teacher.teacherId || 0,
        subject: teacher.subject || '',
      }));

      return teachers;
    } catch (error) {
      console.error("Failed to fetch teachers", error);
      return [];
    }
  });

  return {
    teachers: data,
    isLoading,
    isValidating,
    isError: error,
  };
}

export default useTeachers;
