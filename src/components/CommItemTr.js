import React from 'react';
import {Card, Col} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png'
import {useHistory} from "react-router-dom"
import {COMM_ROUTE, COMM_ROUTE_PAGE} from "../utils/consts";

const CommunityItem = ({community}) => {
    const history = useHistory()
    return (

        <tr>
            <td className={"mt-3 comm_num"} onClick={() => history.push(COMM_ROUTE_PAGE + '/' + community.community_id)}>{community.community_id}</td>
            <td>{community.Country_Name}</td>
            <td>{community.County_Name}</td>
            <td className="community_name">{community.Community_Name}</td>
            <td>{community.RS_ID}</td>
            <td>{community.ST_ID}</td>
            <td>{community.DWS_ID}</td>
            <td>{community.WST_ID}</td>
            <td>{community.MSW_ID}</td>
        </tr>


    );
};

export default CommunityItem;
