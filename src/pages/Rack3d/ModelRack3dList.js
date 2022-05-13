import React, { useState, useContext } from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

import ModelRack3dItemTr from "./ModelRack3dItemTr";

//create your forceUpdate hook
function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}
//import DataGrid from 'react-data-grid';

const CommunityList = observer(() => {
    const {device} = useContext(Context)
    // call your hook here
    const forceUpdate = useForceUpdate();

    const onClickRow = rowInfo => {
        //console.log("row info is: ", rowInfo);
    };

    return (
        <>
        <table>
            <thead>
                <tr>
                <th>#</th>
                <th>model_unid</th>
                <th>name</th>
                </tr>
            </thead>
            <tbody>

                {device.getModelRack3dForPageNumber.map(obj =>
                    <ModelRack3dItemTr key={obj.id} obj={obj} forceUpdate={forceUpdate}/>
                )}

            </tbody>
        </table>

        </>
    );
});

/**

*/


export default CommunityList;
