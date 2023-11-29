import DefaultLayout from "../layouts/DefaultLayout/DefaultLayout";
import TermOfService from "../screens/TermOfService/TermOfService";
import PrivacyPolicy from "../screens/PrivacyPolicy/PrivacyPolicy";
import OperatingRegulations from "../screens/OperatingRegulations/OperatingRegulations";
import ShippingPolicy from "../screens/ShippingPolicy/ShippingPolicy";
import ReturnAndRefundPolicy from "../screens/ReturnAndRefundPolicy/ReturnAndRefundPolicy";
import ComplaintHandlingProcess from "../screens/ComplaintHandlingProcess/ComplaintHandlingProcess";

export const routes = [
  {
    path: "/",
    component: TermOfService,
    layout: DefaultLayout,
  },
  {
    path: "/PrivacyPolicy",
    component: PrivacyPolicy,
    layout: DefaultLayout,
  },
  {
    path: "/OperatingRegulations",
    component: OperatingRegulations,
    layout: DefaultLayout,
  },
  {
    path: "/ShippingPolicy",
    component: ShippingPolicy,
    layout: DefaultLayout,
  },
  {
    path: "/ReturnAndRefundPolicy",
    component: ReturnAndRefundPolicy,
    layout: DefaultLayout,
  },
  {
    path: "/ComplaintHandlingProcess",
    component: ComplaintHandlingProcess,
    layout: DefaultLayout,
  },
];
