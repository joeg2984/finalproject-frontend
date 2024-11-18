const LoadingSkeleton = () => {
    return (
      <div className="mt-6 p-4 border border-gray-200 rounded-md shadow-sm bg-white space-y-4">
        <div className="flex space-x-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default LoadingSkeleton;