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
        <Col md={3} className={"mt-3"} onClick={() => history.push(DEVICE_ROUTE + '/' + community.id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
                
                    <div>community_id = {community.community_id}</div>
                    <div>community_name = {community.community_name}</div>
                    <div>country_id = {community.country_id}</div>
                    <div>regional_specificity = {community.regional_specificity}</div>
                    <div>settlement_type = {community.settlement_type}</div>
                    <div>dws_id = {community.dws_id}</div>
                    <div>wst_id = {community.wst_id}</div>
                    <div>msw_id = {community.msw_id}</div>

                <div className="text-black-50 mt-1 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div>{community.rating}</div>


                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
            </Card>
        </Col>
    );
};

export default CommunityItem;
