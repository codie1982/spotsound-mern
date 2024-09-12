import React from 'react'
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom";
export default function Header() {
  const [t, i18n] = useTranslation("global")
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link to={"/"} className="navbar-brand" href="#"><img src={"https://spotsound-cdn.s3.eu-central-1.amazonaws.com/site-meta/brand.png?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEHoaDGV1LWNlbnRyYWwtMSJHMEUCIQDN9il%2BeDe8utUtjMU9dF30QdixWsKMqc3ippM6BwhgeAIgda5MBJ2LU%2FuDLysBrIY0SbakFVttHeFaZYh1HmgQisAq8QIIo%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARAAGgw2OTI4NTk5MTY2MzciDE0vCwBFwpBmob02CCrFApZ2Rqr7W9elo6BEXVXuN1wmFXY8SKYDkaRNBz7ZzVWNEgb58H3iZc%2BjpM1IkDR0hxFvulGf0vg%2Fvh1yhg6oJB%2BFM%2FRw18OzVYtYLdLYOoJ4HAX8qXGxzMYIXpbckzzEQ%2BAKI%2F2DyV7FqSo1GSmgBjNKbLDEKkXIcn7naMpHP%2FrvY%2BMUYN4K3M4PXqaNVP7RuxaIBPdhicn%2FepS6m0YdblG29zrjl4dTGkhZ1YCEDKlMD6l6QHAuQIY4H80xHFSDQM1Tm9nbdRdbp8R7%2BISlS4JtMTswKyusuNh7N%2FYkkmPPbPTu0%2Bf8QXJuw7PhoHmp2%2FSkq%2FPoEOf%2BMy%2FM9jdE2rvrmdkY9OMs4%2Fc9pHI8b4R%2Fy4qNa0KhPMaDID91dZ5O%2BDDGlBKKYu%2BwfTGLWwCKAjrb0RzlefEgTFFisa%2BrZBbFvRnR2ZYwxemKtwY6swJTWRDqgHTd0bKbt0e5b9GeUV5FKNg9Rv%2BXTsXvLHysFMhk2oTpNQOXa9%2FsAG21n54QJdDel3KCuGLOXvJF7qaQdF1MM5KHBWa8GsvQwOqIGG2CPp0PwNdIBJI8LtPx3To4o1%2Bjg3nYvt3Fvdjtr4URArGiZKUuOC9XYsW3wxHqViQ8cs4Cd4c2PZSKlCxb6xFSPeqzmiiB8MM6fRL61fZ2zD8j3%2FiWH20jIPXhn%2BVTQMBpP9J89vQV%2Ft1iWBm6GUXSGaWrQfwkOz7l7%2FU5Vu2XiRWo%2BO%2BpQb9DQYUs92Nhw169IFd7sSIVDyrNbqtrTn2KOChbxaPqoAGplSipxPuxonZQWc%2FJyCWVzPzPBWdWef0GX%2FnIZIc98vEhsNta5Ljw8eJmdVOOg7ylJl%2FsuK35DdXD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20240912T100223Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2CUNLKFO6GAMUIG6%2F20240912%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Signature=47cbc0f19ff4e475d9c680be5ce35ee99b1504182c0e86a245d2e76cdc0276f6"} /></Link>
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
