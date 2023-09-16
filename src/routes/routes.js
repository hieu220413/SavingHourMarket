import Profile from "../screens/Profile/Profile";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import HeaderOnly from "../layouts/HeaderOnly/HeaderOnly";
import Login from "../screens/Login/Login";
import ForgetPassword from "../screens/ForgetPassword/ForgetPassword";
import UserManagement from "../screens/Management/UserManagement/UserManagement";
import Configuration from "../screens/Configuration/Configuration";
import FeedbackManagement from "../screens/Management/FeedbackManagement/FeedbackManagement";
import PickuppointManagement from "../screens/Management/PickuppointManagement/PickuppointManagement";
import TransactionManagement from "../screens/Management/TransactionManagement/TransactionManagement";

export const routes = [
  { path: "/", component: Profile, layout: DefaultLayout },
  { path: "/usermanagement", component: UserManagement, layout: DefaultLayout },
  {
    path: "/feedbackmanagement",
    component: FeedbackManagement,
    layout: DefaultLayout,
  },
  {
    path: "/pickuppointmanagement",
    component: PickuppointManagement,
    layout: DefaultLayout,
  },
  {
    path: "/transactionmanagement",
    component: TransactionManagement,
    layout: DefaultLayout,
  },
  { path: "/config", component: Configuration, layout: DefaultLayout },
  { path: "/login", component: Login, layout: HeaderOnly },
  { path: "/forgetpassword", component: ForgetPassword, layout: HeaderOnly },
];
