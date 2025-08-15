import { useState } from "react";
import Sidebar from "../../Components/Layout/Sidebar";
import Header from "../../Components/Layout/Header";
import { Outlet } from "react-router-dom";


export default function MainLayout(){

     const [isSidebarOpen, setSidebarOpen] = useState(true); // fixed casing

    return(
        <div className="flex min-h-screen min-w-screen bg-white-100">

            {/* Sidebar */}
            {isSidebarOpen && (
                <Sidebar
                isOpen={isSidebarOpen}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                
                // pass other toggles & setters here as props
                />
            )}

            {/* Main content area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}>
                {/* Fixed Header */}
                <div className="fixed top-0 right-0 z-10 transition-all duration-300 bg-white shadow-sm"
                style={{
                    left: isSidebarOpen ? "16rem" : "0", // 16rem = 64 Tailwind spacing
                }}
                >
                <Header
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    user={{
                    name: "John Doe",
                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                    }}
                />
                </div>
                 {/* Scrollable Content */}
        <main className="p-4 flex-1 overflow-auto mt-[64px]">
          {/* mt-[64px] = height of Header so content starts below */}
          <Outlet />
        </main>
            </div>
        </div>

    );

}