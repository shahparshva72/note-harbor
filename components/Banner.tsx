const Banner = ({ message, status }: { message: string; status: string }) => {
  if (!message) return null;

  const getBannerClassNames = (status: string) => {
    switch (status) {
      case "error":
        return "bg-red-100 border border-red-400 text-red-700";
      case "success":
        return "bg-green-100 border border-green-400 text-green-700";
      default:
        return "";
    }
  };

  return (
    <div
      className={`absolute left-0 right-0 top-0 px-4 py-3 ${getBannerClassNames(
        status,
      )}`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Banner;
