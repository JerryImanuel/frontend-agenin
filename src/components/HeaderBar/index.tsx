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
    title ?? (showGreeting ? `Dashboard ${user?.firstName || "Pengguna"}` : "");

  return (
    <div
      className={`sticky top-0 z-40
                  bg-gradient flex items-center px-5 py-2 pt-3 justify-between ${className}`}
      role="banner"
    >
      <h1 className="text-md font-semibold text-agenin truncate">{heading}</h1>

      <div className="flex items-center gap-3">
        {rightSlot}
        <AvatarMenu />
      </div>
    </div>
  );
}
