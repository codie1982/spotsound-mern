import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home"
import { MainLayout } from "../layouts/Main";
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
                path:"test",
                element:"Test Page",
            }
        ]
    }
])

export default routes;