import React from 'react';
import {Card, Col} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png'
import {useHistory} from "react-router-dom"
import {DEVICE_ROUTE} from "../utils/consts";
//<Image width={150} height={150} src={process.env.REACT_APP_API_URL + community.img}/>
//{community_id: 1, community_name: "111", country_id: 1, regional_specificity: 1, settlement_type: 1, dws_id: 1, wst_id: 1, msw_id: 1 }, 

const CommunityItem = ({community}) => {
    const history = useHistory()
    return (

        <tr>
            <td className={"mt-3"} onClick={() => history.push(DEVICE_ROUTE + '/' + community.id)}>{community.community_id}</td>
            <td className="community_name">{community.community_name}</td>
            <td>{community.country_id}</td>
            <td>{community.regional_specificity}</td>
            <td>{community.settlement_type}</td>
            <td>{community.dws_id}</td>
            <td>{community.wst_id}</td>
            <td>{community.msw_id}</td>
            <td>{community.brandId}</td>
            <td>{community.typeId}</td>
        </tr>

    );
};

export default CommunityItem;
