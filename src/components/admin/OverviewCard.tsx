
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  trendColor?: string;
  iconClassName?: string;
}

export default function OverviewCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  trendColor = "text-muted-foreground",
  iconClassName
}: OverviewCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className={cn("h-5 w-5 text-muted-foreground", iconClassName)} />
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold text-foreground">{value}</div>
        {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
        {trend && <p className={cn("text-xs pt-1", trendColor)}>{trend}</p>}
      </CardContent>
    </Card>
  );
}
