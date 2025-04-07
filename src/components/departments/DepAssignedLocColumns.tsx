// src/components/departments/DepAssignedLocColumns.tsx
"use client";

import React from "react";
import { ColumnDef, Column, Row, CellContext } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// Project Specific Imports
import { AssignedLocationData } from "@/types/depTypes"; // Use the processed data type
import { formatDate } from "@/utils/utils"; // Assuming you have this utility

// --- Table Meta Interface ---
interface DepAssignedLocTableMeta {
    // Pass the assignmentId to the delete handler
    openDeleteDialog: (
        assignmentId: string,
        locationName: string | null,
    ) => void;
    isLoadingLocations: boolean; // To show skeleton for location name
}

// --- Action Row Component Props ---
interface DataTableRowActionsProps {
    row: Row<AssignedLocationData>;
    openDeleteDialog: (
        assignmentId: string,
        locationName: string | null,
    ) => void; // Accept the function
}

// --- Reusable Header Component for Sorting ---
const SortableHeader = ({
    column,
    title,
}: {
    column: Column<AssignedLocationData, unknown>;
    title: string;
}) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent" // Standard shadcn table header button style
    >
        <span>{title}</span>
        {column.getCanSort() && ( // Only show arrow if sortable
            <ArrowUpDown className="ml-2 h-4 w-4" />
        )}
    </Button>
);

// --- Action Buttons Component for Each Row ---
const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
    row,
    openDeleteDialog, // Use the prop
}) => {
    const assignment = row.original;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* ... trigger button ... */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    // Call the function passed via props
                    onClick={() =>
                        openDeleteDialog(
                            assignment.assignmentId,
                            assignment.locationName,
                        )
                    }
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Assignment
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// --- Column Definitions Array ---
export const columns: ColumnDef<AssignedLocationData>[] = [
    // 1. Location Name Column
    {
        accessorKey: "locationName",
        header: ({ column }) => (
            <SortableHeader column={column} title="Location" />
        ),
        cell: ({ row, table }: CellContext<AssignedLocationData, unknown>) => {
            const locationName = row.getValue("locationName") as string | null;
            const meta = table.options.meta as DepAssignedLocTableMeta;

            if (meta.isLoadingLocations && locationName === null) {
                // Show skeleton only if locations are loading AND name is not yet available
                return <Skeleton className="h-5 w-32" />;
            }

            return (
                <div className="font-medium">
                    {locationName ?? (
                        <span className="text-muted-foreground italic">
                            Unknown Location
                        </span>
                    )}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },

    // 2. Assigned At Column
    {
        accessorKey: "assignedAt", // Use the processed 'assignedAt' field
        header: ({ column }) => (
            <SortableHeader column={column} title="Assigned On" />
        ),
        cell: ({ row }) => {
            const dateVal = row.getValue("assignedAt") as Date | null;
            return (
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(dateVal)} {/* Use your formatDate utility */}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
        sortDescFirst: true, // Default sort newest first
    },

    // 3. Actions Column
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Actions</div>,
        // Use CellContext here to get 'table' and 'row'
        cell: ({ row, table }: CellContext<AssignedLocationData, unknown>) => {
            // Access meta information via the 'table' instance from context
            const meta = table.options.meta as DepAssignedLocTableMeta;

            // Render the custom component, passing required props
            return (
                <div className="text-right">
                    {" "}
                    {/* Optional: Keep alignment */}
                    <DataTableRowActions
                        row={row}
                        openDeleteDialog={meta.openDeleteDialog} // Pass the function down
                    />
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 80,
    },
];

// --- (Optional) Column Visibility Toggle ---
// You can reuse the DataTableViewOptions component from your HospLoc example
// just ensure it receives the correct table instance.
// If you don't need it, you can omit it.
// export { DataTableViewOptions } from "@/components/locations/HospLocColumns"; // Example re-export
