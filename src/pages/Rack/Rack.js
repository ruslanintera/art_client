
import io from 'socket.io-client';

import React, {useContext, useEffect, useState } from 'react';
import {Container} from "react-bootstrap";

import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
//import Button from "react-bootstrap/Button";

import {useHistory} from "react-router-dom"

import {observer} from "mobx-react-lite";
import {Context} from "../../index";

import {fetchRack, fetchRackCreate, fetchRackUpdate, fetchOneRack, fetchRackDelete } from "../../http/commAPI";
import RackList from "./RackList";
import PagesRack from "./PagesRack";
import { RACK_ROUTE } from "../../utils/consts";



const Rack = observer(() => {
    const {device} = useContext(Context)
    const history = useHistory()
	const [oneValue, setOneValue] = useState({name: ''})
	//alert("RACK")
    useEffect(() => {
        fetchRack(null, null, device.getRackPage, device.getRackLimit).then(data => {
            //console.log("data.rows = ", data.rows, "data.count = ", data.count)
			device.setRack(data.rows)
            device.setRackTotal(data.count)
			//device.getRack.map(obj =>console.log("obj ========", obj))
        })
    }, [])

    useEffect(() => {
        //console.log("useEffect    device.getRackPage = ", device.getRackPage)
		fetchRack( null, null, device.getRackPage, device.getRackLimit).then(data => {
            device.setRack(data.rows)
            device.setRackTotal(data.count)
        })
    }, [device.getRackPage])

	async function CREATE(event) {
        const data = await fetchRackCreate(oneValue); //
		//console.log("CREATE data = =  = = =", data); //console.log("CREATE data.id = =  = = =", data.id)
        history.push(RACK_ROUTE + '/' + data.id)
    }

    return (
        <div className="work_page navbar1 ">
        <Container>
            
            <Tabs className="mt-3 work_page_content" defaultActiveKey="tab_page_1" id="uncontrolled-tab-example">
                <Tab className="p-1" eventKey="tab_page_1" title="Rack">
					<h4><strong>RACKS</strong></h4>

					<Row className="mt-2">
						<Col md={3}>

						</Col>
						<Col md={9}>
							<PagesRack />
							<RackList/>

						</Col>
					</Row>

                </Tab>
                <Tab className="p-1" eventKey="tab_page_2" title="Profile">
					<Container>
						<br></br>
						<h4><strong>ffffffffff6666666666666666666666666666666666 7777</strong></h4>
						

	<div>window.innerHeight = {window.innerHeight}</div>
    <div>window.innerWidth = {window.innerWidth}</div>
    <div>document.body.clientHeight = {document.body.clientHeight}</div>
    <div>document.body.clientWidth = {document.body.clientWidth}</div>
    <div> window.screen.height = { window.screen.height}</div>
    <div> window.screen.width = { window.screen.width}</div>
    <div>window.screen.availHeight = {window.screen.availHeight}</div>
    <div>window.screen.availWidth = {window.screen.availWidth}</div>


					</Container>

                </Tab>
                <Tab className="p-1" eventKey="tab_page_3" title="Contact">
					<h4><strong>ffffffffff 222</strong></h4>
                    efwewefwefe efe


                </Tab>
            </Tabs>            
            
		</Container>

		<Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>CREATE</Button>

        </div>
    );
});



export default Rack;



/**
            <form className="form-register" id="form-register" action="#" method="post">
		        	<div id="form-total" style={{ background: "#555" }}>

			            <section>
			                <div className="inner">
			                	<div className="form-heading">
			                		<h3>Personal Info</h3>
			                		<span>1/3</span>
			                	</div>
								<div className="form-row">
									<div className="form-holder">
										<label className="form-row-inner">
											<input type="text" className="form-control" id="first_name" name="first_name" required/>
											<span className="label">First Name</span>
										</label>
									</div>
									<div className="form-holder">
										<label className="form-row-inner">
											<input type="text" className="form-control" id="last_name" name="last_name" required/>
											<span className="label">Last Name</span>
										</label>
									</div>
								</div>
								<div className="form-row">
									<div className="form-holder">
										<label className="form-row-inner">
											<input type="text" className="form-control" id="phone" name="phone" required/>
											<span className="label">Phone Number</span>
										</label>
									</div>
									<div className="form-holder">
										<label className="form-row-inner">
											<input type="text" name="your_email_1" id="your_email_1" className="form-control"  required/>
											<span className="label">E-Mail</span>
										</label>
									</div>
								</div>

							</div>
			            </section>

			            <h5>
			            	<span className="step-text">Booking</span>
			            </h5>
		        	</div>
		        </form>


<div className="inner">
    <div className="form-row">
		<div className="form-holder form-holder-2-555">
			<label htmlFor="room" className="special-label-1-555">Choose a Room </label>
			<select name="room" id="room" className="form-control">
				<option value="Daily Design Metting - Metting Room No.1" defaultValue>Daily Design Metting - Metting Room No.1</option>
				<option value="Single">Single</option>
				<option value="Double">Double</option>
			</select>
		</div>
	</div>
</div>
 /**/
