import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ConfirmationPage from '../pages/ConfirmationPage/ConfirmationPage';
import ConfirmationAccountPage from '../pages/ConfirmationAccountPage/ConfirmationAccountPage';
import TwoFactorAuth from '../pages/TwoFactorAuth/TwoFactorAuth';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
//import Card from '../features/card/Card';
//import { CommentSection } from '../features/comment/comment';
//import StackOverflow from '../features/stackoverflow/stackoverflow';
//import Random from '../pages/cosa/random';
import Random2 from '../pages/random2/random';
//import { ImageCarousel } from '../features/carrusel/carrusel';
//import { PostCard } from '../features/tarjeta/tarjeta';
//import { Navbar } from '../components/layout/Header/Header';
import { Layout } from '../layouts/Main';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            { path: "comment", element: <Random2/>}
        ],
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/confirm-email",
        element: <ConfirmationPage/>
    },
    {
        path: "/confirm-account",
        element: <ConfirmationAccountPage/>
    },
    {
        path: "/otp",
        element: <TwoFactorAuth/>
    },
    {
        path: "/profile",
        element: <ProfilePage/>
    }
]) 

const AppRouter = () => <RouterProvider router={router}/>

export default AppRouter