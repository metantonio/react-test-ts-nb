import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Filter } from 'lucide-react';
const SearchBar = ({ onFiltersChange, data }) => {
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const searchRef = useRef(null);
    const filterOptions = [
        { key: 'casinoName', label: 'Casino Name', values: [...new Set(data.map(item => item.casinoName))] },
        { key: 'location', label: 'Location', values: [...new Set(data.map(item => item.location))] },
        { key: 'category', label: 'Category', values: [...new Set(data.map(item => item.category))] },
        { key: 'casinoInfo', label: 'Casino Info', values: [...new Set(data.map(item => item.casinoInfo))] },
        { key: 'status', label: 'Status', values: ['active', 'inactive'] },
        { key: 'content', label: 'Content', values: ['enable', 'disable'] }
    ];
    // Get available filter options (exclude already used filters)
    const availableFilterOptions = filterOptions.filter(option => !filters.some(filter => filter.type === option.key));
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    useEffect(() => {
        // Create filters array including dynamic search if active
        const allFilters = [...filters];
        if (selectedFilter && searchText.trim()) {
            // Add a dynamic search filter for real-time filtering
            const dynamicFilter = {
                id: `dynamic-${selectedFilter}-${Date.now()}`,
                type: selectedFilter,
                label: filterOptions.find(opt => opt.key === selectedFilter)?.label || selectedFilter,
                value: searchText.trim()
            };
            allFilters.push(dynamicFilter);
        }
        onFiltersChange(allFilters);
    }, [filters, selectedFilter, searchText, onFiltersChange]);
    const selectFilter = (filterKey) => {
        setSelectedFilter(filterKey);
        setShowDropdown(false);
        setSearchText('');
    };
    const handleKeyDown = (e) => {
        if (e.key === ';' && selectedFilter && searchText.trim()) {
            e.preventDefault();
            // Create permanent filter tag
            const newFilter = {
                id: `${selectedFilter}-${searchText.trim()}-${Date.now()}`,
                type: selectedFilter,
                label: filterOptions.find(opt => opt.key === selectedFilter)?.label || selectedFilter,
                value: searchText.trim()
            };
            setFilters([...filters, newFilter]);
            setSelectedFilter(null);
            setSearchText('');
        }
    };
    const removeFilter = (filterId) => {
        setFilters(filters.filter(f => f.id !== filterId));
    };
    const clearAllFilters = () => {
        setFilters([]);
        setSelectedFilter(null);
        setSearchText('');
    };
    const getPlaceholderText = () => {
        if (selectedFilter) {
            const filterLabel = filterOptions.find(opt => opt.key === selectedFilter)?.label;
            return `Type ${filterLabel?.toLowerCase()} and press ';' to create filter...`;
        }
        return "Select a filter first...";
    };
    return (_jsxs("div", { className: "w-full max-w-4xl mx-auto", ref: searchRef, children: [_jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200", children: [_jsxs("div", { className: "flex items-center px-3 py-2 flex-1", children: [_jsx(Search, { className: "w-4 h-4 text-gray-400 mr-2" }), _jsx("input", { type: "text", value: searchText, onChange: (e) => setSearchText(e.target.value), onKeyDown: handleKeyDown, placeholder: getPlaceholderText(), className: "w-full bg-transparent outline-none text-sm placeholder-gray-500", disabled: !selectedFilter }), selectedFilter && (_jsxs("div", { className: "flex items-center mr-2", children: [_jsx("span", { className: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded", children: filterOptions.find(opt => opt.key === selectedFilter)?.label }), _jsx("button", { onClick: () => {
                                                    setSelectedFilter(null);
                                                    setSearchText('');
                                                }, className: "ml-1 text-gray-400 hover:text-gray-600", children: _jsx(X, { className: "w-3 h-3" }) })] }))] }), _jsxs("button", { onClick: () => setShowDropdown(!showDropdown), className: "flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 border-l border-gray-200", disabled: availableFilterOptions.length === 0, children: [_jsx(Filter, { className: "w-4 h-4 mr-1" }), _jsx("span", { className: "text-sm", children: "Filters" }), _jsx(ChevronDown, { className: "w-4 h-4 ml-1" })] })] }), showDropdown && availableFilterOptions.length > 0 && (_jsx("div", { className: "absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto", children: _jsx("div", { className: "p-2", children: availableFilterOptions.map((option) => (_jsx("button", { onClick: () => selectFilter(option.key), className: "w-full flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-50 rounded text-left", children: _jsx("span", { className: "font-medium text-gray-700", children: option.label }) }, option.key))) }) }))] }), filters.length > 0 && (_jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "text-sm text-gray-600 font-medium", children: "Active filters:" }), filters.map((filter) => (_jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200", children: [_jsxs("span", { className: "text-blue-600 mr-1", children: [filter.label, ":"] }), filter.value, _jsx("button", { onClick: () => removeFilter(filter.id), className: "ml-1.5 text-blue-600 hover:text-blue-800", children: _jsx(X, { className: "w-3 h-3" }) })] }, filter.id))), _jsx("button", { onClick: clearAllFilters, className: "text-sm text-gray-500 hover:text-gray-700 underline", children: "Clear all" })] })), _jsx("div", { className: "mt-2 text-xs text-gray-500", children: !selectedFilter ? "Select a filter from the dropdown to start searching" :
                    `Type your search term and press ';' to create a filter tag` })] }));
};
export default SearchBar;
