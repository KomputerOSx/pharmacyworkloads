// // src/components/locations/HospLocColumns.tsx
// "use client";
//
// import React from "react";
// import {
//     ColumnDef,
//     Column,
//     Table,
//     Row,
//     CellContext,
// } from "@tanstack/react-table";
// import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
// import { Timestamp } from "firebase/firestore";
//
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//     DropdownMenu as ViewDropdownMenu,
//     DropdownMenuCheckboxItem as ViewDropdownMenuCheckboxItem,
//     DropdownMenuContent as ViewDropdownMenuContent,
//     DropdownMenuTrigger as ViewDropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MixerHorizontalIcon } from "@radix-ui/react-icons";
//
// import { Skeleton } from "../ui/skeleton";
// import { formatDate } from "@/lib/utils";
// import { HospLoc } from "@/types/subDepTypes";
// import { Badge } from "@/components/ui/badge";
//
// interface HospLocTableMeta {
//     openEditDialog: (location: HospLoc) => void;
//     openDeleteDialog: (location: HospLoc) => void;
//     hospitalNameMap: Map<string, string>;
//     isLoadingHospitalMap: boolean;
// }
//
// interface DataTableRowActionsProps {
//     row: Row<HospLoc>;
//     openEditDialog: (location: HospLoc) => void; // Function to trigger edit dialog
//     openDeleteDialog: (location: HospLoc) => void; // Function to trigger delete dialog
// }
//
// // --- Reusable Header Component for Sorting ---
// const SortableHeader = ({
//     column,
//     title,
// }: {
//     column: Column<HospLoc, unknown>;
//     title: string;
// }) => (
//     <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//         className="-ml-4 h-8 data-[state=open]:bg-accent"
//     >
//         <span>{title}</span>
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//     </Button>
// );
//
// // --- Action Buttons Component for Each Row ---
// // Renders the dropdown menu with Edit and Delete actions.
// // *** CORRECTED: Receives handlers via props, does NOT use row.getContext() ***
// const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
//     row,
//     openEditDialog, // Receive the function as a prop
//     openDeleteDialog, // Receive the function as a prop
// }) => {
//     const location = row.original; // Get the data for the specific row
//
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
//                 >
//                     <MoreHorizontal className="h-4 w-4" />
//                     <span className="sr-only">Open menu</span>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[160px]">
//                 <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                 <DropdownMenuItem
//                     // *** CORRECTED: Call the handler passed via props ***
//                     onClick={() => openEditDialog(location)}
//                     className="cursor-pointer"
//                 >
//                     <Pencil className="mr-2 h-4 w-4" />
//                     Edit
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                     // *** CORRECTED: Call the handler passed via props ***
//                     onClick={() => openDeleteDialog(location)}
//                     className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
//                 >
//                     <Trash className="mr-2 h-4 w-4" />
//                     Delete
//                 </DropdownMenuItem>
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };
//
// // --- Column Definitions Array ---
// export const columns: ColumnDef<HospLoc>[] = [
//     // 1. Select Column (Checkbox)
//     {
//         id: "select",
//         header: ({ table }) => (
//             <Checkbox
//                 checked={
//                     table.getIsAllPageRowsSelected()
//                         ? true
//                         : table.getIsSomePageRowsSelected()
//                           ? "indeterminate"
//                           : false
//                 }
//                 onCheckedChange={(value) =>
//                     table.toggleAllPageRowsSelected(!!value)
//                 }
//                 aria-label="Select all rows on this page"
//                 className="translate-y-[2px]"
//             />
//         ),
//         cell: ({ row }) => (
//             <Checkbox
//                 checked={row.getIsSelected()}
//                 onCheckedChange={(value) => row.toggleSelected(!!value)}
//                 aria-label="Select this row"
//                 className="translate-y-[2px]"
//             />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//         size: 50,
//     },
//
//     // 2. Name Column
//     {
//         accessorKey: "name",
//         header: ({ column }) => <SortableHeader column={column} title="Name" />,
//         cell: ({ row }) => (
//             <div className="font-medium capitalize">{row.getValue("name")}</div>
//         ),
//         filterFn: "includesString",
//         enableSorting: true,
//         enableHiding: true,
//     },
//
//     // 3. Hospital Column (Using hospId)
//     {
//         accessorKey: "hospId",
//         header: ({ column }) => (
//             <SortableHeader column={column} title="Hospital" />
//         ),
//         // Cell renderer still uses the map from meta to DISPLAY the name
//         cell: ({ row, table }: CellContext<HospLoc, unknown>) => {
//             const hospId = row.getValue("hospId") as string;
//             const meta = table.options.meta as HospLocTableMeta;
//             const hospitalNameMap = meta.hospitalNameMap;
//             const isLoading = meta.isLoadingHospitalMap;
//
//             if (isLoading) {
//                 return <Skeleton className="h-5 w-24" />;
//             }
//             const hospName = hospitalNameMap.get(hospId);
//             return (
//                 <div className="">
//                     {hospName ?? (
//                         <span className="text-muted-foreground">N/A</span>
//                     )}
//                 </div>
//             );
//         },
//         enableSorting: true,
//         enableHiding: true,
//     },
//
//     // 4. Type Column
//     {
//         accessorKey: "type",
//         header: ({ column }) => <SortableHeader column={column} title="Type" />,
//         cell: ({ row }) => <div>{row.getValue("type")}</div>,
//         filterFn: "equalsString", // Use 'equalsString' for exact match if filtering by select dropdown
//         enableSorting: true,
//         enableHiding: true,
//     },
//
//     // 5. Address Column
//     {
//         accessorKey: "address",
//         header: "Address",
//         cell: ({ row }) => (
//             <div className="whitespace-nowrap">
//                 {row.getValue("address") ?? "N/A"}
//             </div>
//         ),
//         enableSorting: false,
//         enableHiding: true,
//     },
//
//     // 6. Email Column
//     {
//         accessorKey: "contactEmail",
//         header: "Email",
//         cell: ({ row }) => <div>{row.getValue("contactEmail") ?? "N/A"}</div>,
//         enableSorting: false,
//         enableHiding: true,
//     },
//
//     // 7. Phone Column
//     {
//         accessorKey: "contactPhone",
//         header: "Phone",
//         cell: ({ row }) => <div>{row.getValue("contactPhone") ?? "N/A"}</div>,
//         enableSorting: false,
//         enableHiding: true,
//     },
//
//     // 8. Active Status Column
//     {
//         accessorKey: "active",
//         header: ({ column }) => (
//             <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() =>
//                     column.toggleSorting(column.getIsSorted() === "asc")
//                 }
//             >
//                 {" "}
//                 Status <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
//             </Button>
//         ),
//         cell: ({ row }) => {
//             const isActive = row.getValue("active");
//             return (
//                 <Badge
//                     variant={isActive ? "success" : "destructive"}
//                     className="text-xs"
//                 >
//                     {" "}
//                     {isActive ? "Active" : "Inactive"}{" "}
//                 </Badge>
//             );
//         },
//         filterFn: (row, columnId, filterValue) => {
//             const isActive = row.getValue(columnId);
//             const filterString = String(filterValue).toLowerCase();
//             if (filterString === "active") return isActive === true;
//             if (filterString === "inactive") return isActive === false;
//             return true;
//         },
//     },
//
//     // 9. Created At Column
//     {
//         accessorKey: "createdAt",
//         header: ({ column }) => (
//             <SortableHeader column={column} title="Created At" />
//         ),
//         cell: ({ row }) => {
//             const dateVal = row.getValue("createdAt") as
//                 | Timestamp
//                 | Date
//                 | string
//                 | null
//                 | undefined;
//             return (
//                 <div className="whitespace-nowrap text-sm text-muted-foreground">
//                     {formatDate(dateVal)}
//                 </div>
//             );
//         },
//         enableSorting: true,
//         enableHiding: true,
//         sortDescFirst: true, // Default sort newest first
//     },
//
//     // 10. Updated At Column
//     {
//         accessorKey: "updatedAt",
//         header: ({ column }) => (
//             <SortableHeader column={column} title="Updated At" />
//         ),
//         cell: ({ row }) => {
//             const dateVal = row.getValue("updatedAt") as
//                 | Timestamp
//                 | Date
//                 | string
//                 | null
//                 | undefined;
//             return (
//                 <div className="whitespace-nowrap text-sm text-muted-foreground">
//                     {formatDate(dateVal)}
//                 </div>
//             );
//         },
//         enableSorting: true,
//         enableHiding: true,
//     },
//
//     // 11. Actions Column
//     // *** CORRECTED IMPLEMENTATION ***
//     {
//         id: "actions",
//         header: () => <div className="text-right pr-4">Actions</div>, // Align header text
//         // *** Use CellContext to access row and table ***
//         cell: ({ row, table }: CellContext<HospLoc, unknown>) => {
//             // *** Access meta safely via 'table' from CellContext ***
//             const meta = table.options.meta as HospLocTableMeta; // Type assertion
//
//             // *** Render the Actions component, passing handlers from meta as props ***
//             return (
//                 <div className="text-right">
//                     {" "}
//                     {/* Align dropdown trigger to the right */}
//                     <DataTableRowActions
//                         row={row}
//                         openEditDialog={meta.openEditDialog}
//                         openDeleteDialog={meta.openDeleteDialog}
//                     />
//                 </div>
//             );
//         },
//         enableSorting: false,
//         enableHiding: false, // Actions usually always visible
//         size: 80, // Fixed size for the actions column
//     },
// ];
//
// // --- Component for Column Visibility Toggle ---
// // Allows users to show/hide columns
// export function DataTableViewOptions<TData>({
//     table,
// }: {
//     table: Table<TData>;
// }) {
//     return (
//         <ViewDropdownMenu>
//             <ViewDropdownMenuTrigger asChild>
//                 <Button
//                     variant="outline"
//                     size="sm"
//                     className="ml-auto hidden h-9 lg:flex" // Match height and hide on smaller screens
//                 >
//                     <MixerHorizontalIcon className="mr-2 h-4 w-4" />
//                     View
//                 </Button>
//             </ViewDropdownMenuTrigger>
//             <ViewDropdownMenuContent align="end" className="w-[150px]">
//                 <div className="px-1 py-1 text-sm font-medium text-muted-foreground">
//                     Toggle Columns
//                 </div>
//                 <DropdownMenuSeparator />
//                 {table
//                     .getAllColumns()
//                     // Filter out columns that shouldn't be toggleable (e.g., 'select', 'actions')
//                     // or columns explicitly marked as enableHiding: false
//                     .filter(
//                         (column) =>
//                             typeof column.accessorFn !== "undefined" && // Ensure it's a data column
//                             column.getCanHide(), // Respect getCanHide property set in definition
//                     )
//                     .map((column) => {
//                         // Attempt to get a readable header name, fall back to id
//                         const headerText =
//                             typeof column.columnDef.header === "string"
//                                 ? column.columnDef.header
//                                 : column.id.charAt(0).toUpperCase() +
//                                   column.id.slice(1); // Capitalize ID as fallback
//
//                         return (
//                             <ViewDropdownMenuCheckboxItem
//                                 key={column.id}
//                                 className="capitalize"
//                                 checked={column.getIsVisible()}
//                                 onCheckedChange={
//                                     (value) => column.toggleVisibility(value) // Ensure boolean value
//                                 }
//                                 onSelect={(event) => {
//                                     event.preventDefault(); // Prevent the menu from closing
//                                 }}
//                             >
//                                 {headerText}
//                             </ViewDropdownMenuCheckboxItem>
//                         );
//                     })}
//             </ViewDropdownMenuContent>
//         </ViewDropdownMenu>
//     );
// }

// src/components/locations/HospLocColumns.tsx
"use client";

import React from "react";
import {
    ColumnDef,
    Column,
    Table,
    Row,
    CellContext,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    DropdownMenu as ViewDropdownMenu,
    DropdownMenuCheckboxItem as ViewDropdownMenuCheckboxItem,
    DropdownMenuContent as ViewDropdownMenuContent,
    DropdownMenuTrigger as ViewDropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

import { Skeleton } from "../ui/skeleton";
import { formatDate } from "@/lib/utils";
import { HospLoc } from "@/types/subDepTypes"; // Import color utils
import { Badge } from "@/components/ui/badge";
import { getColorObjectWithDefault } from "@/lib/helper/hospLoc/hospLocColors";

interface HospLocTableMeta {
    openEditDialog: (location: HospLoc) => void;
    openDeleteDialog: (location: HospLoc) => void;
    hospitalNameMap: Map<string, string>;
    isLoadingHospitalMap: boolean;
}

interface DataTableRowActionsProps {
    row: Row<HospLoc>;
    openEditDialog: (location: HospLoc) => void;
    openDeleteDialog: (location: HospLoc) => void;
}

const SortableHeader = ({
    column,
    title,
}: {
    column: Column<HospLoc, unknown>;
    title: string;
}) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4 h-8 data-[state=open]:bg-accent"
    >
        <span>{title}</span>
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

const DataTableRowActions: React.FC<DataTableRowActionsProps> = ({
    row,
    openEditDialog,
    openDeleteDialog,
}) => {
    const location = row.original;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() => openEditDialog(location)}
                    className="cursor-pointer"
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => openDeleteDialog(location)}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/50"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<HospLoc>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected()
                        ? true
                        : table.getIsSomePageRowsSelected()
                          ? "indeterminate"
                          : false
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all rows on this page"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select this row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
    },
    {
        accessorKey: "name",
        header: ({ column }) => <SortableHeader column={column} title="Name" />,
        cell: ({ row }) => (
            <div className="font-medium capitalize">{row.getValue("name")}</div>
        ),
        filterFn: "includesString",
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "hospId",
        header: ({ column }) => (
            <SortableHeader column={column} title="Hospital" />
        ),
        cell: ({ row, table }: CellContext<HospLoc, unknown>) => {
            const hospId = row.getValue("hospId") as string;
            const meta = table.options.meta as HospLocTableMeta;
            const hospitalNameMap = meta.hospitalNameMap;
            const isLoading = meta.isLoadingHospitalMap;

            if (isLoading) {
                return <Skeleton className="h-5 w-24" />;
            }
            const hospName = hospitalNameMap.get(hospId);
            return (
                <div className="">
                    {hospName ?? (
                        <span className="text-muted-foreground">N/A</span>
                    )}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "type",
        header: ({ column }) => <SortableHeader column={column} title="Type" />,
        cell: ({ row }) => <div>{row.getValue("type")}</div>,
        filterFn: "equalsString",
        enableSorting: true,
        enableHiding: true,
    },
    // --- Color Column ---
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            const colorId = (row.getValue("color") as string) || "gray";
            const colorObj = getColorObjectWithDefault(colorId);
            const swatchBackgroundClass = `${colorObj.colorClasses.swatchBg} ${colorObj.colorClasses.darkSwatchBg ?? ""}`;
            return (
                <div className="flex items-center gap-2">
                    <div
                        className={`h-3 w-3 rounded-full ${swatchBackgroundClass} border border-gray-300 dark:border-gray-600`}
                        title={colorObj?.name ?? colorId}
                    />
                    <span className="capitalize hidden md:inline">
                        {colorObj?.name ?? colorId}
                    </span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: true,
        size: 100,
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
            <div className="whitespace-nowrap">
                {row.getValue("address") ?? "N/A"}
            </div>
        ),
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "contactEmail",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("contactEmail") ?? "N/A"}</div>,
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "contactPhone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("contactPhone") ?? "N/A"}</div>,
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "active",
        header: ({ column }) => (
            <SortableHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
            const isActive = row.getValue("active");
            return (
                <Badge
                    variant={isActive ? "success" : "destructive"}
                    className="text-xs"
                >
                    {isActive ? "Active" : "Inactive"}
                </Badge>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const isActive = row.getValue(columnId);
            const filterString = String(filterValue).toLowerCase();
            if (filterString === "active") return isActive === true;
            if (filterString === "inactive") return isActive === false;
            return true;
        },
        enableSorting: true,
        enableHiding: true,
        size: 100,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <SortableHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => {
            const dateVal = row.getValue("createdAt") as
                | Timestamp
                | Date
                | string
                | null
                | undefined;
            return (
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(dateVal)}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
        sortDescFirst: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <SortableHeader column={column} title="Updated At" />
        ),
        cell: ({ row }) => {
            const dateVal = row.getValue("updatedAt") as
                | Timestamp
                | Date
                | string
                | null
                | undefined;
            return (
                <div className="whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(dateVal)}
                </div>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "actions",
        header: () => <div className="text-right pr-4">Actions</div>,
        cell: ({ row, table }: CellContext<HospLoc, unknown>) => {
            const meta = table.options.meta as HospLocTableMeta;
            return (
                <div className="text-right">
                    <DataTableRowActions
                        row={row}
                        openEditDialog={meta.openEditDialog}
                        openDeleteDialog={meta.openDeleteDialog}
                    />
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        size: 80,
    },
];

export function DataTableViewOptions<TData>({
    table,
}: {
    table: Table<TData>;
}) {
    return (
        <ViewDropdownMenu>
            <ViewDropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-9 lg:flex"
                >
                    <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                    View
                </Button>
            </ViewDropdownMenuTrigger>
            <ViewDropdownMenuContent align="end" className="w-[150px]">
                <div className="px-1 py-1 text-sm font-medium text-muted-foreground">
                    Toggle Columns
                </div>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" &&
                            column.getCanHide(),
                    )
                    .map((column) => {
                        const headerText =
                            typeof column.columnDef.header === "string"
                                ? column.columnDef.header
                                : column.id.charAt(0).toUpperCase() +
                                  column.id.slice(1);

                        return (
                            <ViewDropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) =>
                                    column.toggleVisibility(value)
                                }
                                onSelect={(event) => {
                                    event.preventDefault();
                                }}
                            >
                                {headerText}
                            </ViewDropdownMenuCheckboxItem>
                        );
                    })}
            </ViewDropdownMenuContent>
        </ViewDropdownMenu>
    );
}
