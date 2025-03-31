import AdminLayout, {
  loader as AdminLoader,
} from '../pages/layouts/AdminLayout';
import Dashboard, {
  loader as dashboardLoader,
} from '../pages/adminClient/Dashboard';
import Category, {
  loader as categoryLoader,
  action as categoryAction,
} from '../pages/adminClient/Categories/Category';
import AddCategory, {
  action as addCategoryAction,
} from '../pages/adminClient/Categories/AddCategory';
import EditCategory, {
  loader as editCategoryLoader,
  action as editCategoryAction,
} from '../pages/adminClient/Categories/EditCategory';
import CategoryDetails, {
  loader as categoryDetailsLoader,
} from '../pages/adminClient/Categories/CategoryDetails';
import Subcategories, {
  loader as subcategoryLoader,
  action as subcategoriesAction,
} from '../pages/adminClient/Subcategories/Subategories';
import AddSubcategory, {
  loader as addSubcategoryLoader,
  action as addSubcategoryAction,
} from '../pages/adminClient/Subcategories/AddSubategory';
import EditSubcategory, {
  loader as editSubcategoryLoader,
  action as editSubcategoryAction,
} from '../pages/adminClient/Subcategories/EditSubcategory';
import SubcategoryDetails, {
  loader as viewSubcategoryLoader,
} from '../pages/adminClient/Subcategories/SubcategoryDetails';
import AdminProducts, {
  loader as adminProductsLoader,
  action as adminProductAction,
} from '../pages/adminClient/ProductMgt/AdminProducts';
import AddProducts, {
  loader as addProductLoader,
  action as addProductAction,
} from '../pages/adminClient/ProductMgt/AddProducts';
import EditProduct, {
  loader as editProductLoader,
  action as editProductAction,
} from '../pages/adminClient/ProductMgt/EditProduct';
import ProductView, {
  loader as productViewLoader,
} from '../pages/adminClient/ProductMgt/ProductView';
import ActiveProducts, {
  loader as activeProductLoader,
} from '../pages/adminClient/ProductMgt/ActiveProducts';
import InactiveProducts, {
  loader as inActiveProductLoader,
} from '../pages/adminClient/ProductMgt/InactiveProducts';
import StockoutNotice, {
  loader as stockoutLoader,
} from '../pages/adminClient/ProductMgt/StockoutNotice';
import OrderLists, {
  loader as orderListsLoader,
  action as orderListAction,
} from '../pages/adminClient/OrderMgt/OrderLists';
import AdminOrderDetails, {
  loader as adminOrderDetailsLoader,
} from '../pages/adminClient/OrderMgt/AdminOrderDetails';
import AdminError from '../pages/error/AdminError';
import ReviewList, {
  loader as reviewLoader,
  action as reviewAction,
} from '../pages/adminClient/Reviews/ReviewList';
import ReviewDetail, {
  loader as reviewDetailLoader,
  action as reviewDetailAction,
} from '../pages/adminClient/Reviews/ReviewDetail';
import AllUsers, {
  loader as allUsersLoader,
} from '../pages/adminClient/UserMgt/AllUsers';
import AddAdmins, {
  action as AddAdminAction,
} from '../pages/adminClient/UserMgt/AddAdmins';
import EditUser, {
  loader as EditAdminUserLoader,
} from '../pages/adminClient/UserMgt/EditUser';
import ViewClientUser, {
  loader as viewAdminUserLoader,
} from '../pages/adminClient/UserMgt/ViewClientUser';
import Setting, {
  loader as settingLoader,
  action as settingAction,
} from '../pages/adminClient/Settings/Setting';
// import SalesReport from '../pages/adminClient/Accounting/SalesReport';
// import SalesJournal from '../pages/adminClient/Accounting/SalesJournal';
import AccessManager from '../pages/adminClient/Settings/AccessManager';
import AdminProfile from '../pages/users/AdminProfile';
import AdminEditProfile, {
  action as AdminProfileAction,
} from '../pages/users/AdminEditProfile';
import AdminPasswordChange, {
  action as passwordChangeAction,
} from '../pages/users/AdminPasswordChange';
import UserReport, {
  loader as UserReportLoader,
} from '../pages/adminClient/UserMgt/UserReport';
import AllSliders, {
  loader as sliderLoader,
  action as sliderAction,
} from '../pages/adminClient/Sliders/AllSliders';
import AddSlider, {
  action as addSliderAction,
} from '../pages/adminClient/Sliders/AddSlider';
import EditSlider, {
  loader as editSliderLoader,
  action as editSliderAction,
} from '../pages/adminClient/Sliders/EditSlider';
import ViewSlider, {
  loader as viewSliderLoader,
} from '../pages/adminClient/Sliders/ViewSlider';
import Account from '../pages/adminClient/Accounting/Account';
import CreateOrder, {
  loader as createOrderLoader,
  action as createOrderAction,
} from '../pages/adminClient/Accounting/CreateOrder';
import ContactMails, {
  loader as contactMailLoader,
  action as contactMailAction,
} from '../pages/adminClient/Mails/ContactMails';
import ContactView, {
  loader as contactViewLoader,
  action as contactViewAction,
} from '../pages/adminClient/Mails/ContactView';
import BlogList, {
  loader as blogListLoader,
  action as blogListAction,
} from '../pages/adminClient/Blogs/BlogList';
import AdminBlogView, {
  loader as blogViewLoader,
} from '../pages/adminClient/Blogs/AdminBlogView';
import AddBlog, {
  action as AddBlogAction,
} from '../pages/adminClient/Blogs/AddBlog';
import EditBlog, {
  loader as EditBlogLoader,
  action as EditBlogAction,
} from '../pages/adminClient/Blogs/EditBlog';
import SalesOrderList, {
  loader as salesOrderListLoader,
} from '../pages/adminClient/Accounting/SalesOrderList';
import EditSalesOrder, {
  loader as editSalesOrderLoader,
  action as editSalesOrderAction,
} from '../pages/adminClient/Accounting/EditSalesOrder';
import InvoiceSalesOrder, {
  loader as salesInvoiceLoader,
  action as salesInvoiceAction,
} from '../pages/adminClient/Accounting/InvoiceSalesOrder';
import PostPayment, {
  loader as postPaymentLoader,
  action as postPaymentAction,
} from '../pages/adminClient/Accounting/PostPayment';
import CustomerStatement, {
  loader as CustomerStatementLoader,
  action as customerStatementAction,
} from '../pages/adminClient/Accounting/CustomerStatement';
import SalesReport from '../pages/adminClient/Accounting/SalesReport';
// import CreateOrderV1 from '../pages/adminClient/Accounting/CreateOrderV1';

// import { loader } from '../pages/layouts/UserClientLayout';

const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    errorElement: <AdminError />,
    loader: AdminLoader,
    id: 'user',
    children: [
      { index: true, element: <Dashboard />, loader: dashboardLoader },
      // Section routes
      {
        path: 'categories',

        children: [
          {
            index: true,
            element: <Category />,
            loader: categoryLoader,
            action: categoryAction,
          },
          { path: 'add', element: <AddCategory />, action: addCategoryAction },
          {
            path: 'edit/:id',
            element: <EditCategory />,
            loader: editCategoryLoader,
            action: editCategoryAction,
          },
          {
            path: 'view/:id',
            element: <CategoryDetails />,
            loader: categoryDetailsLoader,
          },
        ],
      },
      // Categories routes
      {
        path: 'subcategories',

        children: [
          {
            index: true,
            element: <Subcategories />,
            loader: subcategoryLoader,
            action: subcategoriesAction,
          },
          {
            path: 'add',
            element: <AddSubcategory />,
            loader: addSubcategoryLoader,
            action: addSubcategoryAction,
          },
          {
            path: 'edit/:id',
            element: <EditSubcategory />,
            loader: editSubcategoryLoader,
            action: editSubcategoryAction,
          },
          {
            path: 'view/:id',
            element: <SubcategoryDetails />,
            loader: viewSubcategoryLoader,
          },
        ],
      },

      // sliders routes
      {
        path: 'sliders',
        children: [
          {
            index: true,
            element: <AllSliders />,
            loader: sliderLoader,
            action: sliderAction,
          },
          {
            path: 'add',
            element: <AddSlider />,
            action: addSliderAction,
          },
          {
            path: 'edit/:id',
            element: <EditSlider />,
            loader: editSliderLoader,
            action: editSliderAction,
          },
          {
            path: 'view/:id',
            element: <ViewSlider />,
            loader: viewSliderLoader,
          },
        ],
      },

      // Products routes
      {
        path: 'products',

        children: [
          {
            index: true,
            element: <AdminProducts />,
            loader: adminProductsLoader,
            action: adminProductAction,
          },
          {
            path: 'add',
            element: <AddProducts />,
            loader: addProductLoader,
            action: addProductAction,
          },
          {
            path: 'edit/:id',
            element: <EditProduct />,
            loader: editProductLoader,
            action: editProductAction,
          },
          {
            path: 'view/:id',
            element: <ProductView />,
            loader: productViewLoader,
          },
        ],
      },
      {
        path: 'active-products',
        element: <ActiveProducts />,
        loader: activeProductLoader,
      },
      {
        path: 'inactive-products',
        element: <InactiveProducts />,
        loader: inActiveProductLoader,
      },
      {
        path: 'stockout-notice',
        element: <StockoutNotice />,
        loader: stockoutLoader,
      },
      // Order managment routes
      {
        path: 'pending-orders',
        children: [
          {
            index: true,
            element: <OrderLists />,
            loader: orderListsLoader,
            action: orderListAction,
          },
          {
            path: ':orderNo',
            element: <AdminOrderDetails />,
            loader: adminOrderDetailsLoader,
          },
        ],
      },
      {
        path: 'confirmed-orders',
        children: [
          {
            index: true,
            element: <OrderLists />,
            loader: orderListsLoader,
            action: orderListAction,
          },
          {
            path: ':orderNo',
            element: <AdminOrderDetails />,
            loader: adminOrderDetailsLoader,
          },
        ],
      },
      {
        path: 'delivered-orders',
        children: [
          {
            index: true,
            element: <OrderLists />,
            loader: orderListsLoader,
          },
          {
            path: ':orderNo',
            element: <AdminOrderDetails />,
            loader: adminOrderDetailsLoader,
          },
        ],
      },
      {
        path: 'sales-orders',
        element: <SalesOrderList />,
        loader: salesOrderListLoader,
      },

      // Review management
      {
        path: 'pending-reviews',
        children: [
          {
            index: true,
            element: <ReviewList />,
            loader: reviewLoader,
            action: reviewAction,
          },
          {
            path: ':id',
            element: <ReviewDetail />,
            loader: reviewDetailLoader,
            action: reviewDetailAction,
          },
        ],
      },
      {
        path: 'approved-reviews',
        children: [
          {
            index: true,
            element: <ReviewList />,
            loader: reviewLoader,
            action: reviewAction,
          },
          {
            path: ':id',
            element: <ReviewDetail />,
            loader: reviewDetailLoader,
            action: reviewDetailAction,
          },
        ],
      },
      // User management routes
      {
        path: 'all-users',
        children: [
          { index: true, element: <AllUsers />, loader: allUsersLoader },
          {
            path: 'edit/:id',
            element: <EditUser />,
            loader: EditAdminUserLoader,
          },
          {
            path: 'view/:id',
            element: <ViewClientUser />,
            loader: viewAdminUserLoader,
          },
        ],
      },
      {
        path: 'new-users-report',
        element: <UserReport />,
        loader: UserReportLoader,
      },
      {
        path: 'create-admin',
        element: <AddAdmins />,
        action: AddAdminAction,
      },
      {
        path: 'all-users',
        element: <AllUsers />,
        loader: allUsersLoader,
      },
      {
        path: 'profile',
        children: [
          { index: true, element: <AdminProfile /> },
          {
            path: 'edit',
            element: <AdminEditProfile />,
            action: AdminProfileAction,
          },
        ],
      },
      {
        path: 'change-password',
        element: <AdminPasswordChange />,
        action: passwordChangeAction,
      },

      // Setting routes
      {
        path: 'settings',
        element: <Setting />,
        loader: settingLoader,
        action: settingAction,
      },
      { path: 'manage-access', element: <AccessManager /> },
      // contact routes
      {
        path: 'contacts',
        children: [
          {
            index: true,
            element: <ContactMails />,
            loader: contactMailLoader,
            action: contactMailAction,
          },
          {
            path: 'view/:id',
            element: <ContactView />,
            loader: contactViewLoader,
            action: contactViewAction,
          },
        ],
      },
      // Blogs
      {
        path: 'blogs',
        children: [
          {
            index: true,
            element: <BlogList />,
            loader: blogListLoader,
            action: blogListAction,
          },
          { path: 'add', element: <AddBlog />, action: AddBlogAction },
          {
            path: 'edit/:id',
            element: <EditBlog />,
            loader: EditBlogLoader,
            action: EditBlogAction,
          },
          {
            path: 'view/:id',
            element: <AdminBlogView />,
            loader: blogViewLoader,
          },
        ],
      },
      // Accounting routes
      {
        path: 'account',
        children: [
          { index: true, element: <Account /> },
          {
            path: 'create-order',
            element: <CreateOrder />,
            loader: createOrderLoader,
            action: createOrderAction,
          },
          {
            path: 'sales-orders',

            children: [
              {
                index: true,
                element: <SalesOrderList />,
                loader: salesOrderListLoader,
              },
              {
                path: 'edit/:id',
                element: <EditSalesOrder />,
                loader: editSalesOrderLoader,
                action: editSalesOrderAction,
              },
              {
                path: 'invoice/:id',
                element: <InvoiceSalesOrder />,
                loader: salesInvoiceLoader,
                action: salesInvoiceAction,
              },
            ],
          },
          {
            path: 'payment',
            element: <PostPayment />,
            loader: postPaymentLoader,
            action: postPaymentAction,
          },
          {
            path: 'customer-statement',
            element: <CustomerStatement />,
            loader: CustomerStatementLoader,
            action: customerStatementAction,
          },
          {
            path: 'sales-report',
            element: <SalesReport />,
            // loader: salesReportLoader,
            // action: salesReportAction,
          },
        ],
      },
    ],
  },
];
export default adminRoutes;
