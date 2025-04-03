import "@ant-design/v5-patch-for-react-19";
import { Anchor } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface AnchorItem {
  key: string;
  href: string;
  title: string;
}

const anchorItems: AnchorItem[] = [
  { key: "part-1", href: "users-a", title: "normal" },
  { key: "part-2", href: "users-b", title: "swr" },
];

const Navbar: FC = () => {
  const router = useRouter();

  const handleLinkClick = (href: string) => {
    router.push(href);
  };

  return (
    <nav
      className="w-full flex flex-col gap-5 mb-5"
      aria-label="Main Navigation"
    >
      <div>
        <h2>Anchor (Ant Design)</h2>
        <Anchor
          className="text-white"
          direction="horizontal"
          items={anchorItems}
        />
      </div>
      <div>
        <h2>Link (Next.js)</h2>
        <div className="flex gap-4">
          {anchorItems.map((item) => (
            <Link key={item.key} href={`/${item.href}`}>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2>Router (Next.js)</h2>
        <div className="flex gap-4">
          {anchorItems.map((item) => (
            <span
              key={item.key}
              className="cursor-pointer text-white hover:underline"
              onClick={() => handleLinkClick(`/${item.href}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLinkClick(`/${item.href}`);
              }} // Support keyboard navigation.
            >
              {item.title}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
