import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
//import Col from "react-bootstrap/Col";
//import ListGroup from "react-bootstrap/ListGroup";
import {Button, Dropdown, Form, Row, Col, ListGroup} from "react-bootstrap";
//import './components.css';

const TypeBar = observer(() => {
    const {device} = useContext(Context)
    //console.log("Component TypeBar: device._types", device._types)
    return (
        <>
        <ListGroup>
            {device.types.map(type =>
                <ListGroup.Item
                    style={{cursor: 'pointer'}}
                    active={type.id === device.selectedType.id}
                    onClick={() => device.setSelectedType(type)}
                    key={type.id}
                >
                    {type.name}
                </ListGroup.Item>
            )}
        </ListGroup>

        <Dropdown className=" mt-2 mb-2">
            <Dropdown.Toggle className="mydropdown " >{device.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
            <Dropdown.Menu>
                {device.types.map(type =>
                    <Dropdown.Item 
                        onClick={() => device.setSelectedType(type)}
                        key={type.id}
                        >
                        {type.name}
                    </Dropdown.Item>
                    )}
                </Dropdown.Menu>
        </Dropdown>
        
        </>
    );
});

export default TypeBar;
