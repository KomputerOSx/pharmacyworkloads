// src/hooks/useDepModuleAss.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createDepModuleAssignment,
    deleteDepModuleAssignment,
    getAssignmentsByModule,
    getModuleAssignmentsByDepartment,
} from "@/services/admin/depModulesAssService";
import { toast } from "sonner";
import { DepModuleAssignment } from "@/types/moduleTypes";

// --- Query Keys ---
const depModuleAssKeys = {
    all: ["depModuleAssignments"] as const,
    lists: () => [...depModuleAssKeys.all, "list"] as const,
    listByDep: (depId: string) =>
        [...depModuleAssKeys.lists(), { depId }] as const,
    listByModule: (moduleId: string) =>
        [...depModuleAssKeys.lists(), { moduleId }] as const,
    details: () => [...depModuleAssKeys.all, "detail"] as const,
    detail: (id: string) => [...depModuleAssKeys.details(), id] as const,
};

/**
 * Hook to fetch module assignments for a specific department.
 * @param depId - The ID of the department (optional, query disabled if falsy).
 */
export function useDepModuleAssignments(depId?: string) {
    return useQuery<DepModuleAssignment[], Error>({
        // Use the updated service function name here
        queryKey: depModuleAssKeys.listByDep(depId!),
        queryFn: () => getModuleAssignmentsByDepartment(depId!),
        enabled: !!depId, // Only run query if depId is provided
        staleTime: 2 * 60 * 1000, // 2 minutes - assignments might change more often
        gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time
    });
}

export function useAssignmentsByModule(moduleId?: string) {
    return useQuery<DepModuleAssignment[], Error>({
        queryKey: depModuleAssKeys.listByModule(moduleId!),
        queryFn: () => getAssignmentsByModule(moduleId!),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
    });
}

/**
 * Hook for creating (assigning) a module to a department.
 */
export function useCreateDepModuleAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            depId: string;
            moduleId: string;
            orgId: string; // Include orgId if needed by service/rules
            userId?: string;
        }) =>
            createDepModuleAssignment(
                variables.depId,
                variables.moduleId,
                variables.orgId,
                variables.userId,
            ),

        onSuccess: async (newAssignment, variables) => {
            // Invalidate the list of assignments for the specific department
            await queryClient.invalidateQueries({
                queryKey: depModuleAssKeys.listByDep(variables.depId),
            });

            // Usually no need to set detail cache for a single assignment, list invalidation is enough.
            console.log(
                `wE9rTyU3 - Module assignment created successfully for Dep ${variables.depId}, Module ${variables.moduleId}. Invalidated assignment list.`,
            );
            toast.success("Module assigned successfully!");
        },

        onError: (error, variables) => {
            console.error(
                `zX7cVbN1 - Error creating assignment for Dep ${variables.depId}, Module ${variables.moduleId}:`,
                error,
            );
            // Handle duplicate assignment error specifically?
            if (error.message.includes("DUPLICATE_ASSIGNMENT")) {
                toast.error(
                    `Error(aQ1sWdE4): This module is already assigned to this department.`,
                );
            } else {
                toast.error(
                    `Error(aQ1sWdE4): Failed to assign module: ${error.message}`,
                );
            }
        },
    });
}

/**
 * Hook for deleting (unassigning) a module from a department.
 */
export function useDeleteDepModuleAssignment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            id: string; // The ID of the assignment document itself
            depId: string; // Needed to invalidate the correct list
        }) => deleteDepModuleAssignment(variables.id),

        onSuccess: async (result, variables) => {
            console.log(
                `rT5yUiO8 - Deletion mutation succeeded for Assignment ${variables.id}.`,
            );

            // Invalidate the list of assignments for the specific department
            await queryClient.invalidateQueries({
                queryKey: depModuleAssKeys.listByDep(variables.depId),
            });
            console.log(
                `vB3n MjK7 - Invalidated assignment list cache for dep: ${variables.depId}`,
            );

            // Remove the specific assignment's detail cache entry (optional but good practice)
            queryClient.removeQueries({
                queryKey: depModuleAssKeys.detail(variables.id),
            });
            console.log(
                `n M1jKlP5 - Removed Assignment detail cache for ID: ${variables.id}`,
            );

            toast.success("Module unassigned successfully!");
        },

        onError: (error, variables) => {
            console.error(
                `pL9kMnB4 - Error deleting Assignment ${variables.id} for dep ${variables.depId}:`,
                error,
            );
            toast.error(
                `Error(gH7jKlP2): Failed to unassign module: ${error.message}`,
            );
        },
    });
}
