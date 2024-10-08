import { Helmet } from 'react-helmet-async';
import favicon16 from "../../assets/favicons/favicon-16x16.png";
import favicon32 from "../../assets/favicons/favicon-32x32.png";
import favicon57 from "../../assets/favicons/favicon-57x57.png";
import favicon76 from "../../assets/favicons/favicon-76x76.png";
import favicon96 from "../../assets/favicons/favicon-96x96.png";
import favicon128 from "../../assets/favicons/favicon-128x128.png";
import favicon192 from "../../assets/favicons/favicon-192x192.png";
import favicon196 from "../../assets/favicons/favicon-196x196.png";
import favicon228 from "../../assets/favicons/favicon-228x228.png";

export type DocumentMetaProps = {
  title: string;
  description: string;
}

export const DocumentMeta = (props:DocumentMetaProps) => {

  const {title, description} = props;

  return (
    <Helmet
    link={[
      {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon16
      },
      {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon32
      },
      {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon57
      },
      {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon76
      },
      {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon96
       },
       {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon128
       },
       {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon192
       },
       {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon196
       },
       {
        "rel": "icon", 
        "type": "image/png", 
        "href": favicon228
       }
     ]}>
      <title>PDS | {title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );

};