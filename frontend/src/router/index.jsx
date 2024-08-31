import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import { MainLayout } from "../layouts/Main";
import Profile from "../screens/Profile";
const routes =  createBrowserRouter([
    {
        path:"/",
        element:<MainLayout/>,
        errorElement : "Home Error Page",
        children:[
            {
                index:true,
                element:<Home/>
            },
            {
                path:"profile",
                element:<Profile/>,
            }
        ]
    }
])

export default routes;