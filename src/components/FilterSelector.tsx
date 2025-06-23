
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LUTFilter } from '@/types/image-processing';

interface FilterSelectorProps {
  selectedFilter: LUTFilter;
  onFilterChange: (filter: LUTFilter) => void;
}

const filterOptions: Array<{
  id: LUTFilter;
  name: string;
  description: string;
  color: string;
}> = [
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Rich contrast with warm shadows',
    color: 'bg-gradient-to-r from-amber-500 to-orange-600'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Faded film look with sepia tones',
    color: 'bg-gradient-to-r from-yellow-600 to-amber-700'
  },
  {
    id: 'cool',
    name: 'Cool',
    description: 'Blue tones and crisp highlights',
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600'
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Golden hour glow effect',
    color: 'bg-gradient-to-r from-red-500 to-pink-600'
  },
  {
    id: 'highContrast',
    name: 'High Contrast',
    description: 'Bold blacks and bright whites',
    color: 'bg-gradient-to-r from-gray-800 to-gray-600'
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'Deep shadows and intense mood',
    color: 'bg-gradient-to-r from-purple-800 to-indigo-900'
  },
  {
    id: 'soft',
    name: 'Soft',
    description: 'Gentle tones and dreamy feel',
    color: 'bg-gradient-to-r from-pink-300 to-purple-400'
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Boosted saturation and pop',
    color: 'bg-gradient-to-r from-green-500 to-blue-500'
  },
  {
    id: 'moody',
    name: 'Moody',
    description: 'Dark atmospheric tones',
    color: 'bg-gradient-to-r from-slate-700 to-gray-800'
  },
  {
    id: 'bright',
    name: 'Bright',
    description: 'Clean and airy feel',
    color: 'bg-gradient-to-r from-white to-gray-200'
  },
  {
    id: 'matte',
    name: 'Matte',
    description: 'Lifted blacks and faded look',
    color: 'bg-gradient-to-r from-stone-400 to-slate-500'
  },
  {
    id: 'film',
    name: 'Film',
    description: 'Classic analog film emulation',
    color: 'bg-gradient-to-r from-orange-400 to-red-500'
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Golden and orange tones',
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500'
  },
  {
    id: 'arctic',
    name: 'Arctic',
    description: 'Cool blue and white tones',
    color: 'bg-gradient-to-r from-cyan-400 to-blue-300'
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Classic brown monochrome',
    color: 'bg-gradient-to-r from-amber-800 to-yellow-900'
  }
];

const FilterSelector = ({ selectedFilter, onFilterChange }: FilterSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {filterOptions.map((filter) => (
        <div
          key={filter.id}
          className={`
            relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
            ${selectedFilter === filter.id 
              ? 'border-indigo-500 scale-105 shadow-lg' 
              : 'border-slate-200 hover:border-slate-300 hover:scale-102 hover:shadow-md'
            }
          `}
          onClick={() => onFilterChange(filter.id)}
        >
          <div className={`h-24 ${filter.color} relative`}>
            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-200" />
            {selectedFilter === filter.id && (
              <Badge className="absolute top-2 right-2 bg-white text-indigo-600">
                Selected
              </Badge>
            )}
          </div>
          
          <div className="p-3 bg-white">
            <h3 className="font-semibold text-slate-800 mb-1">
              {filter.name}
            </h3>
            <p className="text-xs text-slate-500">
              {filter.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterSelector;
