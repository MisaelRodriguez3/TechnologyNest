import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider';
import { TopicsProvider } from '../context/TopicProvider';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import ConfirmationPage from '../pages/ConfirmationPage/ConfirmationPage';
import ConfirmationAccountPage from '../pages/ConfirmationAccountPage/ConfirmationAccountPage';
import TwoFactorAuth from '../pages/TwoFactorAuth/TwoFactorAuth';
import ForgotPasswordPage from '../pages/ForgotPasswordPage/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage/ResetPasswordPage';
import { Layout } from '../layouts/Main';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import Random2 from '../pages/random2/random';
import HomePage from '../pages/HomePage/HomePage';
import TopicPage from '../pages/TopicPage/TopicPage';
import ChallengesPage from '../pages/Sections/Challenges/ChallengesPage';
import ExamplesPage from '../pages/Sections/Examples/ExamplesPage';
import PostsPage from '../pages/Sections/Posts/PostsPage';
import SectionPage from '../pages/Sections/SectionPage';
import SpecificContentPage from '../pages/SpecificContentPage/SpecificContentPage';
import StackOverflow from '../modules/StackOverflow/StackOverflow';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import SearchPage from '../pages/SearchPage/SearchPage';

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
          { index: true, element: <HomePage/>},
          { path: "/comment", element: <Random2/> },
          { path: '/search', element: <SearchPage/>},
          { path: '/:topic/:section/:id', element: <SpecificContentPage/> },
          { path: '/:topic/:section', element: <SectionPage/> },
          { path: '/:topic', element: <TopicPage/> },
          { path: '/foro', element: <PostsPage/> },
          { path: '/ejemplos-de-codigo', element: <ExamplesPage/> },
          { path: '/retos', element: <ChallengesPage/> },
          { path: '/stack-overflow', element: <StackOverflow/> },
          { element: <ProtectedRoute/>,
            children: [
              { path: "/profile", element: <ProfilePage/> },
            ]
          }
        ],
      },
      {path: "/register",element: <RegisterPage/>},
      {path: "/login",element: <LoginPage/>},
      {path: "/confirm-email",element: <ConfirmationPage/>},
      {path: "/confirm-account",element: <ConfirmationAccountPage/>},
      {path: "/otp",element: <TwoFactorAuth/>},
      {path: "/forgot-password", element: <ForgotPasswordPage/>},
      {path: "/reset-password",element: <ResetPasswordPage/>},
      {path: '/404', element:<NotFoundPage/>},
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]) 

const AppRouter = () => <RouterProvider router={router}/>

export default AppRouter