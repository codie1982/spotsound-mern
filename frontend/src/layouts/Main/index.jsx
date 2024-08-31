import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css'
export function MainLayout() {
    return (
    <div> 
        <div>
            <Outlet />
        </div>
        <ToastContainer/>
    </div>
    )
}