// src/components/departments/DepAssignedLocTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel, // Keep if you might add filtering later
    SortingState,
    ColumnFiltersState, // Keep if you might add filtering later
    flexRender,
    TableMeta,
} from "@tanstack/react-table";

// Shadcn UI Components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Keep if adding search
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Project Imports
import { AssignedLocationData } from "@/types/depTypes"; // Use the processed data type
import { columns } from "./DepAssignedLocColumns"; // Import columns for this table
// Optional: Import DataTableViewOptions if you use it
// import { DataTableViewOptions } from "./DepAssignedLocColumns";

// --- Component Props Interface ---
interface DepAssignedLocTableProps {
    assignments: AssignedLocationData[];
    onDeleteRequest: (
        assignmentId: string,
        locationName: string | null,
    ) => void;
    isLoadingLocations: boolean; // Pass loading state for location names
    // Add other props like isLoadingAssignments if needed for internal states
}

// --- Table Meta Interface --- (Should match the one in Columns)
interface DepAssignedLocTableMeta extends TableMeta<AssignedLocationData> {
    openDeleteDialog: (
        assignmentId: string,
        locationName: string | null,
    ) => void;
    isLoadingLocations: boolean;
}

export function DepAssignedLocTable({
    assignments,
    onDeleteRequest,
    isLoadingLocations,
}: DepAssignedLocTableProps) {
    // Memoize data
    const data = useMemo(() => assignments ?? [], [assignments]);

    // --- TanStack Table State ---
    const [sorting, setSorting] = useState<SortingState>(() => [
        { id: "assignedAt", desc: true }, // Default sort by assigned date
    ]);
    // Add filtering state if needed
    // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    // --- Initialize TanStack Table ---
    const table = useReactTable({
        data,
        columns,
        // State Management
        state: {
            sorting,
            // columnFilters, // Add if filtering
        },
        // State Updaters
        onSortingChange: setSorting,
        // onColumnFiltersChange: setColumnFilters, // Add if filtering
        // Pipeline
        getCoreRowModel: getCoreRowModel(),
        // getFilteredRowModel: getFilteredRowModel(), // Add if filtering
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // Default page size
        initialState: {
            pagination: {
                pageSize: 10, // Adjust as needed
            },
        },
        // Pass meta data/functions to columns
        meta: {
            openDeleteDialog: onDeleteRequest,
            isLoadingLocations: isLoadingLocations,
        } as DepAssignedLocTableMeta, // Cast to ensure type safety
    });

    return (
        <div className="w-full space-y-4">
            {/* --- Toolbar (Optional: Add Search/Filters later if needed) --- */}
            {/*
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter locations..."
                    // Add filter logic here if needed
                    className="max-w-sm h-9"
                />
                 <DataTableViewOptions table={table} /> // Add if using View Options
            </div>
            */}

            {/* --- The Data Table --- */}
            <div className="rounded-md border">
                <ScrollArea className="w-full whitespace-nowrap">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            style={{
                                                width:
                                                    header.getSize() !== 150
                                                        ? header.getSize()
                                                        : undefined,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.original.assignmentId} // Use assignmentId for key
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{
                                                    width:
                                                        cell.column.getSize() !==
                                                        150
                                                            ? cell.column.getSize()
                                                            : undefined,
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length} // Use columns length
                                        className="h-24 text-center"
                                    >
                                        No locations assigned yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            {/* --- Pagination Controls --- */}
            <div className="flex flex-col gap-4 sm:flex-row items-center justify-between py-4">
                {/* Placeholder for Row Selection Count if needed */}
                <div className="text-sm text-muted-foreground order-last sm:order-first">
                    {/* Add selection count logic if row selection is enabled */}
                    Total Assignments: {table.getFilteredRowModel().rows.length}
                </div>

                {/* Pagination Controls Group */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 order-first sm:order-last">
                    {/* Page Size Selector */}
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Rows:</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Page Number Display */}
                    <div className="flex items-center justify-center text-sm font-medium px-2">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                    </div>

                    {/* Prev/Next Buttons */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
