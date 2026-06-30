import Link from "next/link";
import Image from "next/image";

import ROUTES from "@/constants/routes";

interface UserAvatarProps {
  id: string;
  name: string;
  imageUrl?: string | null;
  className?: string;
}

export default function UserAvatar({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
}: UserAvatarProps) {
  return (
    <Link href={ROUTES.profile(id)}>
      <div
        className={`relative overflow-hidden rounded-full ${className}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary text-white font-semibold">
  {name.charAt(0).toUpperCase()}
</div>
        )}
      </div>
    </Link>
  );
}