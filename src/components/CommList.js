import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";

import CommItemTr from "./CommItemTr";

//import DataGrid from 'react-data-grid';

const CommunityList = observer(() => {
    const {device} = useContext(Context)
    //console.log("Component CommunityList: device", device)
    //console.log("Component CommunityList: device.communities", device.communities)

    const onClickRow = rowInfo => {
        //console.log("row info is: ", rowInfo);
    };

    return (
        <>
        <table>
            <thead>
                <tr>
                <th>#</th>
                <th>Country_Name</th>
                <th>County_Name</th>
                <th>Community_Name</th>
                <th>RS_ID</th>
                <th>ST_ID</th>
                <th>DWS_ID</th>
                <th>WST_ID</th>
                <th>MSW_ID</th>

                </tr>
            </thead>
            <tbody>
                {device.comm.map(community =>
                    <CommItemTr key={community.community_id} community={community}/>
                )}
            </tbody>
        </table>

        </>
    );
});

/**
        <Row className="d-flex">
            {device.communities.map(community =>
                <CommunityItem key={community.community_id} community={community}/>
            )}
        </Row>
 */


export default CommunityList;
