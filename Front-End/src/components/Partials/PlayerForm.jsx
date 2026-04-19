import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import Players from "../../../service/Players";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PLAYERS } from "../../router/paths";

const initialState = {
  full_name: "",
  birth_date: "",
  birth_place: "",
  nickname: "",
  height: "",
  weight: "",
  championships: "",
  position:"",
  jersey_number:"",
  image: null,
};

export default function PlayerForm({ mode = "add" }) {


  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const isEdit = mode === "edit";
  const playerId = location.pathname.split("/").pop();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      Players.getPlayer(playerId)
        .then((res) => {
          setForm( {...initialState, ...res.data} );
          setImage(res.data.image);
        }).finally(() => setLoading(false));
    } else {
      setForm(initialState);
      setImage(null);
    }
  }, [isEdit, playerId]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    if (type === "file") {
      setImage(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null) {
        formData.append(key, form[key]);
      }
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEdit) {
        toast.promise(Players.updatePlayer(playerId, formData), {
          loading: "Updating player...",
          success: (data) =>{
            setForm(initialState);
            setImage(null); 
            setTimeout(() => {
                navigate(PLAYERS);
              }, 1500);
            return `Player ${data.data.full_name} updated successfully!`;
          },
          error: (err) => `Could not update player: ${err.response.data.message}`,
        });
      } else {
        toast.promise(Players.createPlayer(formData), {
          loading: "Creating player...",
          success:  (data) => {
            setForm(initialState);
            setImage(null); 
            setTimeout(() => {
                navigate(PLAYERS);
              }, 1500);
            return `Player ${data.data.full_name} created successfully!`;
            
          },
          error: (err) => `Could not create player: ${err.response.data.message}`,
        });
      }
      
    } catch (err) {
      console.error("Form submit error:", err);
      toast.error("Form submit error:", err);
    }
  };

  if (isEdit && loading) {
    return <div className="text-center mt-10">Loading player data...</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md border border-gray-200 dark:bg-gray-950 my-10 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
        {[
          { label: "Full Name", name: "full_name" },
          { label: "Birth Date", name: "birth_date", type: "date" },
          { label: "Birth Place", name: "birth_place" },
          { label: "Nickname", name: "nickname" },
          { label: "Height", name: "height" },
          { label: "Weight", name: "weight" },
          { label: "Championships", name: "championships" },
          {label: "Position",name:"position"},
          {label:"Jersey Number", name:"jersey_number"}
        ].map(({ label, name, type = "text" }) => (
          <div className="grid gap-2" key={name}>
            <Label>{label}</Label>
            <Input
              name={name}
              type={type}
              value={form[name] || ""}
              onChange={handleChange}
              required={["full_name", "birth_date", "birth_place"].includes(name)}
            />
          </div>
        ))}

        <div className="grid gap-2">
          <Label>Image</Label>
          <Input name="image" type="file" onChange={handleChange} />
        </div>
        {isEdit && (
        <div className="grid gap-2">
            <Label>{form.full_name} Image</Label>
            <img src={backendUrl + '/' + form.image} alt={form.full_name} className="w-full h-40 rounded-sm object-cover shadow-md" />
        </div>
        )}
        <DialogFooter>
          <Button type="submit" >{isEdit ? "Update" : "Add"}</Button>
        </DialogFooter>
      </form>
    </div>
  );
}
