import { Helmet } from 'react-helmet-async';

export type DocumentMetaProps = {
  title: string;
  description: string;
}

export const DocumentMeta = (props:DocumentMetaProps) => {

  const {title, description} = props;

  return (
    <Helmet>
      <title>PDS | {title}</title>
      <meta name="description" content={description} />
    </Helmet>
  );

};