import { createBrowserRouter } from "react-router-dom";
import SiteLayout from "../layout/SiteLayout";
import StoreLayout from "../layout/StoreLayout";
import HomeSite from "../pages/Home";
import About from "../pages/About";
import Store from "../pages/store/Store";
import DashboardLayout from "../layout/DashboardLayout";
import ListAdmins from "../pages/Dashboard/ListAdmins";
import AddAdmin from "../pages/Dashboard/AddAdmin";
import DetailUtilisateur from "../pages/Dashboard/DetailUtilisateur";
import TextFillLoadingExample from "../pages/TextFillLoadingExample";
import Products from "../pages/store/Products";
import Cart from '../pages/store/Cart';
import LoginForm from "../pages/store/LoginForm";
import LoginPage from "../pages/Dashboard/Login";
import RegisterForm from "../pages/store/RegisterForm";
import Checkout from '../pages/store/Checkout';
import AllCategories from "../pages/store/AllCategories";
import Wishlist from "../pages/store/Wishlist";

import OrdersTable from "../pages/Dashboard/OrdersTable";
import AddProduct from "../pages/Dashboard/AddProduct";
import Categories from "../pages/Dashboard/Categories";
import SubCategories from "../pages/Dashboard/SubCategories";
import ListProducts from "../pages/Dashboard/Products";
import OrdersPage from "../pages/Dashboard/OrdersPage";
import Home from "../pages/Dashboard/Home";
import Product from "../../service/Product";
import Players from "../pages/Dashboard/Players";
import Teams from "../pages/Dashboard/Teams";
import PlayerForm from "../components/Partials/PlayerForm";
import TeamForm from "../components/Partials/TeamForm";
import SplashScreen from "../components/Partials/SplashScreen";
import ProductDetails2 from "../pages/store/ProductDetails2";
import CreateArticles from "../pages/Dashboard/CreateArticles";
import NewsPageDashboard from "../pages/Dashboard/NewsPage";
import EditArticle from '../components/Partials/EditArticle';
import Articles from '../pages/Dashboard/Articles';
import MatchDetailsPage from "../pages/MatchDetailsPage";
import NBANewsHub from "../pages/NewsPage";



// Paths — imported for local use and re-exported for consumers
import * as Paths from "./paths";
export * from "./paths";
const { LOGINSTORE, REGISTERSTORE, HOME, ABOUT, NEWS, STORE, DASHBOARD, ADMIN, PRODUCT, CATEGORIES, SUBCATEGORIES, ORDERS, CREATE_ARTICLES, ARTICLES_CONTENT, CART, CHECKOUT, WISHLIST, ALLPRODUCTS, ALL_CATEGORIES, PRODUCT_DETAIL, PRODUCT_CREATE, TEXT_FILL_LOADING, ADMIN_CREATE, USER_DETAIL, PLAYERS, TEAMS, PLAYERS_CREATE, PLAYERS_EDIT, TEAMS_CREATE, LOGIN, MATCH_DETAIL } = Paths;

// Router config
export const router = createBrowserRouter([
    {
        element: <SiteLayout />,
        children: [
            { path: HOME, element: <HomeSite /> },
            { path: ABOUT, element: <About /> },
            { path: NEWS, element: <NBANewsHub /> },
            { path:MATCH_DETAIL , element: <MatchDetailsPage/> },
            { path: TEXT_FILL_LOADING, element: <TextFillLoadingExample /> },
        ],
    },
    {
        element: <StoreLayout />,
        children: [
            { path: STORE, element: <Store /> },
            { path: PRODUCT_DETAIL(':id'), element: <ProductDetails2 /> },
            { path: ALLPRODUCTS, element: <Products/> },
            { path: ALL_CATEGORIES, element: <AllCategories /> },
            { path: CART , element: <Cart /> }, 
            { path: WISHLIST, element: <Wishlist /> },
            { path: REGISTERSTORE, element: <RegisterForm /> },
            { path: LOGINSTORE, element: <LoginForm /> },
            { path: CHECKOUT, element: <Checkout /> },
        ],
    },
    {
        element: <DashboardLayout />,
        children: [
            { path: DASHBOARD, element: <Home /> },
            { path: ADMIN_CREATE, element: <AddAdmin /> },
            { path: ADMIN, element: <ListAdmins /> },
            { path: USER_DETAIL, element: <DetailUtilisateur /> },
            { path: PRODUCT, element: <ListProducts /> },
            { path: PRODUCT_CREATE, element: <AddProduct /> },
            { path: CATEGORIES, element: <Categories /> },
            { path: SUBCATEGORIES, element: <SubCategories /> },
            { path: ORDERS, element: <OrdersPage /> },
            { path: PLAYERS, element: <Players /> },
            { path: PLAYERS_CREATE, element: <PlayerForm /> },
            { path: PLAYERS_EDIT(":id"), element: <PlayerForm mode="edit" /> },
            { path: TEAMS, element: <Teams /> },
            { path: TEAMS_CREATE, element: <TeamForm /> },
            {path: CREATE_ARTICLES, element: <CreateArticles />},
            {path: ARTICLES_CONTENT, element: <NewsPageDashboard />},
            { path: "/articles", element: <Articles /> },
            { path: "/articles/edit/:id", element: <EditArticle /> },
        ],
    },
    {
        path: LOGIN, element: <LoginPage />
    }

    
    
]);
