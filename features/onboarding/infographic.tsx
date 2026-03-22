"use client";

import { useTranslation } from "react-i18next";
import InfographicTimeline from "./infographic-time-line";
import { ApartmentsShape } from "@/assets/svg/aparments-shape";
import { HomeShape } from "@/assets/svg/home-shape";
import { KeysShape } from "@/assets/svg/keys-shape";
import { TowerShape } from "@/assets/svg/tower-shape";

export const Infographic = () => {
  const { t } = useTranslation("onboarding");

  const STEPS = [
    {
      id: "01",
      title: t("infographic.steps.01.title"),
      description: t("infographic.steps.01.description"),
      position: "left",
      icon: <HomeShape width={100} height={100} />,
    },
    {
      id: "02",
      title: t("infographic.steps.02.title"),
      description: t("infographic.steps.02.description"),
      position: "right",
      icon: <KeysShape width={100} height={100} />,
    },
    {
      id: "03",
      title: t("infographic.steps.03.title"),
      description: t("infographic.steps.03.description"),
      position: "left",
      icon: <ApartmentsShape width={100} height={100} />,
    },
    {
      id: "04",
      title: t("infographic.steps.04.title"),
      description: t("infographic.steps.04.description"),
      position: "right",
      icon: <TowerShape width={100} height={100} />,
    },
  ];

  return (
    <div className="mx-auto">
      <div className="text-center mb-10">
        <h2 className="mt-1 leading text-2xl space-x-2 text-primary">
          {t("infographic.title")}
        </h2>
        <h3 className="mt-1 leading text-xl space-x-2">
          {t("infographic.subtitle")}
        </h3>
        <p className="mt-2 text-sm max-w-xs mx-auto leading-relaxed text-slate-500 dark:text-slate-400">
          {t("infographic.body")}
        </p>
      </div>
      <InfographicTimeline steps={STEPS} />
    </div>
  );
};
