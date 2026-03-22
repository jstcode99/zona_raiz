import LogoSvg from "@/assets/svg/logo";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const Logo = ({ className }: { className?: string }) => {
  const { t } = useTranslation("landing");

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoSvg className="size-8.5" />
      <span className="text-xl font-semibold">{t("nav.brand")}</span>
    </div>
  );
};

export default Logo;
