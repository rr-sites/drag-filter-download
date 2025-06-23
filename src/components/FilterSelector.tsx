
import { Button } from '@/components/ui/button';
import { LUTFilter } from '@/types/image-processing';

interface FilterSelectorProps {
  selectedFilter: LUTFilter;
  onFilterChange: (filter: LUTFilter) => void;
}

const filterOptions: Array<{
  id: LUTFilter;
  name: string;
}> = [
  { id: 'normal', name: 'Normal' },
  { id: 'clarendon', name: 'Clarendon' },
  { id: 'gingham', name: 'Gingham' },
  { id: 'moon', name: 'Moon' },
  { id: 'lark', name: 'Lark' },
  { id: 'reyes', name: 'Reyes' },
  { id: 'juno', name: 'Juno' },
  { id: 'slumber', name: 'Slumber' },
  { id: 'crema', name: 'Crema' },
  { id: 'ludwig', name: 'Ludwig' },
  { id: 'aden', name: 'Aden' },
  { id: 'perpetua', name: 'Perpetua' },
  { id: 'amaro', name: 'Amaro' },
  { id: 'mayfair', name: 'Mayfair' },
  { id: 'rise', name: 'Rise' },
  { id: 'hudson', name: 'Hudson' },
  { id: 'valencia', name: 'Valencia' },
  { id: 'xpro2', name: 'X-Pro II' },
  { id: 'sierra', name: 'Sierra' },
  { id: 'willow', name: 'Willow' },
  { id: 'lofi', name: 'Lo-Fi' },
  { id: 'earlybird', name: 'Earlybird' },
  { id: 'brannan', name: 'Brannan' },
  { id: 'inkwell', name: 'Inkwell' },
  { id: 'hefe', name: 'Hefe' },
  { id: 'nashville', name: 'Nashville' },
  { id: 'sutro', name: 'Sutro' },
  { id: 'toaster', name: 'Toaster' },
  { id: 'walden', name: 'Walden' },
  { id: 'nineteen77', name: '1977' },
  { id: 'kelvin', name: 'Kelvin' },
  { id: 'stinson', name: 'Stinson' },
  { id: 'vesper', name: 'Vesper' }
];

const FilterSelector = ({ selectedFilter, onFilterChange }: FilterSelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {filterOptions.map((filter) => (
        <Button
          key={filter.id}
          variant={selectedFilter === filter.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.id)}
          className="h-8 text-xs"
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default FilterSelector;
