const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-28 pb-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_24%),radial-gradient(circle_at_80%_15%,_rgba(122,231,199,0.18),_transparent_22%)]" />
      <div className="absolute left-10 top-24 h-40 w-40 rounded-full bg-[#f97316]/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-[#7ae7c7]/10 blur-3xl" />
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </div>
  );
};

export default AuthLayout;
