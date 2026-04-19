import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'react-hot-toast';

const TeamForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'color', 'background',
    'link', 'image'
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);

    // Clean up object URLs when component unmounts
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("bio", content);
      
      images.forEach((img) => {
        formData.append("images", img);
      });

      // TODO: Replace with your API call
      // const response = await TeamService.createTeam(formData);
      
      toast.success('Team created successfully');
      // Reset form
      setTitle("");
      setContent("");
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error('Error creating team');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-none">
      <CardHeader>
        <CardTitle>Los Angelos Lakers Team</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter team name"
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Team Biography</Label>
            <div className="h-96">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                formats={formats}
                className="h-80"
                placeholder="Write your team biography here..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Team Images</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    
                    alt={`Team preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TeamForm;
