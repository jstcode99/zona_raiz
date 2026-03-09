'use client'

import { useTranslation } from 'react-i18next';
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardAction,
} from '@/components/ui/card';
import { CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { IconTrendingDown, IconTrendingDown2, IconTrendingUp } from '@tabler/icons-react';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export type DashboardStatType = 'revenue' | 'customers' | 'properties' | 'visits' | 'listings';

export type DashboardStatsProps = {
    totalRevenue?: number;
    totalRevenueChange?: number;
    newCustomers?: number;
    newCustomersChange?: number;
    activeProperties?: number;
    activePropertiesChange?: number;
    visits?: number;
    visitsChange?: number;
    decrease?: number;
    decreaseChange?: number;
    totalListings?: number;
    totalListingsChange?: number;
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
    revenue: {
        key: 'revenue',
        titleKey: 'dashboard.total-revenue',
        valueKey: 'totalRevenue',
        changeKey: 'totalRevenueChange',
        footerTextKey: 'dashboard.trending-up-this-month',
        footerSubtextKey: 'dashboard.visits-last-six-months',
        Icon: IconTrendingUp,
        isCurrency: true,
    },
    customers: {
        key: 'customers',
        titleKey: 'dashboard.new-customers',
        valueKey: 'newCustomers',
        changeKey: 'newCustomersChange',
        footerTextKey: 'dashboard.down-percent-this-period',
        footerSubtextKey: 'dashboard.acquisition-needs-attention',
        Icon: IconTrendingDown2,
    },
    properties: {
        key: 'properties',
        titleKey: 'dashboard.active-properties',
        valueKey: 'activeProperties',
        changeKey: 'activePropertiesChange',
        footerTextKey: 'dashboard.properties-trending-up',
        footerSubtextKey: 'dashboard.properties-over-last-month',
        Icon: IconTrendingUp,
    },
    visits: {
        key: 'visits',
        titleKey: 'dashboard.visits',
        valueKey: 'visits',
        changeKey: 'visitsChange',
        footerTextKey: 'dashboard.visits-trending-up',
        footerSubtextKey: 'dashboard.visits-exceeds-targets',
        Icon: IconTrendingUp,
    },
    listings: {
        key: 'listings',
        titleKey: 'dashboard.total-listings',
        valueKey: 'totalListings',
        changeKey: 'totalListingsChange',
        footerTextKey: 'dashboard.listings-trending-up',
        footerSubtextKey: 'dashboard.listings-over-last-month',
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
    totalRevenue = 0,
    totalRevenueChange = 0,
    newCustomers = 0,
    newCustomersChange = 0,
    activeProperties = 0,
    activePropertiesChange = 0,
    visits = 0,
    visitsChange = 0,
    decrease = 0,
    decreaseChange = 0,
    totalListings = 0,
    totalListingsChange = 0,
    pending = false,
    visibleCards = ['revenue', 'customers', 'properties', 'visits'],
}: DashboardStatsProps) => {
    const { t } = useTranslation();

    const getValue = (key: string): number => {
        const values: Record<string, number> = {
            totalRevenue,
            totalRevenueChange,
            newCustomers,
            newCustomersChange,
            activeProperties,
            activePropertiesChange,
            visits,
            visitsChange,
            decrease,
            decreaseChange,
            totalListings,
            totalListingsChange,
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
            {visibleCards.includes('revenue') && (
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t('dashboard.total-revenue')}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            ${formatCurrency(totalRevenue)}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp />
                                {totalRevenueChange}%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t('dashboard.trending-up-this-month')} <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            {t('dashboard.visits-last-six-months')}
                        </div>
                    </CardFooter>
                </Card>
            )}
            {visibleCards.includes('customers') && (
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t('dashboard.new-customers')}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {newCustomers}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingDown2 className="size-4" />
                                {newCustomersChange}%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t('dashboard.down-percent-this-period')} <IconTrendingDown className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            {t('dashboard.acquisition-needs-attention')}
                        </div>
                    </CardFooter>
                </Card>
            )}
            {visibleCards.includes('properties') && (
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t('dashboard.active-properties')}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {activeProperties}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp />
                                {activePropertiesChange}%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t('dashboard.properties-trending-up')} <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            {t('dashboard.properties-over-last-month')}
                        </div>
                    </CardFooter>
                </Card>
            )}
            {visibleCards.includes('visits') && (
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t('dashboard.visits')}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {visits}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp />
                                {visitsChange}%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t('dashboard.visits-trending-up')} <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            {t('dashboard.visits-exceeds-targets')}
                        </div>
                    </CardFooter>
                </Card>
            )}
            {visibleCards.includes('listings') && (
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>{t('dashboard.total-listings')}</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            {totalListings}
                        </CardTitle>
                        <CardAction>
                            <Badge variant="outline">
                                <IconTrendingUp />
                                {totalListingsChange}%
                            </Badge>
                        </CardAction>
                    </CardHeader>
                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                        <div className="line-clamp-1 flex gap-2 font-medium">
                            {t('dashboard.listings-trending-up')} <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                            {t('dashboard.listings-over-last-month')}
                        </div>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};
