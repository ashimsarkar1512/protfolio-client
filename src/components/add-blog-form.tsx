"use client";
import React, {useState, useRef,} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {
    FaImage,
    FaCheck,
    FaTimes,
    FaArrowRight
} from 'react-icons/fa';
import Image from "next/image";
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import {Button} from "@/components/ui/button";
import {create_new_blog} from "@/server/blog";
import {TBlog} from "@/types/blog";

if (typeof globalThis !== "undefined") {
    (globalThis as { React?: typeof React }).React = React;
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});


type FormValues = {
    title:string;
    content:string;
    blogTags:string;
};


const AddBlogForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mdParser = new MarkdownIt(/* Markdown-it options */);
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors},
    } = useForm<FormValues>({
        defaultValues: {
            title:"",
            content:"",
            blogTags:"",
        }
    });


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            validateAndSetImage(file);
        }
    };

    const validateAndSetImage = (file: File) => {
        // Check file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
            return;
        }

        // Check file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image size should be less than 10MB');
            return;
        }

        setSelectedImage(file);
        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetImage(e.dataTransfer.files[0]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        const id = toast.loading('Validating blog details...');
        if (!(selectedImage instanceof File)) {
            toast.error('Invalid image file selected',{id});
            setIsLoading(false);
            return;
        }
        try {
            // make payload
            const payload:TBlog ={
                title:data.title,
                content:data.content,
                blogTags:data.blogTags.split(',').map((tag:string) => tag),
            }


            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));
            formData.append('image', selectedImage);
            // create new project
            const res = await create_new_blog(formData)
            if (res?.success) {
                toast.success('Blog successfully created', {id});
                reset()
                setSelectedImage(null);
                setImagePreview(null);
            } else {
                toast.error(res?.message || 'Failed to create blog', {id});
            }

        } catch (error) {
            toast.error(JSON.stringify(error) || 'Failed to create blog', {id});
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/70 backdrop-blur">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/60 px-4 py-5 text-center sm:px-6">
                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Create New Blog</h1>
                    <p className="mt-1 text-sm text-slate-600">Publish clear, engaging content with professional metadata and cover image.</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8 p-4 sm:p-6 lg:p-8"

                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        <div className="space-y-5">

                            <div className="space-y-2">
                                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                                    Blog Title
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="title"
                                        type="text"
                                        {...register('title', {required: 'Blog Title is required'})}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="How I built a scalable portfolio dashboard"
                                    />
                                </div>
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>


                            {/* Blog Tags */}
                            <div className="space-y-2">
                                <label htmlFor="blogTags" className="block text-sm font-medium text-slate-700">
                                    Blog Tags (comma separated)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <textarea
                                        id="blogTags"
                                        rows={8}
                                        {...register('blogTags', {required: 'Blog tag is required'})}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="react, portfolio, authentication, ui"
                                    />
                                </div>
                                {errors.blogTags && (
                                    <p className="mt-1 text-sm text-red-600">{errors.blogTags.message}</p>
                                )}
                            </div>


                        </div>


                        {/* Product Image Upload */}
                        <div className="space-y-2">
                            <label htmlFor="image-upload" className="block text-sm font-medium text-slate-700">
                                Blog Image
                            </label>
                            <div className="mt-1 flex flex-col items-center">
                                {imagePreview ? (
                                    <div className="mb-4 relative">
                                        <div
                                            className="relative"
                                        >
                                            <Image
                                                src={imagePreview}
                                                alt="Blog preview"
                                                width={100}
                                                height={100}
                                                className="h-64 w-full rounded-md border border-slate-300 object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                            >
                                                <FaTimes className="h-4 w-4"/>
                                            </button>
                                        </div>
                                        <div className="mt-2 text-center text-sm text-gray-600">
                                            <FaCheck className="inline-block mr-1 text-green-500"/>
                                            Image selected: {selectedImage?.name}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex h-64 w-full justify-center rounded-md border-2 px-6 pb-6 pt-5 transition-colors duration-200 ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-dashed border-slate-300 bg-slate-50/70'}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={triggerFileInput}
                                    >
                                        <div
                                            className="space-y-1 text-center flex flex-col items-center justify-center">
                                            <div
                                            >
                                                <FaImage className="mx-auto h-12 w-12 text-slate-400"/>
                                            </div>
                                            <div className="flex flex-wrap justify-center text-sm text-slate-600">
                                                <label
                                                    htmlFor="image-upload"
                                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                                >
                                                    <span>Upload a file</span>
                                                    <input
                                                        ref={fileInputRef}
                                                        id="image-upload"
                                                        name="image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        className="sr-only"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG, GIF, WEBP up to 10MB</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 lg:col-span-2">
                            <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                                Blog Description
                            </label>
                            <Controller
                                name="content"
                                control={control}
                                defaultValue=""
                                render={({field: {onChange, value}}) => (
                                    <MdEditor
                                        value={value}
                                        style={{height: "380px"}}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={({text}) => onChange(text)}

                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div
                        className="mt-2 flex justify-end"
                    >
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`h-11 px-6 text-sm font-medium ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Blog...
                                </>
                            ) : (
                                <>
                                    Create Blog
                                    <FaArrowRight className="ml-2"/>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default AddBlogForm;
