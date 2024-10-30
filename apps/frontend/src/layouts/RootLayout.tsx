import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { APP_CONFIG } from "src/AppConfig";
import { Banner } from "@nasapds/wds-react";
import { Outlet } from "react-router-dom";
import { ScrollRestoration } from "react-router-dom";

function RootLayout() {

  const bannerMessages = APP_CONFIG["GENERAL"]["BANNER_MESSAGES"];

  return (
    <>
      {
        bannerMessages.map( (banner, bannerIndex) => {
          return <Banner
            title={banner.title}
            message={banner.message}
            link={banner.link}
            variant={banner.variant}
            key={"banner_" + bannerIndex}
          />
        })
      }
      <Header />
      <div style={{ backgroundColor: "white", padding: "0px", color: "black" }}>
        {/* A "layout route" is a good place to put markup you want to
            share across all the pages on your site, like navigation. */}

        {/* An <Outlet> renders whatever child route is currently active,
            so you can think about this <Outlet> as a placeholder for
            the child routes we defined above. */}
        <Outlet />
      </div>
      <Footer />
      <ScrollRestoration />
    </>
  );
}

export default RootLayout;
