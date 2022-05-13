import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
//import DeviceItem from "./DeviceItem";
import CommunityItem from "./CommunityItem";
import CommunityItemTr from "./CommunityItemTr";

import DataGrid from 'react-data-grid';


const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
  ];
  
  let rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo 1' },
    { id: 2, title: 'Demo 2' },
    { id: 3, title: 'Demo 3' },
  ];


const CommunityList = observer(() => {
    const {device} = useContext(Context)
    //console.log("Component CommunityList: device", device)
    //console.log("Component CommunityList: device.communities", device.communities)

    rows = device.communities.map(community =>
        { return {"id": community.community_id, "title": community.community_name } } )

    //console.log("rows = ", rows);

    const onClickRow = rowInfo => {
        //console.log("row info is: ", rowInfo);
    };

    return (
        <>
        <table>
            <thead>
                <tr>
                <th>#</th>
                <th>name</th>
                <th>country</th>
                <th>RS</th>
                <th>ST</th>
                <th>DWS</th>
                <th>WST</th>
                <th>MSW</th>
                <th>Brand</th>
                <th>Type</th>
                </tr>
            </thead>
            <tbody>
                {device.communities.map(community =>
                    <CommunityItemTr key={community.community_id} community={community}/>
                )}
            </tbody>
        </table>

        <DataGrid
            columns={columns}
            rows={rows}
            onRowsSelected={onClickRow}
            />

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
