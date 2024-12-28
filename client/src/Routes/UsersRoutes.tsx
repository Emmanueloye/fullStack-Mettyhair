import UserClientLayout, {
  loader as userLoader,
} from '../pages/layouts/UserClientLayout';
import UserError from '../pages/error/UserError';
import Home, { loader as homeLoader } from '../pages/userClient/Home';
import Login, { action as LoginAction } from '../pages/auth/Login';
import Register, { action as registerAction } from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgetPassword, {
  action as forgetPasswordAction,
} from '../pages/auth/ForgetPassword';
import PasswordReset, {
  action as resetPasswordAction,
} from '../pages/auth/PasswordReset';
import ProfileLayout, {
  loader as profileLayoutLoader,
} from '../features/Profile/ProfileLayout';
import UserProfile from '../pages/users/UserProfile';
import EditProfile, {
  action as editProfileAction,
} from '../pages/users/EditProfile';
import AddressBook, {
  action as addressBookAction,
} from '../pages/users/AddressBook';
import ChangePassword, {
  action as changePasswordAction,
} from '../pages/users/ChangePassword';
import OrderHistory, {
  loader as OrderHistoryLoader,
} from '../pages/users/OrderHistory';
import OrderDetails, {
  loader as orderDetailsLoader,
} from '../pages/users/OrderDetails';
import Products, {
  loader as productsLoader,
} from '../pages/userClient/Products';
import ProductDetails, {
  loader as productDetailsLoader,
} from '../pages/userClient/ProductDetails';
import SpecialDealProducts, {
  loader as specialDealLoader,
} from '../pages/userClient/SpecialDealProducts';
import Cart, { loader as cartLoader } from '../pages/userClient/Cart';
import Checkout, {
  loader as checkoutLoader,
  action as checkoutAction,
} from '../pages/userClient/Checkout';
import PaymentConfirmation, {
  loader as PaymentConfirmationLoader,
} from '../pages/userClient/PaymentConfirmation';
import Invoice, { loader as invoiceLoader } from '../pages/users/Invoice';
import SubcategoriesProducts, {
  loader as subcatProductsLoader,
} from '../pages/userClient/SubcategoriesProducts';
import CategoriesProducts, {
  loader as CategoryProductsLoader,
} from '../pages/userClient/CategoriesProducts';
import SearchResult from '../pages/userClient/SearchResult';
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from '../pages/userClient/Contact';
import Blog, { loader as blogLoader } from '../pages/userClient/Blog';
import BlogDetails, {
  loader as blogDetailsLoader,
} from '../pages/userClient/BlogDetails';

const userClientRoutes = [
  {
    path: '/',
    element: <UserClientLayout />,
    errorElement: <UserError />,
    loader: userLoader,

    children: [
      { index: true, element: <Home />, loader: homeLoader },
      { path: 'login', element: <Login />, action: LoginAction },
      { path: 'register', element: <Register />, action: registerAction },
      {
        path: 'verify-email',
        element: <VerifyEmail />,
      },
      {
        path: 'forget-password',
        element: <ForgetPassword />,
        action: forgetPasswordAction,
      },
      {
        path: 'reset-password',
        element: <PasswordReset />,
        action: resetPasswordAction,
      },

      {
        path: 'user',
        element: <ProfileLayout />,
        loader: profileLayoutLoader,
        children: [
          {
            path: 'profile',

            children: [
              { index: true, element: <UserProfile /> },
              {
                path: 'edit',
                element: <EditProfile />,
                action: editProfileAction,
              },
              {
                path: 'address-book',
                element: <AddressBook />,
                action: addressBookAction,
              },
            ],
          },
          {
            path: 'change-password',
            element: <ChangePassword />,
            action: changePasswordAction,
          },
          {
            path: 'order-history',
            children: [
              {
                index: true,
                element: <OrderHistory />,
                loader: OrderHistoryLoader,
              },
              {
                path: 'view/:orderNo',
                element: <OrderDetails />,
                loader: orderDetailsLoader,
              },
              { path: ':orderNo', element: <Invoice />, loader: invoiceLoader },
            ],
          },
        ],
      },
      {
        path: 'products',
        children: [
          { index: true, element: <Products />, loader: productsLoader },
          {
            path: 'special-offer',
            element: <SpecialDealProducts />,
            loader: specialDealLoader,
          },
          {
            path: 'subcategory/:slug/:id',
            element: <SubcategoriesProducts />,
            loader: subcatProductsLoader,
          },
          {
            path: 'category/:slug/:id',
            element: <CategoriesProducts />,
            loader: CategoryProductsLoader,
          },
          {
            path: ':slug/:id',
            element: <ProductDetails />,
            loader: productDetailsLoader,
          },
        ],
      },

      {
        path: '/shopping-cart',
        element: <Cart />,
        loader: cartLoader,
      },
      {
        path: '/checkout',
        element: <Checkout />,
        loader: checkoutLoader,
        action: checkoutAction,
      },
      {
        path: '/checkout/confirm',
        element: <PaymentConfirmation />,
        loader: PaymentConfirmationLoader,
      },
      {
        path: '/search/result',
        element: <SearchResult />,
      },
      {
        path: 'contact',
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      // Blog routes
      {
        path: 'blog',
        children: [
          { index: true, element: <Blog />, loader: blogLoader },
          {
            path: ':slug/:id',
            element: <BlogDetails />,
            loader: blogDetailsLoader,
          },
        ],
      },
    ],
  },
];

export default userClientRoutes;
