// src/components/users/UserDataTable.tsx
"use client";

import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    FilterFn,
    // Removed unused GlobalFilterTableState, getFaceted*
} from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
// Import Select components
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Department } from "@/types/depTypes";
import { User } from "@/types/userTypes";
import { columns as defaultColumns } from "./UserTableColumns"; // Adjust path if needed

interface UserDataTableProps {
    users: User[];
    departments: Department[]; // Needed for the filter dropdown
    departmentNameMap: Map<string, string>;
    isLoadingDepartmentMap: boolean;
    onEditRequest: (user: User) => void;
    onDeleteRequest: (user: User) => void;
}

// *** UPDATED Global Filter: Name Only ***
const globalUserNameFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
    const searchTerm = String(filterValue).toLowerCase();
    if (!searchTerm) return true;

    const user = row.original;
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return fullName.includes(searchTerm); // Only check name
};

export function UserDataTable({
    users,
    departments,
    departmentNameMap,
    isLoadingDepartmentMap,
    onEditRequest,
    onDeleteRequest,
}: UserDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]); // Still used for Department filter
    const [globalFilter, setGlobalFilter] = React.useState(""); // For name search
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({
            firstName: false,
            lastName: false,
            phoneNumber: false,
            jobTitle: false,
            specialty: false,
            lastLogin: false,
        });
    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo(() => defaultColumns, []);

    const table = useReactTable({
        data: users,
        columns,
        state: {
            sorting,
            columnFilters, // Include columnFilters state
            columnVisibility,
            rowSelection,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters, // Keep handler for department filter
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter, // Handler for name search input
        globalFilterFn: globalUserNameFilterFn, // Use the name-only filter
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(), // Handles both global and column filters
        meta: {
            departmentNameMap,
            isLoadingDepartmentMap,
            onEditRequest,
            onDeleteRequest,
        },
    });

    // Helper to get current department filter value
    const currentDepartmentFilter =
        (table.getColumn("departmentId")?.getFilterValue() as string) ?? "";

    return (
        <div className="w-full">
            {/* --- Toolbar: Filters & View Options --- */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center py-4 gap-4">
                {" "}
                {/* Added flex-wrap */}
                {/* Global Name Search Input */}
                <Input
                    placeholder="Search name..." // Updated placeholder
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-xs" // Adjusted width potentially
                />
                {/* *** NEW: Department Filter Select *** */}
                <Select
                    value={currentDepartmentFilter} // Bind value to table state
                    onValueChange={(value) => {
                        // Set filter to undefined or '' when "All" is selected
                        const filterVal = value === "all" ? undefined : value;
                        table
                            .getColumn("departmentId")
                            ?.setFilterValue(filterVal);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        {" "}
                        {/* Responsive width */}
                        <SelectValue placeholder="Filter by Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {departments.map((dep) => (
                            <SelectItem key={dep.id} value={dep.id}>
                                {dep.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {/* View Options Dropdown (Keep as is) */}
                <div className="ml-auto flex items-center gap-2">
                    {" "}
                    {/* Group button to the right */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />{" "}
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    const header = column.columnDef.header;
                                    let displayName = column.id;
                                    if (typeof header === "string") {
                                        displayName = header;
                                    } else if (column.id === "fullName") {
                                        displayName = "Name";
                                    } else if (column.id === "email") {
                                        displayName = "Email";
                                    } else if (column.id === "departmentId") {
                                        displayName = "Department";
                                    }
                                    // Add more friendly names if needed
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {displayName}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* --- Table --- (No changes needed) */}
            <div className="rounded-md border">
                <Table>
                    {/* ... TableHeader ... */}
                    {/* ... TableBody ... */}
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* --- Pagination --- (No changes needed) */}
            <div className="flex items-center justify-between space-x-2 py-4">
                {/* ... Selected Row Count ... */}
                {/* ... Pagination Controls ... */}
                <div className="flex-1 text-sm text-muted-foreground">
                    {" "}
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s)
                    selected.{" "}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        {" "}
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}{" "}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {" "}
                            <span className="sr-only">
                                Go to first page
                            </span>{" "}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8.354 1.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708l6 6a.5.5 0 0 0 .708-.708L2.707 8l5.647-5.646a.5.5 0 0 0 0-.708z" />
                                <path d="M12.354 1.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708l6 6a.5.5 0 0 0 .708-.708L6.707 8l5.647-5.646a.5.5 0 0 0 0-.708z" />
                            </svg>{" "}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            {" "}
                            Previous{" "}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            {" "}
                            Next{" "}
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            {" "}
                            <span className="sr-only">
                                Go to last page
                            </span>{" "}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z" />
                                <path d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z" />
                            </svg>{" "}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
