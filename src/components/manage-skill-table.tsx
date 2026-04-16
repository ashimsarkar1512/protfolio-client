"use client"
import React from "react";
import { Icon } from "@iconify/react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {TSkill} from "@/types/skill";
import {Button} from "@/components/ui/button";

import {delete_skill} from "@/server/skill";
import Swal from "sweetalert2";
import {toast} from "sonner";
import UpdateSkillDialog from "./updated-skill-dialog";


const ManageSkillTable = ({skills}:{skills:TSkill[]}) => {
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
                const res = await delete_skill(id)
                if(res.success){
                    await Swal.fire({
                        title: "Deleted!",
                        text: "Skill Deleted!",
                        icon: "success"
                    });
                }else{
                    toast.error(res.message)
                }
            }
        });
    }
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold text-slate-900">Manage Skills</h2>
                <p className="mt-1 text-sm text-slate-600">Keep your skill stack accurate and up to date.</p>
            </div>
            <div className="overflow-x-auto p-4 sm:p-6">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="w-[60px] whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Icon</TableHead>
                        <TableHead className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Name</TableHead>
                        <TableHead className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {skills.map((skill) => (
                        <TableRow key={skill._id} className="hover:bg-slate-50/80">
                            <TableCell className="px-4 py-3 text-slate-700">
                                <Icon icon={skill.icon} width={24} height={24} />
                            </TableCell>
                            <TableCell className="px-4 py-3 text-sm font-medium text-slate-900">{skill.name}</TableCell>
                            <TableCell className="flex items-center justify-end space-x-2 px-4 py-3 text-right">
                                <UpdateSkillDialog skill={skill} />
                                <Button onClick={()=>handleDelete(skill._id as string)} variant="destructive" size="sm">
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
};

export default ManageSkillTable;