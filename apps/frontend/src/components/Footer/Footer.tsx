import { FooterProps, Footer } from "@nasapds/wds-react";

function PortalFooter({
  pageLastUpdated,
  primaryLinks,
  secondaryLinks
}:FooterProps) {

  return (
    <Footer primaryLinks={primaryLinks} secondaryLinks={secondaryLinks} pageLastUpdated={pageLastUpdated}/>
  )
}

export default PortalFooter;