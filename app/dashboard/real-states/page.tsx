import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import { SupabaseRealEstateRepository } from "@/infrastructure/db/SupabaseRealEstateRepository";
import RealEstatesTable from "@/features/real-states/real-state-table";
import { RealEstateColumns, RealEstateRow } from "@/features/real-states/real-state-columns";
import { IconPlus } from "@tabler/icons-react";


export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: 'asc' | 'desc' }>
}) {
  const { search = '', sort = 'asc' } = await searchParams;
  const supabase = new SupabaseRealEstateRepository()
  const data = supabase.findAll()

  return (
    <main className="flex items-center justify-between px-4 lg:px-6">
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6 lg:px-6"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="outline">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="past-performance">Past Performance</SelectItem>
              <SelectItem value="key-personnel">Key Personnel</SelectItem>
              <SelectItem value="focus-documents">Focus Documents</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="past-performance">
              Past Performance <Badge variant="secondary">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="key-personnel">
              Key Personnel <Badge variant="secondary">2</Badge>
            </TabsTrigger>
            <TabsTrigger value="focus-documents">Focus Documents</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/real-states/new`}>
              <Button variant="outline" size="sm">
                <span className="hidden lg:inline"><IconPlus /></span>
              </Button>
            </Link>
          </div>
        </div>
        <TabsContent value="outline" className="w-full">
          <Suspense fallback={<Spinner />}>
            <RealEstatesTable realEstates={data as Promise<RealEstateRow[]>} columns={RealEstateColumns} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>
  );
}
