import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

import RackItemTr from "./RackItemTr";

//import DataGrid from 'react-data-grid';

const CommunityList = observer(() => {
    const {device} = useContext(Context)

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
                </tr>
            </thead>
            <tbody>
                {device.getRack.map(obj =>
                    <RackItemTr key={obj.id} obj={obj}/>
                )}
            </tbody>
        </table>

        </>
    );
});

/**

*/


export default CommunityList;