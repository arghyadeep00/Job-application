const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Spinner */}
      <div className="h-10 w-10 border-4 border-slate-700 border-t-indigo-600 rounded-full animate-spin"></div>

      {/* Text */}
      <p className="text-slate-400 text-sm mt-4">
        {text}
      </p>
    </div>
  );
};

export default Loader;
