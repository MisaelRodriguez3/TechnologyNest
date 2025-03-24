import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider';
import { TopicsProvider } from '../context/TopicProvider';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ConfirmationPage from '../pages/ConfirmationPage/ConfirmationPage';
import ConfirmationAccountPage from '../pages/ConfirmationAccountPage/ConfirmationAccountPage';
import TwoFactorAuth from '../pages/TwoFactorAuth/TwoFactorAuth';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
//import Card from '../features/card/Card';
//import { CommentSection } from '../features/comment/comment';
//import Random from '../pages/cosa/random';
import Random2 from '../pages/random2/random';
//import { ImageCarousel } from '../features/carrusel/carrusel';
//import { PostCard } from '../features/tarjeta/tarjeta';
//import { Navbar } from '../components/layout/Header/Header';
import { Layout } from '../layouts/Main';
import HomePage from '../pages/HomePage/HomePage';
import CreateChallengeForm from '../modules/Sections/Challenge/CreateChallengeForm/CreateChallengeForm';
import ProtectedRoute from './ProtectedRoute';
import StackOverflow from '../modules/StackOverflow/StackOverflow';

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        element: (
          <TopicsProvider>
            <Layout />
          </TopicsProvider>
          ),
        children: [
          { path: "/", element: <HomePage/>},
          { path: "/comment", element: <Random2/> },
          {path: '/:topic/:section', element: <HomePage/>},
          {path: '/:topic', element: <HomePage/>},
          {path: '/foro', element: <HomePage/>},
          {path: '/ejemplos-de-codigo', element: <HomePage/>},
          {path: '/retos', element: <CreateChallengeForm/>},
          {path: '/stack-overflow', element: <StackOverflow/>},
          { element: <ProtectedRoute/>,
            children: [
              { path: "/profile", element: <ProfilePage/> },
            ]
          }
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
        path: "/forgot-password", 
        element: <ForgotPasswordPage/>
      },
      {
        path: "/reset-password",
        element: <ResetPasswordPage/>
      }
    ]
  }
]) 

const AppRouter = () => <RouterProvider router={router}/>

export default AppRouter