"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TBlog } from "@/types/blog";
import React from "react";
import Image from "next/image";

import Swal from "sweetalert2";
import {toast} from "sonner";
import {delete_blog} from "@/server/blog";
import { BlogUpdateDialog } from "./blog-updated-dialog";
type ManageBlogsTableProps = {
    blogs: TBlog[];
};

function formatLocalTime(isoString: string) {
    const date = new Date(isoString);
    return date.toLocaleString(); // You can customize this format
}

export default function ManageBlogsTable({blogs}: ManageBlogsTableProps) {

    const handleDelete =async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await delete_blog(id)
                if(res.success){
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Blog Deleted!",
                        icon: "success"
                    });
                }else{
                    toast.error(res.message)
                }
            }
        });
    }

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="mb-0 border-b border-slate-200 bg-slate-50 p-4 text-center sm:p-6">
                <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">All Blogs</h1>
                <p className="mt-1 text-sm text-slate-600">Manage blog content and keep your knowledge section updated.</p>
            </div>
            <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Blog</TableHead>
                        <TableHead className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Tags</TableHead>
                        <TableHead className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Created At</TableHead>
                        <TableHead className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {blogs.map((blog) => (
                        <TableRow key={blog._id} className="hover:bg-slate-50/80">
                            <TableCell className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    {blog.blogImage ? (
                                        <Image
                                            width={800}
                                            height={800}
                                            src={blog.blogImage}
                                            alt="Blog"
                                            className="h-10 w-10 rounded object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-200 text-center text-sm text-slate-600">
                                            N/A
                                        </div>
                                    )}
                                    <span className="font-medium text-slate-900">{blog.title}</span>
                                </div>
                            </TableCell>
                            <TableCell className="max-w-[260px] px-4 py-3 text-sm text-slate-700">{blog.blogTags.join(", ")}</TableCell>
                            <TableCell className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                {blog.createdAt ? formatLocalTime(blog.createdAt) : "N/A"}
                            </TableCell>
                            <TableCell className="space-x-2 whitespace-nowrap px-4 py-3 text-right">
                                <BlogUpdateDialog data={blog}/>
                                <Button onClick={()=>handleDelete(blog?._id as string)} variant="destructive" >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}