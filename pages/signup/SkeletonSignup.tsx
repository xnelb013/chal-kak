const SkeletonSignup = () => {
  return (
    <>
      <div className="flex justify-center mb-24 mt-7 w-50">
        <div className="h-12 bg-gray-200 rounded-lg dark:bg-gray-700 w-[160px] justify-center"></div>
      </div>
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-[550px] h-[580px] mb-7 bg-gray-300 rounded dark:bg-gray-700"></div>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-12 w-[500px] flex bg-gray-200 rounded-full dark:bg-gray-700 mb-4"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
};

export default SkeletonSignup;
