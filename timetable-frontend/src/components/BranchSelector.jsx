import React from "react";

function BranchSelector({ branches, selectedBranch, onBranchChange }) {
  return (
    <div className="mb-6 animate-fade-in">
      <label className="block text-lg font-semibold text-gray-700 mb-2">
        Select Branch:
      </label>
      <select
        value={selectedBranch}
        onChange={(e) => onBranchChange(e.target.value)}
        className="w-full max-w-xs p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
      >
        {branches.map((branch) => (
          <option key={branch} value={branch}>
            {branch}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BranchSelector;