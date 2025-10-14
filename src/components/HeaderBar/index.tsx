import AvatarMenu from "../AvatarMenu";
import { useAuth } from "../../context/AuthContext";

type HeaderBarProps = {
  title?: string;
  showGreeting?: boolean;
  rightSlot?: React.ReactNode;
  className?: string;
};

export default function HeaderBar({
  title,
  showGreeting = false,
  rightSlot,
  className = "",
}: HeaderBarProps) {
  const { user } = useAuth();

  const heading =
    title ?? (showGreeting ? `Halo, ${user?.firstName || "Pengguna"}` : "");

  return (
    <div
      className={`sticky top-0 z-40
                  flex items-center px-5 pt-4 pb-3 justify-between ${className}`}
      role="banner"
    >
      <h1 className="text-md font-semibold text-sky-900 truncate">{heading}</h1>

      <div className="flex items-center gap-3">
        {rightSlot}
        <AvatarMenu />
      </div>
    </div>
  );
}
