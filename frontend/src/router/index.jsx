import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import { MainLayout } from "../layouts/Main";
import Profile from "../screens/Profile";
import OAuth from "../screens/OAuth";
import Abouth from "../screens/Abouth";
import Contact from "../screens/Contact";
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
                path:"abouth",
                element:<Abouth/>,
            },
            {
                path:"contact",
                element:<Contact/>,
            },
            {
                path:"oauth",
                element:<OAuth/>,
            },
            {
                path:"profile",
                element:<Profile/>,
            }
        ]
    }
])

export default routes;