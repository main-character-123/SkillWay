import { Link } from "react-router-dom";

export default function SectionsHeads(props) {
  return (
    <div className="center-flex flex-wrap mt-5" id={props.id}>
      <div className="d-flex flex-column col-md-10 col-12 mb-3">
        <h2 className="w-100">{props.title}</h2>
        <p className="my-1 text-muted">{props.description}</p>
      </div>

      <Link to={props.to} className="col-md-2 col-12 text-md-end my-3 p-0">
        {props.content}
      </Link>
    </div>
  );
}
