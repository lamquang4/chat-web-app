import Header from "./header/Header";
import SideMenu from "./side-menu/SideMenu";

type Props = {
  children: React.ReactNode;
};

function Layout({ children }: Props) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideMenu />

        {children}
      </div>
    </div>
  );
}

export default Layout;
