import { useCallback } from "react";
import useSWR from "swr";
import type { MockProject } from "../mocks";
import { Osdk, PageResult } from "@osdk/client";
import { fypcreateOsdkTodoProject, fypdeleteOsdkTodoProject, FyposdkTodoProject, fypupdateOsdkProjectDescription, osdkTodoTaskSummarisation } from "@tutorial-todo-aip-app/sdk";
import { client } from "../auth/client";

function useProjects() {
  const { data, isLoading, isValidating, error, mutate } = useSWR<
    MockProject[]
  >("projects", async () => {
    try {
      const result: PageResult<Osdk.Instance<FyposdkTodoProject>> = await client(FyposdkTodoProject).fetchPage({
          $orderBy: {"name": "asc"},
          $pageSize: 50,
      });
      const projectsList: MockProject[] = result.data.map((project) => ({
          $apiName: project.$apiName,
          $primaryKey: project.$primaryKey,
          id: project.id,
          name: project.name || "",
          description: project.description || "",
          tasks: [], // Initialize with empty tasks array
      }));
      return projectsList;
  } catch (error) {
      console.error("Failed to fetch projects", error);
      return [];
  }
  });

    const createProject: (
      name: string,
    ) => Promise<MockProject["$primaryKey"]> = useCallback(
      async (name) => {
        const result = await client(fypcreateOsdkTodoProject).applyAction(
            { name, budget: 50 },
            { $returnEdits: true },
        );
        if (result.type !== "edits") {
            throw new Error("Expected edits to be returned");
        }
        await mutate();
        return result.addedObjects![0].primaryKey as Osdk.Instance<FyposdkTodoProject>["$primaryKey"];
    },
      [mutate],
    );

    const updateProjectDescription: (project: MockProject) => Promise<void> =
      useCallback(
      async (project) => {
          const descriptionResult = await client(osdkTodoTaskSummarisation).executeFunction({ osdkTodoProject: project.$primaryKey });
          const description = descriptionResult;
          await client(fypupdateOsdkProjectDescription).applyAction({
              "osdkTodoProject": project.$primaryKey,
              "description": description,
              });
          await mutate();
      },
      [mutate],
  );

  const deleteProject: (project: MockProject) => Promise<void> = useCallback(
    async (project) => {
      await client(fypdeleteOsdkTodoProject).applyAction({
        "osdkTodoProject": project.$primaryKey,
      });
      await mutate();
    },
    [mutate],
);

  return {
    projects: data,
    isLoading,
    isValidating,
    isError: error,
    createProject,
    deleteProject,
    updateProjectDescription,
  };
}

export default useProjects;
