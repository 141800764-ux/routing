"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Camera } from "lucide-react";

interface Props {
  userId: string;
  currentName: string;
  currentUsername: string;
  currentEmail: string;
  currentBio: string;
  currentImage: string;
  onClose: () => void;
  onSaved: (updated: any) => void;
}

export default function EditProfileModal({
  userId,
  currentName,
  currentUsername,
  currentEmail,
  currentBio,
  currentImage,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState(currentName);
  const [username, setUsername] = useState(currentUsername);
  const [email, setEmail] = useState(currentEmail);
  const [bio, setBio] = useState(currentBio);
  const [image, setImage] = useState(currentImage);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const body: any = { name, username, email, bio, image };
      if (password) body.password = password;

      const res = await fetch(`/api/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to update profile");
        setSaving(false);
        return;
      }

      onSaved(data.user);
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* PROFILE IMAGE */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Image
              src={image || "/avatar.png"}
              alt="Profile"
              width={88}
              height={88}
              className="rounded-full border-2 border-orange-500/30"
            />
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 rounded-full p-1.5 cursor-pointer transition"
            >
              <Camera size={14} className="text-white" />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50 resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-1 block">
              New Password <span className="text-white/30">(optional)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold text-sm text-white disabled:opacity-50 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}