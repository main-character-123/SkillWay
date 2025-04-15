import { Link, useLocation } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

export default function Breadcrumbs({ title }) {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb className="my-3">
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const isLast = index === pathSegments.length - 1;

        return isLast ? (
          <Breadcrumb.Item key={path} active>
            {title || decodeURIComponent(segment)}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={path} linkAs={Link} linkProps={{ to: path }}>
            {decodeURIComponent(segment)}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
