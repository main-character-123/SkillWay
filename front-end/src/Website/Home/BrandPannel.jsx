import brandImagesData from "../../Data/brandImagesData";
import { Col, Row } from "react-bootstrap";

export default function BrandPannel() {
  const showBrands = brandImagesData.map((brand, id) => (
    <Col key={id}>
      <img src={`/Assets/brands/${brand.image}`} alt={`brand ${brand.id}`} />
    </Col>
  ));

  return (
    <Row className="py-4 px-3 my-5 text-center bg-light">{showBrands}</Row>
  );
}
