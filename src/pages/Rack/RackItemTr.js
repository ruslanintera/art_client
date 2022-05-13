import React from 'react';
import {Card, Col} from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../../assets/star.png'
import {useHistory} from "react-router-dom"
import { RACK_ROUTE } from "../../utils/consts";


const RackItem = ({obj}) => {
    //console.log("objobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobjobj ", obj);
    const history = useHistory()
    return (

        <tr>
            <td className={"mt-3 comm_num"} onClick={() => history.push(RACK_ROUTE + '/' + obj.id)}>{obj.id}</td>
            <td className="community_name">{obj.name}</td>
        </tr>


    );
};

export default RackItem;
