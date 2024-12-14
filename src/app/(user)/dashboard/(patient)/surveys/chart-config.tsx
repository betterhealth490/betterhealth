import { type ChartConfig } from "~/components/ui/chart";

export const chartConfig: Record<string, Record<"label", string>> = {
  waterIntake: {
    label: "Water Intake",
  },
  foodIntake: {
    label: "Food Intake",
  },
  foodHealthQuality: {
    label: "Food Quality",
  },
  sleepTime: {
    label: "Sleep Time",
  },
  sleepLength: {
    label: "Sleep Length",
  },
  sleepQuality: {
    label: "Sleep Quality",
  },
  stressLevel: {
    label: "Stress Level",
  },
  selfImage: {
    label: "Self Image",
  },
} satisfies ChartConfig;
