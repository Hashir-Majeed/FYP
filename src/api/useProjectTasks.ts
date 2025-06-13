import { useCallback } from "react";
import useSWR from "swr";
import { MockProject, MockTask } from "../mocks";
import { client } from "../auth/client";
import { fypcreateOsdkTodoTask, fypdeleteOsdkTodoTask, FyposdkTodoTask, getTaskDescription } from "@tutorial-todo-aip-app/sdk";
import { Osdk } from "@osdk/client";

export function useProjectTasks(project: MockProject | undefined) {
  const { data, isLoading, isValidating, error, mutate } = useSWR<MockTask[]>(
    project != null ? `projects/${project.id}/tasks` : null,
    async () => {
      if (project == null) {
          return [];
      }
      const tasks: MockTask[] = [];
      for await (const task of client(FyposdkTodoTask).where({projectId: {$eq: project.id}}).asyncIter()) {
          const resultTask: MockTask = {
              $apiName: task.$apiName,
              $primaryKey: task.$primaryKey,
              id: task.id,
              title: task.title || "",
              description: task.description || "",
          };
          tasks.push(resultTask);
      }
      return tasks;
  },
  );

    /**
   * Converts a date to a local date string, e.g. 2024-10-21
   */
  function getLocalDate(date: Date) {
    const offset = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offset).toISOString().split("T")[0];
  }

  const createTask: (
    title: string,
    description?: string,
  ) => Promise<MockTask["$primaryKey"] | undefined> = useCallback(
    async (title, description) => {
      if (project == null) {
        return undefined;
      }

      const startDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(startDate.getDate() + 7);
      const result = await client(fypcreateOsdkTodoTask).applyAction(
        {
          title,
          description,
          start_date: getLocalDate(startDate),
          due_date: getLocalDate(dueDate),
          status: "IN PROGRESS",
          project_id: project.$primaryKey,
        },
        { $returnEdits: true },
      );

      if (result.type !== "edits") {
        throw new Error("Expected edits to be returned");
      }

      await mutate();
      return result.addedObjects![0].primaryKey as Osdk.Instance<FyposdkTodoTask>["$primaryKey"];
    },
    [project, mutate],
  );

  const deleteTask: (task: MockTask) => Promise<void> = useCallback(
    async (task) => {
      if (project == null) {
        return;
      }
      await client(fypdeleteOsdkTodoTask).applyAction({
        "osdkTodoTask": task.$primaryKey,
      });
      await mutate();
    },
    [project, mutate],
  );

  const getRecommendedTaskDescription: (taskName: string) => Promise<string> =
    useCallback(
    async (taskName: string) => {
        const recommendedTaskDescription = await client(getTaskDescription).executeFunction({ taskName });
        await mutate();
        return recommendedTaskDescription
    },
    [mutate],
    );

  return {
    tasks: data,
    isLoading,
    isValidating,
    isError: error,
    createTask,
    deleteTask,
    getRecommendedTaskDescription,
  };
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
