import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import RegisterPage from '../pages/RegisterPage';
import CheckEmail from "../pages/CheckEmail";
import CheckPassword from "../pages/CheckPassword";
import Home from "../pages/Home";
import MessagePage from "../component/MessagePage";
import Mainpage from "../MainPage/Mainpage";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'register',
                element: <Mainpage><RegisterPage /></Mainpage> 
            },
            {
                path: 'email',
                element: <Mainpage> <CheckEmail /></Mainpage>
            },
            {
                path: 'password',
                element: <Mainpage><CheckPassword /></Mainpage> 
            },
            {
                path : 'forget-password',
                element : <Mainpage > <ForgotPassword/> </Mainpage>
            },
            {
                path: '',
                element: <Home />,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage />
                    }
                ]
            }
        ]
    }
]);

export default router;
