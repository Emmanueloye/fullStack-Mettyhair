import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    :root {
        --main-red-50: #f7ecf0;
        --main-red-100: #eedae0;
        --main-red-150: #ddb4c1;
        --main-red-200: #cc8fa3;
        --main-red-300: #bb6984;
        --main-red-400: #b35774;
        --main-red-500: #AA4465;
        --main-red-600: #993d5b;
        --main-red-700: #66293d;
        --main-red-800: #441b28;
        --main-light-blue: #F0F1FD;
        --main-light-blue-1: #f1f5f9;
        --main-light-blue-2:#dbeafe;
        --main-blue: #B4BAF4;
        --main-black-500: #64748b; 
        --main-black: #475569; //600
        --main-black-700: #334155; //700
        --main-black-800: #1e293b;
        --main-black-900: #0f172a;
        --white: #ffffff;
        --grey: #F0F0F0;
        --grey-2:#e5e7eb;

        /* Main color theme */
        --primary-bg:var(--main-bg);
        --primary-color: var(--main-red-500);
        --primary-text-white: var(--main-light-blue);
        --secondary-text-white: var(--main-red-100);
        --primary-text-black: var(--main-black);
        --primary-blue: var(--main-blue);
        --body-bg: var(--main-light-blue);
        --cart-btn-bg: var(--main-red-400);
        --primary-white:var(--white);
        
        /* Admin side Colors */
       &, &.light-mode {
        --admin-primary-color:var(--main-red-500);
        --admin-alt-color:var(--main-light-blue);
        --admin-sec-bg:var(--main-red-700);
        --admin-text-color:var(--main-red-50);
        --admin-sec-text-color:var(--main-black-800); //work on white
        --admin-sec-text:#cbd5e1;
        --admin-white:var(--white);
        --admin-input-bg: var(--grey-2);
        }

       
        &.dark-mode {
            --admin-primary-color: var(--main-black-800);
            --admin-alt-color:var(--main-black-700);
            --admin-sec-bg:var(--main-black-700);
            --admin-text-color:var(--main-light-blue-1);
            --admin-white:var(--main-black-800);
            --admin-sec-text-color:var(--main-light-blue); //work on white
             --admin-sec-text:var(--main-red-200);
             --admin-input-bg: var(--main-black);
            
            
        }

        /* border radius */
        --border-radius-thin:.3rem;
        --border-radius-sm: 1rem;
        --border-radius-md: 1.5rem;
        --border-radius-lg:2rem;
        --rounded: 50%;

        /* box shadow */
        --shadow:0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        --shadow-sm:0 1px 2px 0 rgb(0 0 0 / 0.05);
        --shadow-md:0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        --shadow-lg:0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
        --shadow-rd: 0px 0px 10px rgba(0,0,0, .2);

        --transition: all 0.5s ease-in-out;
    }

    * {
        box-sizing: border-box;
        margin:0;
        padding:0;
        transition:background-color .3s ease-in-out;
    }
    html {
        font-size:62.5%
    }
    body {
        font-family: 'Lato', sans-serif;
        font-weight: 400;
        font-size:1.2rem;
        color:var(--primary-text-black);
        background-color:var(--body-bg);
        min-height:100vh;
    }
    li {
        list-style:none;
    }
    img {
        max-width: 100%;
        vertical-align: middle;
    }
    a {
        text-decoration: none;
        color: var(--primary-text-black);
    }
    h1,
    h2, 
    h3, 
    h4, 
    h5 {
        line-height: 1.5;
        /* text-align:justify; */
    }
   h1 {
        font-size: 2.5rem;
    }
    h2 {
        font-size: 3.5rem;
    }
    h3 {
        font-size: 3rem;
    }
    h3 {
        font-size: 2.5rem;
    }
    h4 {
        font-size: 2rem;
    }
    h5 {
        font-size: 1.5rem;
    }
        
    p {
        font-size: 1.4rem;
        line-height: 1.5;
        text-align:justify;
    }
    small {
        display:block;
        font-size:1rem
    }
    .text-center{
        text-align:center;
    }
    .main {
        min-height:50vh; // revisit
        /* padding-top:8rem; */
    }
    .header {
        position:relative;
    }
    ::placeholder{
        font-size:1.4rem;
        font-family:'Lato' sans-serif;
    }
    .mt-3{
        margin-top:3rem;
    }
    .mt-5{
        margin-top:5rem;
    };
    .mb-2 {
        margin-bottom:2rem
    }
    .mb-1   {
        margin-bottom:1rem
    }
    .capitalize {
        text-transform:capitalize
    }
    .fw-500 {
        font-weight:600
    }
    .accessmgr-group {
         border-bottom: 2px solid var(--main-red-700);
         padding:1rem;
    }
    .lowercase{
        text-transform:lowercase
    }
    .fs-14 {
        font-size:1.4rem;
    }
    .pending, .confirmed, .delivered{
        background-color: var(--main-red-500);
        border-radius: var(--border-radius-md);
        color:var(--white);
        padding:.5rem 1.3rem;
    }
    .confirmed{
        background-color: #765414
    }
    .delivered {
        background-color: #059669
    }
    .invoice {
        margin-bottom:2rem;
        font-size:1.4rem;
        p {
        background-color:var(--main-red-100);
        border-radius:var(--border-radius-sm);
        font-weight:600;
        margin-left:1rem;
        padding:.5rem 1rem;
        }
    }
    .error {
        margin:4rem auto 5rem;
        .center {
            flex-direction:column;
            display:flex;
            align-items:center;
            justify-content:center;
            padding:13rem 2rem;
        }
        h1 {
            font-size:4rem;
            margin-bottom:2rem
        }
        h3, h4 {
            margin-bottom:1.5rem;
        }
        p{
            font-weight:600;
            margin-bottom:1rem;
        }
        
        li {
            list-style: square;
            font-size:1.4rem;
            margin-bottom:1rem
         }
        
    }
    .search-flex{
        display:flex;
        justify-content:space-between;
        flex-wrap:wrap;
        margin-bottom:2rem;
        
    }
    .rounded-img {
        border-radius:50%;
    }
    .pimg{
        border-radius:var(--border-radius-md)
    }
    
    @media screen and (min-width: 1024px ) {
    h1 {
        font-size:2.3rem
    }
    p {
        font-size: 1.6rem;
        
       
    }
    }

    @keyframes appear {
        from {
            opacity:0;
            scale: 0.5;
            /* transform:translateX(-100); */
        }
        to {
            opacity:1;
            scale:1;
            /* transform:translateX(0); */
        }
    }
    .scaleIn {
        animation: appear linear;
        animation-timeline: view();
        animation-range: entry 0% cover 31%;
    }

`;

export default GlobalStyle;
