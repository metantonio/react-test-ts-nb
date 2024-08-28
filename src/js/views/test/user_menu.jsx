import React, { useEffect, useContext, useState } from "react";
import { Context } from "../../store/appContext";
import 'tailwindcss/tailwind.css';
import styles from "./clean.module.css";
import { Menu, MenuItem, MenuButton, SubMenu } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

const IconWrapper = ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} />
);

const UserMenu = () => {
    const { store, actions } = useContext(Context)

    return (
        <div className={`${styles.user_info}`}>
            <div className={`${styles.user_details}`}>
                <div className={`${styles.user_avatar}`}>{store.userpoker.email[0].toUpperCase()}</div>
                <div className={`${styles.user_name}`}>{store.userpoker.email}</div>
            </div>
            <Menu
                menuButton={<MenuButton className={`${styles.background_button}`}>
                    <svg fill-opacity="0.48" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="CaretUpDown"><path id="Vector" d="M11.5306 10.4694C11.6005 10.5391 11.656 10.6219 11.6938 10.713C11.7317 10.8042 11.7512 10.9019 11.7512 11.0006C11.7512 11.0993 11.7317 11.1971 11.6938 11.2882C11.656 11.3794 11.6005 11.4622 11.5306 11.5319L8.5306 14.5319C8.46092 14.6018 8.37813 14.6573 8.28696 14.6951C8.1958 14.733 8.09806 14.7525 7.99935 14.7525C7.90064 14.7525 7.8029 14.733 7.71173 14.6951C7.62057 14.6573 7.53778 14.6018 7.4681 14.5319L4.4681 11.5319C4.3272 11.391 4.24805 11.1999 4.24805 11.0006C4.24805 10.8014 4.3272 10.6103 4.4681 10.4694C4.60899 10.3285 4.80009 10.2493 4.99935 10.2493C5.19861 10.2493 5.3897 10.3285 5.5306 10.4694L7.99997 12.9375L10.4693 10.4675C10.5391 10.3979 10.6219 10.3427 10.7131 10.3051C10.8042 10.2676 10.9018 10.2483 11.0004 10.2485C11.0989 10.2487 11.1965 10.2683 11.2875 10.3062C11.3784 10.3441 11.4611 10.3995 11.5306 10.4694ZM5.5306 5.53189L7.99997 3.06251L10.4693 5.53251C10.6102 5.67341 10.8013 5.75256 11.0006 5.75256C11.1999 5.75256 11.391 5.67341 11.5318 5.53251C11.6727 5.39161 11.7519 5.20052 11.7519 5.00126C11.7519 4.802 11.6727 4.61091 11.5318 4.47001L8.53185 1.47001C8.46217 1.40009 8.37937 1.34461 8.28821 1.30676C8.19705 1.26891 8.09931 1.24942 8.0006 1.24942C7.90189 1.24942 7.80415 1.26891 7.71298 1.30676C7.62182 1.34461 7.53903 1.40009 7.46935 1.47001L4.46935 4.47001C4.32845 4.61091 4.2493 4.802 4.2493 5.00126C4.2493 5.20052 4.32845 5.39161 4.46935 5.53251C4.61024 5.67341 4.80134 5.75256 5.0006 5.75256C5.19986 5.75256 5.39095 5.67341 5.53185 5.53251L5.5306 5.53189Z" fill="#1A1A1A"></path></g></svg>
                </MenuButton>}
                key={"top"}
                direction={"top"}
                align={"end"}
                position={"anchor"}
                viewScroll={"auto"}
                arrow={true}
                gap={12}
                shift={0}
                className={`${styles.background_button}`}
            >
                <MenuItem key="logout">
                    <button className={`${styles.background_button} ${styles.nav_text}`} onClick={(e) => { actions.logOut() }}>
                        Logout
                    </button>
                </MenuItem>
            </Menu>
        </div>
    )
}

export default UserMenu;