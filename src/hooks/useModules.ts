// src/hooks/useModules.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createModule,
    deleteModule,
    getModule,
    getAllModules,
    updateModule,
} from "@/services/modulesService";
import { Module } from "@/types/moduleTypes";
import { toast } from "sonner";

// --- Query Keys (Simplified) ---
const moduleKeys = {
    all: ["modules"] as const,
    lists: () => [...moduleKeys.all, "list"] as const,
    // listByOrg removed
    details: () => [...moduleKeys.all, "detail"] as const,
    detail: (id: string) => [...moduleKeys.details(), id] as const,
};

/**
 * Hook to fetch *all* global modules.
 */
export function useAllModules() {
    // Renamed from useModules
    return useQuery<Module[], Error>({
        queryKey: moduleKeys.lists(), // Use the simplified list key
        queryFn: getAllModules, // Use the updated service function
        // enabled removed (always enabled)
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });
}

/**
 * Hook to fetch details for a single module. (No change needed here)
 * @param id - The ID of the module (optional, query disabled if falsy).
 */
export function useModule(id?: string) {
    return useQuery<Module | null, Error>({
        queryKey: moduleKeys.detail(id!),
        queryFn: () => getModule(id!),
        enabled: !!id,
    });
}

/**
 * Hook for creating a new global module.
 */
export function useCreateModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            moduleData: Omit<
                Partial<Module>,
                "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy"
            >;
            // orgId REMOVED
            userId?: string;
        }) =>
            createModule(
                variables.moduleData,
                variables.userId, // orgId removed
            ),

        onSuccess: async (newlyCreatedModule) => {
            // Invalidate the global list of modules
            await queryClient.invalidateQueries({
                queryKey: moduleKeys.lists(), // Use simplified list key
            });

            if (newlyCreatedModule) {
                queryClient.setQueryData(
                    moduleKeys.detail(newlyCreatedModule.id),
                    newlyCreatedModule,
                );
                console.log(
                    `kL9dFgH2 - Pre-populated cache for new Module detail: ${newlyCreatedModule.id}`,
                );
            }

            console.log(
                `mN3bVcX1 - Module creation successful. Invalidated global Module list query.`, // Removed org context
            );
            toast.success("Module created successfully!");
        },

        onError: (error) => {
            console.error(
                `pQ7zXcV5 - Error creating Module:`, // Removed org context
                error,
            );
            toast.error(
                `Error(uY6tReW8): Failed to create Module: ${error.message}`,
            );
        },
    });
}

/**
 * Hook for updating an existing global module.
 */
export function useUpdateModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            id: string;
            // orgId REMOVED
            data: Omit<Partial<Module>, "id" | "createdAt" | "createdBy">;
            userId?: string;
        }) => updateModule(variables.id, variables.data, variables.userId),

        onSuccess: async (updatedModule, variables) => {
            // Invalidate the global list and the specific detail query
            await queryClient.invalidateQueries({
                queryKey: moduleKeys.lists(), // Use simplified list key
            });
            await queryClient.invalidateQueries({
                queryKey: moduleKeys.detail(variables.id),
            });

            if (updatedModule) {
                queryClient.setQueryData(
                    moduleKeys.detail(variables.id),
                    updatedModule,
                );
                console.log(
                    `aZ5kLmN7 - Cache updated directly for Module detail: ${variables.id}`,
                );
            } else {
                console.warn(
                    `sE1dRcV9 - Update mutation returned no data for Module ${variables.id}. Detail cache not updated directly. Relying on invalidation.`,
                );
            }

            console.log(
                `fG4hJkL1 - Module update successful for ID ${variables.id}. Invalidated global list and detail query.`, // Removed org context
            );
            toast.success("Module updated successfully!");
        },

        onError: (error, variables) => {
            console.error(
                `xY9pLmN3 - Error updating Module ${variables.id}:`,
                error,
            );
            toast.error(
                `Error(qW2eRtY5): Failed to update Module: ${error.message}`,
            );
        },
    });
}

/**
 * Hook for deleting a global module.
 */
export function useDeleteModule() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (variables: {
            id: string;
            // orgId REMOVED
        }) => deleteModule(variables.id),

        onSuccess: async (result, variables) => {
            console.log(
                `zX8cVbN5 - Deletion mutation succeeded for Module ${variables.id}.`,
            );

            // Invalidate the global list of modules
            await queryClient.invalidateQueries({
                queryKey: moduleKeys.lists(), // Use simplified list key
            });
            console.log(
                `bV6n MjK9 - Invalidated global Module list cache.`, // Removed org context
            );

            queryClient.removeQueries({
                queryKey: moduleKeys.detail(variables.id),
            });
            console.log(
                `dF3gHjL7 - Removed Module detail cache for ID: ${variables.id}`,
            );

            toast.success("Module deleted successfully!");
        },

        onError: (error, variables) => {
            console.error(
                `tY1uIopM - Error deleting Module ${variables.id}:`,
                error,
            );
            toast.error(
                `Error(vB5n MjK2): Failed to delete Module: ${error.message}`,
            );
        },
    });
}
