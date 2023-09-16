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
        <Link href={`/dashboard`}>
          <p className="text-base font-bold">Hello, {first_name}!</p>
        </Link>
      </div>
      <div>
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-600">
          <Link href="/profile">
            <p className="text-xs">RD</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
