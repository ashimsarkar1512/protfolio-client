"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrashIcon } from "@radix-ui/react-icons";
import { TProject } from "@/types/project";
import React from "react";
import Image from "next/image";

import Swal from "sweetalert2";
import { delete_project } from "@/server/project";
import { toast } from "sonner";
import { ProjectUpdateDialog } from "./project-updated-dialog";
type Props = {
  data: TProject[];
};

export function Manage_Project_Table({ data }: Props) {
  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await delete_project(id);
        if (res.success) {
          await Swal.fire({
            title: "Deleted!",
            text: "Project Deleted!",
            icon: "success",
          });
        } else {
          toast.error(res.message);
        }
      }
    });
  };

  const columns: ColumnDef<TProject>[] = [
    {
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.original.projectImage!}
          width={800}
          height={800}
          alt="Project"
          className="w-16 h-10 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "projectName",
      header: "Project Name",
    },
    {
      accessorKey: "slogan",
      header: "Slogan",
    },
    {
      accessorKey: "liveLink",
      header: "Live Link",
      cell: ({ row }) => (
        <a
          href={row.original.liveLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Visit
        </a>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <ProjectUpdateDialog data={row.original} />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDelete(row.original?._id as string)}
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 p-4 text-center sm:p-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">All Projects</h1>
        <p className="mt-1 text-sm text-slate-600">Review, edit, or remove projects from your portfolio.</p>
      </div>
      <div className="overflow-x-auto">
      <Table>
        <TableHeader className={"bg-slate-50"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-slate-50/80">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-4 py-3 align-middle text-sm text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
