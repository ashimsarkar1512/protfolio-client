"use server"

import {TSkill} from "@/types/skill";
import {cookies} from "next/headers";
import {revalidateTag} from "next/cache";
import {getServerUrl} from "@/lib/server-url";

const server_url = getServerUrl();

export const add_skill = async (payload:TSkill) => {
    const token =(await cookies()).get("accessToken")?.value;
    const res = await fetch(`${server_url}/skill`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token!
        },
        body: JSON.stringify(payload),
    })
    revalidateTag("skills")
    return await res.json()
}


export const get_skill = async () => {
    const res = await fetch(`${server_url}/skill`, {
        method: "GET",
        next: {
            tags: ['skills'],
        },
    })
    return await res.json()
}

export const update_skill = async (id:string,payload:Partial<TSkill>) => {
    const token =(await cookies()).get("accessToken")?.value;
    const res = await fetch(`${server_url}/skill/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token!
        },
        body: JSON.stringify(payload),
    })
    revalidateTag("skills")
    return await res.json()
}
export const delete_skill = async (id:string) => {
    const token =(await cookies()).get("accessToken")?.value;
    const res = await fetch(`${server_url}/skill/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token!
        }
    })
    revalidateTag("skills")
    return await res.json()
}
