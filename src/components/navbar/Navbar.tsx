import { UserType } from "@/types/user.type";
import Link from "next/link";

interface NavbarProps {
  user_id?: string;
  first_name?: string;
}

const Navbar = ({ user_id, first_name }: NavbarProps) => {
  return (
    <div className="flex justify-between p-3 w-full h-fit sticky bg-black text-white">
      <div>
        <Link href={`/dashboard/?userId=9ef5267c-85ed-44d5-9cd2-8b3e5b4a1026`}>
          <p className="text-base font-bold">Hello, {first_name}!</p>
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
