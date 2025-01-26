'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useOrg } from '@/app/contexts/OrgContext';
import type { Organization } from '@/app/types';

export function OrgSelect() {
  const { selectedOrg, setSelectedOrg } = useOrg();

  return (
    <Select
      value={selectedOrg}
      onValueChange={(value: Organization) => setSelectedOrg(value)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={selectedOrg} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Hololive">ホロライブ</SelectItem>
        <SelectItem value="Nijisanji">にじさんじ</SelectItem>
      </SelectContent>
    </Select>
  );
}
