import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {Pagination} from "react-bootstrap";

const PagesRack3d = observer(() => {
    const {device} = useContext(Context)
    const pageCount = Math.ceil(device.getRack3dTotal / device.getRack3dLimit)
    const pages = []

    for (let i = 0; i < pageCount; i++) {
        pages.push(i + 1)
    }
    
    return (
        <Pagination className="mt-3">
            {pages.map(page =>
                <Pagination.Item
                    key={page}
                    active={device.getRack3dPage === page}
                    onClick={() => device.setRack3dPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    );
});

export default PagesRack3d;
