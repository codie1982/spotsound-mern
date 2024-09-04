import React from 'react'
import { useTranslation } from "react-i18next"
import brand from "../../assets/images/brand.png"
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useLocation,
    Navigate,
    Outlet,
    useSearchParams,
  } from "react-router-dom";
export default function Header() {
    const [t, i18n] = useTranslation("global")
  return (
    <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link to={"/"} className="navbar-brand" href="#"><img src={brand} /></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/abouth" className="nav-link text-warning" aria-current="page">{t("header.menu.abouth")}</Link>
                </li>
                <li className="nav-item">
                  <Link to={"/contact"} className="nav-link text-warning" aria-current="page">{t("header.menu.contact")}</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
  )
}
