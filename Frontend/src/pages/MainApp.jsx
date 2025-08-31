import SidebarLeft from "../components/SidebarLeft";
import ChatWindow from "../components/ChatWindow";
import SidebarRight from "../components/SidebarRight";

export default function MainApp(){
    return(
        <div className="h-screen flex bg-[#0d0d0d] text-white">
      <aside className="w-1/5 border-r border-gray-700">
        <SidebarLeft />
      </aside>
      <main className="flex-1">
        <ChatWindow />
      </main>
      <aside className="w-1/4 border-l border-gray-700">
        <SidebarRight />
      </aside>
    </div>
    )
} 