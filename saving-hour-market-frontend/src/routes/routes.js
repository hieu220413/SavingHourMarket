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
import Report from "../screens/ProductSelection/Report/Report";
import SuperMarketReport from "../screens/ProductSelection/Management/SuperMarketReport/SuperMarketReport";

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
  {
    path: "/supermarketmanagement",
    component: SuperMarketManagement,
    layout: DefaultLayout,
  },
  {
    path: "/productmanagement",
    component: ProductManagement,
    layout: DefaultLayout,
  },
  {
    path: "/productselectionreport",
    component: Report,
    layout: DefaultLayout,
  },
  {
    path: "/supermarketreport",
    component: SuperMarketReport,
    layout: DefaultLayout,
  },
  { path: "/config", component: Configuration, layout: DefaultLayout },
  { path: "/login", component: Login, layout: HeaderOnly },
  { path: "/forgetpassword", component: ForgetPassword, layout: HeaderOnly },
];
