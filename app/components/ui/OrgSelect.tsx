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
      <SelectTrigger className="w-[140px] lg:w-full">
        <SelectValue placeholder={selectedOrg} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">すべて</SelectItem>
        <SelectItem value="Hololive">ホロライブ</SelectItem>
        <SelectItem value="Nijisanji">にじさんじ</SelectItem>
        <SelectItem value="VSpo">ぶいすぽっ！</SelectItem>
        <SelectItem value="Neo-Porte">Neo-Porte</SelectItem>
      </SelectContent>
    </Select>
  );
}
