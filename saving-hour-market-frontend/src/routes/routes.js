import Profile from "../screens/Common/Profile/Profile";
import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import HeaderOnly from "../layouts/HeaderOnly/HeaderOnly";
import Login from "../screens/Common/Login/Login";
import ForgetPassword from "../screens/Common/ForgetPassword/ForgetPassword";

import Configuration from "../screens/Admin/Configuration/Configuration";
import UserManagement from "../screens/Admin/Management/UserManagement/UserManagement";
import FeedbackManagement from "../screens/Admin/Management/FeedbackManagement/FeedbackManagement";
import PickuppointManagement from "../screens/Admin/Management/PickuppointManagement/PickuppointManagement";
import TransactionManagement from "../screens/Admin/Management/TransactionManagement/TransactionManagement";
import SuperMarketManagement from "../screens/ProductSelection/Management/SuperMarketManagement/SuperMarketManagement";
import ProductManagement from "../screens/ProductSelection/Management/ProductManagement/ProductManagement";
import CategoryManagement from "../screens/ProductSelection/Management/CategoryManagement/CategoryManagement";
import Report from "../screens/ProductSelection/Report/Report";

export const routes = [
  {
    path: "/",
    component: Profile,
    layout: DefaultLayout,
    private: true,
    role: "All",
  },
  {
    path: "/usermanagement",
    component: UserManagement,
    layout: DefaultLayout,
    private: true,
    role: "ADMIN",
  },
  {
    path: "/feedbackmanagement",
    component: FeedbackManagement,
    layout: DefaultLayout,
    private: true,
    role: "ADMIN",
  },
  {
    path: "/pickuppointmanagement",
    component: PickuppointManagement,
    layout: DefaultLayout,
    private: true,
    role: "ADMIN",
  },
  {
    path: "/transactionmanagement",
    component: TransactionManagement,
    layout: DefaultLayout,
    private: true,
    role: "ADMIN",
  },
  {
    path: "/supermarketmanagement",
    component: SuperMarketManagement,
    layout: DefaultLayout,
    private: true,
    role: "STAFF_SLT",
  },
  {
    path: "/productmanagement",
    component: ProductManagement,
    layout: DefaultLayout,
    private: true,
    role: "STAFF_SLT",
  },
  {
    path: "/categorymanagement",
    component: CategoryManagement,
    layout: DefaultLayout,
    private: true,
    role: "STAFF_SLT",
  },
  {
    path: "/productselectionreport",
    component: Report,
    layout: DefaultLayout,
    private: true,
    role: "STAFF_SLT",
  },
  {
    path: "/config",
    component: Configuration,
    layout: DefaultLayout,
    private: true,
    role: "ADMIN",
  },
  { path: "/login", component: Login, layout: HeaderOnly },
  { path: "/forgetpassword", component: ForgetPassword, layout: HeaderOnly },
];
