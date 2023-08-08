import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex justify-between p-3 w-full h-fit sticky bg-black text-white">
      <div>
        <Link href="/dashboard">
          <p className="text-base font-bold">Hello, Rupam!</p>
        </Link>
      </div>
      <div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600">
          <p className="text-xs">RD</p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
