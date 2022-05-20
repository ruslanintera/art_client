import React from "react";
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from "../../assets/star.png";
import { useHistory } from "react-router-dom";
import { SET_ROUTE } from "../../utils/consts";

const DCItem = ({ obj }) => {
  const history = useHistory();
  return (
    <tr>
      <td
        className={"mt-3 comm_num"}
        onClick={() => history.push(SET_ROUTE + "/" + obj.id)}
      >
        {obj.id}
      </td>
      <td className="community_name">{obj.name}</td>
      <td className="community_name">{obj.adress}</td>
      <td className="community_name">{obj.model3d}</td>
      <td className="community_name">{obj.updatedAt}</td>
    </tr>
  );
};

export default DCItem;
