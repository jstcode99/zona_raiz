"use client";
import { ReactNode } from "react";

interface ItemTimeLine {
  id: string;
  title: string;
  description: string;
  position: string;
  icon: ReactNode;
}

export default function InfographicTimeline({
  steps = [],
}: {
  steps: ItemTimeLine[];
}) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="flex gap-4">
            {/* Columna izquierda: icono + línea */}
            <div className="flex flex-col items-center shrink-0">
              {/* Icono */}
              <div
                aria-label={`Step ${step.id}: ${step.title}`}
                className="rounded-xl flex items-center justify-center shrink-0 outline-none transition-all duration-200 cursor-pointer"
              >
                <span className="size-[80] flex items-center justify-center">
                  {step.icon}
                </span>
              </div>

              {/* Línea vertical punteada */}
              {!isLast && (
                <div className="flex-1 w-px my-2 border-l-2 border-dashed border-slate-200 dark:border-slate-700" />
              )}
            </div>

            <article className="flex-1 pb-7 text-left outline-none cursor-pointer rounded-xl transition-colors duration-150">
              <h3 className="text-xl font-bold leading-snug transition-colors duration-200">
                {step.title}
              </h3>
              <p className="mt-1 leading-relaxed text-slate-500 dark:text-slate-400">
                {step.description}
              </p>
            </article>
          </div>
        );
      })}
    </div>
  );
}
