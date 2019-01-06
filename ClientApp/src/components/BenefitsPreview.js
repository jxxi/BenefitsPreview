import React, { Component } from 'react';
import { Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, Row, Table } from 'react-bootstrap';

export class BenefitsPreview extends Component {
    displayName = BenefitsPreview.name

    constructor(props) {
        super(props);

        this.state = {
            numEmployees: 0,
            selectValue: 1,
            employees: [{}],
            dependents: {},
            quote: null
        };
    }

    applyNameDiscount = (user) => {
        if(user.firstName.startsWith("A")) {
            user.discount = .10 * user.cost;
        }

        else {
            user.discount = 0;
        }
    }

    addNumEmployees = e => {
        this.setState({ numEmployees: this.state.selectValue });
    }

    handleChange = e => {
        this.setState({ selectValue: e.target.value });
    }

    updateFirstName = (empNum, event) => {
        let employee = this.state.employees.find(emp => emp.id === empNum);
        employee.firstName = event.target.value;

        this.applyNameDiscount(employee);
    }

    updateLastName = (empNum, event) => {
        let employee = this.state.employees.find(emp => emp.id === empNum);
        employee.lastName = event.target.value;
    }

    updateDependentFirstName = (depNum, empNum, event) => {
        let employee = this.state.employees.find(emp => emp.id === empNum);
        let dependent = employee.dependents.find(dep => dep.id === depNum);

        dependent.firstName = event.target.value;

        this.applyNameDiscount(dependent);
    }

    updateDependentLastName = (depNum, empNum, event) => {
        let employee = this.state.employees.find(emp => emp.id === empNum);
        let dependent = employee.dependents.find(dep => dep.id === depNum);

        dependent.lastName = event.target.value;
    }

    employeeFormTemplate = (empNum) => {
        return (
            <Row key={'employee-' + empNum}>            
                <FormGroup>
                    <Row>
                        <Col md={12}>
                            <ControlLabel>Employee #{empNum}</ControlLabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormControl
                                id="firstName"
                                type="text"
                                label="First Name"
                                placeholder="First Name"
                                onChange={(e) => { this.updateFirstName(empNum, e)}}
                            />
                        </Col>
                        <Col md={4}>
                            <FormControl
                                id="lastName"
                                type="text"
                                label="Last Name"
                                placeholder="Last Name"
                                onChange={(e) => { this.updateLastName(empNum, e)} }
                            />
                        </Col>
                        <Col md={4}>
                            <Button bsStyle="primary" onClick={() => { this.addDependent(empNum)} }><Glyphicon glyph='plus' /> Add Dependent</Button>
                        </Col>
                    </Row>                 
                    {this.dependentRows(empNum)}
                </FormGroup>
            </Row>
        )
    }

    addDependent = (empNum) => {

        let dependents = this.state.dependents;

        if (!dependents[empNum])
        {
            let divider =
                (
                    <Row>
                        <hr />
                        <Col md={12}>
                            <ControlLabel>Dependents</ControlLabel>
                        </Col>
                    </Row>
                );

            dependents[empNum] = [];
            dependents[empNum].push(divider);
        }

        let dependentNum = dependents[empNum].length;

        let employee = this.state.employees.find(emp => emp.id === empNum);
        employee.dependents.push({ id: dependentNum, firstName: "", lastName: "", discount: 0, cost: 500 });

        let form =
            (
                <Row key={"dependent-" + dependentNum + "-" + empNum}>
                    <FormGroup>
                        <Col md={12}>
                            <Row>
                                <Col md={4}>
                                    <FormControl
                                        id="firstName"
                                        type="text"
                                        label="First Name"
                                        placeholder="First Name"
                                        onChange={(e) => { this.updateDependentFirstName(dependentNum, empNum, e) }}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormControl
                                        id="lastName"
                                        type="text"
                                        label="Last Name"
                                        placeholder="Last Name"
                                        onChange={(e) => { this.updateDependentLastName(dependentNum, empNum, e) }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </FormGroup>
                </Row>
            );
        
        dependents[empNum].push(form);

        this.setState({ dependents: dependents })
    }

    dependentRows = (empNum) => {
        return this.state.dependents[empNum]
    }

    submitFormButton = () => {
        return (
            <Row key="submitFormButton">
                <Button bsStyle="primary" onClick={this.displayTotal}> Get Quote!</Button>
            </Row>
        )
    }

    getUserCost = (user) => {
        return user.cost - user.discount;
    }

    calculateCosts = () => {
        let employees = this.state.employees;

        for (var i = 0; i < employees.length; i++) {
            let employee = employees[i];
            let dependents = employee.dependents;
            let dependentCost = 0;
            let totalCost = 0;

            for (var j = 0; j < dependents.length; j++) {
                dependentCost += this.getUserCost(dependents[j]);
            }

            totalCost = this.getUserCost(employee) + dependentCost;
            employee.cost = totalCost;
        }
    }

    displayTotal = () => {
        this.calculateCosts();

        this.state.quote = 
        (
            <Table responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Account Type</th>
                        <th>Discount</th>
                        <th>Cost</th>
                        <th>Total for Year</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.employees.map(emp => 
                        <div>
                            <tr key={emp.firstName}>
                                <td>{emp.firstName} + " " + {emp.lastName}</td>
                                <td>Employee</td>
                                <td>{emp.discount}</td>
                                <td>{emp.cost}</td>
                            </tr>
                            
                            { emp.dependents.map(dep =>
                                    <tr key={dep.firstName}>
                                        <td>{dep.firstName} + " " + {dep.lastName}</td>
                                        <td>Dependent</td>
                                        <td>{dep.discount}</td>
                                        <td>{dep.cost}</td>
                                    </tr>
                            )}
                        </div>
                    )}
                </tbody>
            </Table>
        );
    }

    employeeForm = () => {
        let form = [];

        if (this.state.numEmployees === 0) {
            form = <span></span>;
        }

        else {
            for (var i = 1; i <= this.state.numEmployees; i++)
            {
                form.push(this.employeeFormTemplate(i));

                this.state.employees.push(
                    {
                        id: i,
                        firstName: "",
                        lastName: "",
                        discount: 0,
                        cost: 1000,
                        dependents: [{}]
                    }
                );
            }

            form.push(this.submitFormButton());
        }

        return form;
    }

    employeeNumberForm = () => {
        if (this.state.numEmployees === 0) {
            return (
                <Form onSubmit={this.submitHandler}>
                    <FormGroup controlId="employeeNumForm">
                        <Row>
                            <ControlLabel>Number of Employees</ControlLabel>
                        </Row>
                        <Row>
                            <FormControl componentClass="select" placeholder="select" onChange={this.handleChange}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </FormControl>
                        </Row>
                        <Row>
                            <Button bsStyle="primary" type="submit" onClick={this.addNumEmployees}> Submit</Button>
                        </Row>
                    </FormGroup>
                </Form>
            );
        }
    }

    submitHandler = e => {
        e.preventDefault();
    }

    render() {
        if (!this.state.quote) {
            return (
                <div className="container">
                    {this.employeeNumberForm()}
                    <hr />
                    {this.employeeForm()}
                </div>
            );
        }

        else {
            return this.state.quote;
        }
    }
}
