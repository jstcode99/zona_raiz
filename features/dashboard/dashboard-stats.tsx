'use client'

import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardAction,
} from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingUp } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export type DashboardStatType = 'properties' | 'visits' | 'listings' | 'newUsers' | 'realEstates';

export type DashboardStatsProps = {
    activeProperties?: number;
    activePropertiesChange?: number;
    visits?: number;
    visitsChange?: number;
    totalListings?: number;
    totalListingsChange?: number;
    newUsers?: number;
    newUsersChange?: number;
    totalRealEstates?: number;
    totalRealEstatesChange?: number;
    pending?: boolean;
    visibleCards?: DashboardStatType[];
};

const STAT_CONFIG: Record<DashboardStatType, {
    key: DashboardStatType;
    titleKey: string;
    valueKey: string;
    changeKey: string;
    footerTextKey: string;
    footerSubtextKey: string;
    Icon: React.ComponentType<{ className?: string }>;
    isCurrency?: boolean;
}> = {
    properties: {
        key: 'properties',
        titleKey: 'sections.active_properties',
        valueKey: 'activeProperties',
        changeKey: 'activePropertiesChange',
        footerTextKey: 'trends.trending_up',
        footerSubtextKey: 'trends.properties_over_last_month',
        Icon: IconTrendingUp,
    },
    visits: {
        key: 'visits',
        titleKey: 'sections.visits',
        valueKey: 'visits',
        changeKey: 'visitsChange',
        footerTextKey: 'trends.trending_up',
        footerSubtextKey: 'trends.exceeds_targets',
        Icon: IconTrendingUp,
    },
    listings: {
        key: 'listings',
        titleKey: 'sections.total_listings',
        valueKey: 'totalListings',
        changeKey: 'totalListingsChange',
        footerTextKey: 'trends.trending_up',
        footerSubtextKey: 'trends.listings_over_last_month',
        Icon: IconTrendingUp,
    },
    newUsers: {
        key: 'newUsers',
        titleKey: 'sections.new_users',
        valueKey: 'newUsers',
        changeKey: 'newUsersChange',
        footerTextKey: 'trends.trending_up',
        footerSubtextKey: 'trends.new_users_over_last_month',
        Icon: IconTrendingUp,
    },
    realEstates: {
        key: 'realEstates',
        titleKey: 'sections.real_estates',
        valueKey: 'totalRealEstates',
        changeKey: 'totalRealEstatesChange',
        footerTextKey: 'trends.trending_up',
        footerSubtextKey: 'trends.real_estates_over_last_month',
        Icon: IconTrendingUp,
    },
};

const CardSkeleton = () => (
    <Card className="@container/card">
        <CardHeader>
            <CardDescription>
                <Skeleton className="h-4 w-24" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                <Skeleton className="h-8 w-32" />
            </CardTitle>
            <CardAction>
                <Skeleton className="h-6 w-16" />
            </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
        </CardFooter>
    </Card>
);

export const DashboardStats = ({
    activeProperties = 0,
    activePropertiesChange = 0,
    visits = 0,
    visitsChange = 0,
    totalListings = 0,
    totalListingsChange = 0,
    newUsers = 0,
    newUsersChange = 0,
    totalRealEstates = 0,
    totalRealEstatesChange = 0,
    pending = false,
    visibleCards = ['properties', 'visits', 'listings', 'newUsers', 'realEstates'],
}: DashboardStatsProps) => {
    const { t } = useTranslation("dashboard");

    const getValue = (key: string): number => {
        const values: Record<string, number> = {
            activeProperties,
            activePropertiesChange,
            visits,
            visitsChange,
            totalListings,
            totalListingsChange,
            newUsers,
            newUsersChange,
            totalRealEstates,
            totalRealEstatesChange,
        };
        return values[key] ?? 0;
    };

    const renderCard = (type: DashboardStatType) => {
        const config = STAT_CONFIG[type];
        const value = getValue(config.valueKey);
        const change = getValue(config.changeKey);
        const TrendIcon = config.Icon;
        const isPositive = change >= 0;

        return (
            <Card key={config.key} className="@container/card">
                <CardHeader>
                    <CardDescription>{t(config.titleKey)}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {config.isCurrency ? `$${formatCurrency(value)}` : value}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <TrendIcon className="size-4" />
                            {change}%
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {t(config.footerTextKey)} <TrendIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {t(config.footerSubtextKey)}
                    </div>
                </CardFooter>
            </Card>
        );
    };

    if (pending) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
                {visibleCards.map((type) => (
                    <CardSkeleton key={type} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
            {visibleCards.map(v => renderCard(v))}
        </div>
    );
};
