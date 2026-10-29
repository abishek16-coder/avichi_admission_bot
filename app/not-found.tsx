import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 text-center bg-[#05040D] text-[#F4F2FF]">
      <h1 className="font-heading text-6xl sm:text-7xl font-bold headline-gradient mb-4">
        404
      </h1>
      <h2 className="text-xl font-semibold text-white mb-2">Page Not Found</h2>
      <p className="text-sm text-[#A9A3C7] max-w-md mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-glow text-white text-sm font-medium shadow-[0_0_20px_rgba(124,92,255,0.4)] transition-all"
      >
        Return to Admission Portal
      </Link>
    </div>
  );
}

