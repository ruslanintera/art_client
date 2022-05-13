
//import io from 'socket.io-client';
import React, {useContext, useEffect, useState } from 'react';
import {Container} from "react-bootstrap";
import { Row, Col, Tabs, Tab, Button } from "react-bootstrap";
import {useHistory} from "react-router-dom"
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {fetchDC, fetchDCCreate } from "../../http/commAPI";
import DCList from "./DCList";
import PagesDC from "./PagesDC";
import { DC_ROUTE } from "../../utils/consts";

const DC = observer(() => {
    const {device} = useContext(Context)
    const history = useHistory()
	const [oneValue, setOneValue] = useState({name: '', adress: '', model3d: '', color: '', params1: '', params2: '', params3: ''})

	useEffect(() => {
        fetchDC(null, null, null, null, null, device.getDCPage, device.getDCLimit).then(data => {
			device.setDC(data.rows)
            device.setDCTotal(data.count)
        })
    }, [])

    useEffect(() => {
		fetchDC( null, null, null, null, null, device.getDCPage, device.getDCLimit).then(data => {
            device.setDC(data.rows)
            device.setDCTotal(data.count)
        })
    }, [device.getDCPage]) 

	async function CREATE(event) {
        const data = await fetchDCCreate(oneValue); //
        history.push(DC_ROUTE + '/' + data.id)
    }

    return (
        <div className="work_page navbar1 ">
        <Container>
            
            <Tabs className="mt-0 work_page_content" defaultActiveKey="tab_page_1" id="uncontrolled-tab-example">
                <Tab className="p-1" eventKey="tab_page_1" title="DC">
					<h4><strong>DCS</strong></h4>

					<Row className="mt-2">
						<Col md={3}>

						</Col>
						<Col md={9}>
							<PagesDC />
							<DCList/>

						</Col>
					</Row>

                </Tab>
                <Tab className="p-1" eventKey="tab_page_2" title="Tab2">
					<Container>
						<h4>Tab2</h4>
						
					</Container>

                </Tab>
                <Tab className="p-1" eventKey="tab_page_3" title="Tab3">
					<h4>Tab3</h4>


                </Tab>
            </Tabs>            
            
		</Container>

		{/* <Button className="mt-1 ml-1 danger" onClick={(e) => CREATE(e)}>CREATE</Button> */}

        </div>
    );
});



export default DC;



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
