import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { NewsService } from '../../../service/newsService';
import { useAdminContext } from '../../../api/context/AdminContext';
import { DatePickerWithPresets } from "../ui/dataPicker";
import { format } from "date-fns";
import { ARTICLES_CONTENT } from "../../router/paths";
// import NewsService from '../../../service/NewsService'

const NewsForm = () => {
    const { admin } = useAdminContext()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [date, setDate] = useState(null)
    const [videoUrl, setVideoUrl] = useState('')
    const [image, setImage] = useState([])
    const [imagePreview, setImagePreview] = useState([])
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'link', 'image'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'color': [ ] }, { 'background': [] }, { 'font': [ 'italic', 'bold', 'underline', 'strike' ] }],
            ['link', 'image', 'video'],
            ['clean']
            ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'link', 'image', 'video'
    ];
    

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log('Selected files:', files);
        
        if (files.length > 0) {
            const newImages = [];
            const newPreviews = [];
            
            files.forEach(file => {
                newImages.push(file);
                newPreviews.push(URL.createObjectURL(file));
            });
            
            setImage(prev => {
                const updatedImages = [...prev, ...newImages];
                return updatedImages;
            });
            
            setImagePreview(prev => [...prev, ...newPreviews]);
        }
    };


    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            imagePreview.forEach(preview => {
                URL.revokeObjectURL(preview);
            });
        };
    }, [imagePreview]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', admin.id);
            formData.append('content', content);
            formData.append('date', date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
            formData.append('videoUrl', videoUrl);

            // Append each image file
            image.forEach((img, index) => {
                formData.append('images[]', img);
            });

            console.log('Sending data:', {
                title,
                author: admin.id,
                content,
                date,
                videoUrl,
                images: image
            });

            const response = await NewsService.createArticle(formData);
            console.log('Response:', response);
            
            if (response.data.success) {
                navigate(ARTICLES_CONTENT);
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error.response?.data?.message || 'An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mx-auto p-6">
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

           <Card>
            <CardHeader>
                <CardTitle>Create News Article</CardTitle>
                <CardDescription>Create a new news article to share with the community</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Title<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the news title"
                    />
                </div>
                <div>
                    <Label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                        Author
                    </Label>
                    <Input
                        type="text"
                        id="author"
                        disabled
                            value={admin.first_name +" "+ admin.last_name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the news title"
                    />
                </div>
                <div>
                    <Label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                        Date<span className="text-red-500">*</span>
                    </Label>
                    <DatePickerWithPresets className="w-full" onDateChange={handleDateChange} />
                </div>
                <div>
                    <Label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter the news title"
                    />
                </div>
                <div>
                    <Label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Content<span className="text-red-500">*</span>
                    </Label>
                    <div className="h-96">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            formats={formats}
                            className="h-80"
                        />
                    </div>
                </div>
                <div>
                    <Label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                        Image<span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="file"
                        id="image"
                        name="images"
                        multiple={true}
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {imagePreview.length > 0 && (
                        <div className="mt-2">
                            {imagePreview.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="max-w-xs rounded-md shadow-sm"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                        isSubmitting
                            ? 'bg-slate-400 cursor-not-allowed'
                            : 'bg-slate-900 hover:bg-slate-950'
                    }`}
                >
                    {isSubmitting ? 'Creating...' : 'Create News Article'}
                </Button>
            </form>
            </CardContent>
           </Card>
        </div>
    );
};

export default NewsForm;
