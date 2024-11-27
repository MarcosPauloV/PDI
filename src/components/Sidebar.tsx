import React from 'react';

interface SidebarProps {
  list: string[];
  onFilterSelect: (filterName: string) => void;
  selectedFilter?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ list, onFilterSelect, selectedFilter }) => {
  return (
    <aside className="p-4 w-full bg-white shadow-lg md:w-72">
      <div className="sticky top-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-700">Filtros Disponíveis</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          {list.map((item) => (
            <button
              key={item}
              onClick={() => onFilterSelect(item)}
              className={`px-8 py-2.5 text-sm font-medium rounded-lg shadow-sm focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] ${
                selectedFilter === item
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-2 border-black'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
