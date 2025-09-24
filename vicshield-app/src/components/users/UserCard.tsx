import { useUser } from "~/mocks/user";

/**
 * DaisyUI UserCard for header
 * - Avatar with green/red verify ring
 * - Name + wallet address (truncated)
 * - Dropdown with: View Profile, Copy Address, Logout
 * - Fully keyboard accessible
 */

export default function UserCard({ id }: { id: number }) {
  const user = useUser(id);

  if (!user.data) return null;
  return (
    <div className="dropdown dropdown-end">
      <div className="flex items-center">
        <div className="flex flex-col mr-2 text-right">
          <span className="font-bold">{user.data.username}</span>
          <span className="text-secondary">{user.data.crypto.wallet}</span>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            />
          </div>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
      >
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Logout</a>
        </li>
      </ul>
    </div>
  );
}

/** Example usage (place in your navbar):

  <UserCard
    name="Coco"
    address="0xA3b1c2D3e4F5678901234567890aBCdEf1234567"
    avatarUrl="/avatars/coco.png"
    verified={true}
    onOpenProfile={() => router.push('/profile')}
    onLogout={logout}
  />

*/
