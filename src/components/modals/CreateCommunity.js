import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Form, Button} from "react-bootstrap";
import {createCommunity} from "../../http/communityAPI";

const CreateCommunity = ({show, onHide}) => {
    const [value, setValue] = useState('')
    const [country_id, setCountry_id] = useState(6)

    const addCommunity = () => {
        createCommunity({community_name: value, country_id}).then(data => {
            setValue('')
            setCountry_id(6)
            onHide()
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить тип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value} onChange={e => setValue(e.target.value)} placeholder={"Введите название типа"}
                    />
                    <Form.Control
                        value={country_id}
                        onChange={e => setCountry_id(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите страну (номер)"
                        type="number"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрыть</Button>
                <Button variant="outline-success" onClick={addCommunity}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCommunity;
