import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-around bg-white py-4 shadow-md">
      <Link href="/" className="flex flex-col items-center text-gray-700">
        <i className="home-icon"></i>
        <span className="text-xs">Home</span>
      </Link>
      <Link
        href="/friends"
        className="flex flex-col items-center text-gray-700"
      >
        <i className="friends-icon"></i>
        <span className="text-xs">Friends</span>
      </Link>
      <Link href="/events" className="flex flex-col items-center text-gray-700">
        <i className="events-icon"></i>
        <span className="text-xs">Events</span>
      </Link>
      <Link
        href="/profile"
        className="flex flex-col items-center text-gray-700"
      >
        <i className="profile-icon"></i>
        <span className="text-xs">Profile</span>
      </Link>
    </nav>
  );
};

export default Navbar;
