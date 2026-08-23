import Button from "../../ui/Button";
import { Maximize, Menu } from "lucide-react";
import { useAppDispatch } from "../../../redux/store";
import { toggleSideMenu } from "../../../redux/slices/uiSlice";
import ProfileMenu from "./ProfileMenu";

function Header() {
  const dispatch = useAppDispatch();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <header className="sticky top-0 z-10 flex w-full bg-white border-b-gray-200 items-center border-b">
      <div className="w-full flex justify-between items-center px-[15px] py-4">
        <div className="flex sm:gap-[20px] gap-[15px] items-center">
          <Button
            onClick={() => dispatch(toggleSideMenu())}
            className="bg-gray-200/70 w-8.5 h-8.5 rounded-lg justify-center items-center flex lg:hidden"
          >
            <Menu size={18} />
          </Button>

          <Button
            onClick={handleFullscreen}
            className="bg-gray-200/70 w-8.5 h-8.5 rounded-lg justify-center items-center sm:flex hidden"
          >
            <Maximize size={18} />
          </Button>
        </div>

        <ProfileMenu />
      </div>
    </header>
  );
}

export default Header;
