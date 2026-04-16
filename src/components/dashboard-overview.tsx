"use client";


import {FaBlogger, FaComments} from "react-icons/fa";
import {GoProjectRoadmap} from "react-icons/go";
import {GiSkills} from "react-icons/gi";
import { ViewMessageDialog } from "./view-updated-message";


interface DashboardData {
    project: {
        totalProject: number;
        activeProject: number;
        deleteProject: number;
    };
    blog: {
        totalBlog: number;
        activeBlog: number;
        deleteBlog: number;
    };
    skill: {
        totalSkill: number;
        activeSkill: number;
        deleteSkill: number;
    };
    message: {
        totalMessage: number;
        newMessage: number;
        oldMessage: number;
        message: Message[];
    };
}

export interface Message {
    _id: string;
    messageBody: string;
    messageTitle: string;
    senderEmail: string;
    senderName: string;
    isReded: boolean;
    createdAt: string; // ISO 8601 string
    updatedAt: string; // ISO 8601 string
    __v: number;
}


function DashboardOverview({data}: { data: DashboardData }) {
    const cards = [
        {
            label: "Projects",
            total: data?.project?.totalProject,
            active: data?.project?.activeProject,
            archived: data?.project?.deleteProject,
            icon: <GoProjectRoadmap className="text-xl text-green-600" />,
            iconBg: "bg-green-100",
        },
        {
            label: "Blogs",
            total: data?.blog?.totalBlog,
            active: data?.blog?.activeBlog,
            archived: data?.blog?.deleteBlog,
            icon: <FaBlogger className="text-xl text-purple-500" />,
            iconBg: "bg-purple-100",
        },
        {
            label: "Skills",
            total: data?.skill?.totalSkill,
            active: data?.skill?.activeSkill,
            archived: data?.skill?.deleteSkill,
            icon: <GiSkills className="text-xl text-amber-600" />,
            iconBg: "bg-amber-100",
        },
        {
            label: "Messages",
            total: data?.message?.totalMessage,
            active: data?.message?.newMessage,
            archived: data?.message?.oldMessage,
            icon: <FaComments className="text-xl text-blue-600" />,
            iconBg: "bg-blue-100",
        },
    ];

    return (
        <div className="px-3 py-4 sm:px-6 sm:py-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Portfolio Command Center</h1>
                    <p className="mt-1 text-sm text-slate-600 sm:text-base">Track content performance, monitor inbox activity, and keep your portfolio polished.</p>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.label} className="rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{card.total || 0}</h3>
                                </div>
                                <div className={`flex h-11 w-11 items-center justify-center rounded-full ${card.iconBg}`}>
                                    {card.icon}
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-md bg-slate-50 px-3 py-2">
                                    <p className="text-slate-500">Active</p>
                                    <p className="font-semibold text-emerald-600">{card.active || 0}</p>
                                </div>
                                <div className="rounded-md bg-slate-50 px-3 py-2">
                                    <p className="text-slate-500">{card.label === "Messages" ? "Read" : "Deleted"}</p>
                                    <p className="font-semibold text-rose-600">{card.archived || 0}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-8 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-lg shadow-slate-200/60 backdrop-blur sm:p-6">
                    <h2 className="mb-4 text-lg font-semibold text-slate-900 sm:mb-6 sm:text-xl">Recent Messages</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Sending Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Subject
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Sender Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Sender Email
                                </th><th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 sm:px-6">
                                    Action
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                            {data?.message?.message.map((message) => (
                                <tr key={message._id} className={`${!message?.isReded ? "bg-indigo-50/70" : ""}`}>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-900 sm:px-6">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                                        {message.messageTitle?.slice(0, 30)}...
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-900 sm:px-6">
                                        {message.senderName}
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                                        {message.senderEmail}
                                    </td>
                                    <td className={`${message?.isReded? "text-emerald-600":"text-rose-600"} whitespace-nowrap px-4 py-4 text-sm font-medium sm:px-6`}>
                                        {message?.isReded? "Resolved" : "Unread"}
                                    </td>
                                    <td className="px-4 py-4 sm:px-6">
                                        <ViewMessageDialog message={message} />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DashboardOverview;