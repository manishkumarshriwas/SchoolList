const SkeletonCard = () => {
  return (
    <div className="card animate-pulse">
      <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-5/6 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;