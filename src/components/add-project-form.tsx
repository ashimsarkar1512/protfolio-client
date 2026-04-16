"use client";
import React, {useState, useRef,} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {toast} from 'sonner';
import {
    FaAlignLeft,
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
import {TProject} from "@/types/project";
import {create_new_project} from "@/server/project";

if (typeof globalThis !== "undefined") {
    (globalThis as { React?: typeof React }).React = React;
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
    ssr: false,
});


type FormValues = {
    projectName: string
    description: string
    slogan: string
    technologies: string
    features: string
    frontEndGitRepo: string
    backEndGitRepo: string
    liveLink: string
};



const AddProjectForm = () => {
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
            projectName: "",
            description: "",
            slogan: '',
            technologies: "",
            features: "",
            frontEndGitRepo: "",
            backEndGitRepo: "",
            liveLink: ""
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
        const id = toast.loading('Validating project details...');
        if (!(selectedImage instanceof File)) {
            toast.error('Please upload a valid project image', {id});
            setIsLoading(false);
            return;
        }

        const payload:TProject = {
            projectName: data?.projectName,
            slogan:data?.slogan,
            description: data?.description,
            technologies: data?.technologies?.split(",").map((technology:string) => technology),
            features: data?.features?.split(",").map((fet:string)=>fet),
            frontEndGitRepo:data?.frontEndGitRepo,
            backEndGitRepo:data?.backEndGitRepo,
            liveLink: data?.liveLink
        }
        try {
            const formData = new FormData();
            formData.append('data', JSON.stringify(payload));
            formData.append('image', selectedImage);
            // create new project
            const res = await create_new_project(formData)
            if(res?.success){
                toast.success('Project created successfully', {id});
                reset()
                setSelectedImage(null);
                setImagePreview(null);
            }else{
                toast.error(res?.message || 'Failed to create project', {id});
            }

        } catch (error) {
            toast.error(JSON.stringify(error) || 'Failed to create project', {id});
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl shadow-slate-200/70 backdrop-blur">
                <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/60 px-4 py-5 text-center sm:px-6">
                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Create New Project</h1>
                    <p className="mt-1 text-sm text-slate-600">Add complete project information with clean and user-friendly details.</p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-8 p-4 sm:p-6 lg:p-8"

                >
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                        <div className="space-y-5">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label htmlFor="projectName" className="block text-sm font-medium text-slate-700">
                                    Project Name
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="projectName"
                                        type="text"
                                        {...register('projectName', {required: 'Project name is required'})}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="Portfolio Platform"
                                    />
                                </div>
                                {errors.projectName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.projectName.message}</p>
                                )}
                            </div>

                            {/* Product Price */}
                            <div className="space-y-2">
                                <label htmlFor="slogan" className="block text-sm font-medium text-slate-700">
                                    Slogan
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="slogan"
                                        type="text"
                                        {...register('slogan', {
                                            required: 'Slogan is required!',
                                        })}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="Manage and publish modern portfolio content"
                                    />
                                </div>
                                {errors.slogan && (
                                    <p className="mt-1 text-sm text-red-600">{errors.slogan.message}</p>
                                )}
                            </div>

                            {/* Product Tags */}
                            <div className="space-y-2">
                                <label htmlFor="technologies" className="block text-sm font-medium text-slate-700">
                                    Used Technologies (comma separated)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="technologies"
                                        type="text"
                                        {...register('technologies', {
                                            required: 'Technology is required!',
                                        })}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="Next.js, React, TypeScript, Tailwind CSS"
                                    />
                                </div>
                                {errors.technologies && (
                                    <p className="mt-1 text-sm text-red-600">{errors.technologies.message}</p>
                                )}
                            </div>


                            {/* Project Featured */}
                            <div className="space-y-2">
                                <label htmlFor="features" className="block text-sm font-medium text-slate-700">
                                    Project Features (comma separated)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FaAlignLeft className="h-5 w-5 text-slate-400"/>
                                    </div>
                                    <textarea
                                        id="features"
                                        rows={8}
                                        {...register('features', {required: 'Feature is required'})}
                                        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="Role-based dashboard, markdown content editor, media upload..."
                                    />
                                </div>
                                {errors.features && (
                                    <p className="mt-1 text-sm text-red-600">{errors.features.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="liveLink" className="block text-sm font-medium text-slate-700">
                                    Live Demo Link
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="liveLink"
                                        type="url"
                                        {...register('liveLink', {
                                            required: 'Demo Link is required!',
                                        })}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="https://www.yourproject.com"
                                    />
                                </div>
                                {errors.liveLink && (
                                    <p className="mt-1 text-sm text-red-600">{errors.liveLink.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="frontEndGitRepo" className="block text-sm font-medium text-slate-700">
                                    Front-end GitHub Link
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="frontEndGitRepo"
                                        type="url"
                                        {...register('frontEndGitRepo', {
                                            required: 'Front-end Link is required!',
                                        })}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="https://github.com/username/project-client"
                                    />
                                </div>
                                {errors.frontEndGitRepo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.frontEndGitRepo.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="backEndGitRepo" className="block text-sm font-medium text-slate-700">
                                    Back-end GitHub Link
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="backEndGitRepo"
                                        type="url"
                                        {...register('backEndGitRepo', {
                                            required: 'Back-end Link is required!',
                                        })}
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                        placeholder="https://github.com/username/project-server"
                                    />
                                </div>
                                {errors.backEndGitRepo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.backEndGitRepo.message}</p>
                                )}
                            </div>
                            {/* Product Image Upload */}
                            <div className="space-y-2">
                                <label htmlFor="image-upload" className="block text-sm font-medium text-slate-700">
                                    Project Image
                                </label>
                                <div className="mt-1 flex flex-col items-center">
                                    {imagePreview ? (
                                        <div className="mb-4 relative">
                                            <div
                                                className="relative"
                                            >
                                                <Image
                                                    src={imagePreview}
                                                    alt="Project preview"
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
                                            <div className="mt-2 text-center text-sm text-slate-600">
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


                        </div>
                        <div className="space-y-2 lg:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                                Project Description
                            </label>
                            <Controller
                                name="description"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value } }) => (
                                    <MdEditor 
                                        value={value}
                                        style={{ height: "380px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={({ text }) => onChange(text)}

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
                                    Creating Project...
                                </>
                            ) : (
                                <>
                                    Create Project
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

export default AddProjectForm;
