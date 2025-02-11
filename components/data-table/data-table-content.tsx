import { DataTableContentProps } from "./types"
import Loading from "@/components/ui/loading"
import {
    flexRender,
} from "@tanstack/react-table"
import { Table, TableCell, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";


export const DataTableContent = <TData,>(props: DataTableContentProps<TData>) => {
    const { loading, table, columns } = props;
    return (
        <div className="rounded-md border relative">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length && !loading ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="hover:bg-muted/50 data-[state=selected]:bg-muted"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            !loading ?
                                (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className=" h-32  text-center"
                                        >
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                ) : (

                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className=" h-32  text-center relative "
                                            >
                                            <Loading />
                                        </TableCell>
                                    </TableRow>
                                )
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default DataTableContent;